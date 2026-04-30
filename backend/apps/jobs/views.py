from django.db import transaction
from django.db.models import Q
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import User
from apps.catalog.views import IsFreelancer

from apps.notifications.models import Notification
from apps.notifications.services import notify

from .models import JobRequest, Quote, Review
from .serializers import (
    JobWriteSerializer,
    MyJobDetailSerializer,
    MyJobReadSerializer,
    MyQuoteSerializer,
    OpenJobDetailSerializer,
    OpenJobListSerializer,
    QuoteOnJobSerializer,
    QuoteWriteSerializer,
    ReviewPublicSerializer,
    ReviewWriteSerializer,
)
from .services import recompute_freelancer_rating


class IsKlient(permissions.BasePermission):
    message = "Kjo veprim është vetëm për klientë."

    def has_permission(self, request, view) -> bool:
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == User.Role.KLIENT
        )


class JobPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = "page_size"
    max_page_size = 60


# ---------------------------------------------------------------------------
# Klient: their own jobs
# ---------------------------------------------------------------------------

class MyJobViewSet(viewsets.ModelViewSet):
    permission_classes = (IsKlient,)
    pagination_class = JobPagination

    def get_queryset(self):
        return (
            JobRequest.objects
            .filter(customer=self.request.user)
            .select_related("category", "review")
            .prefetch_related("quotes__freelancer__user")
        )

    def get_serializer_class(self):
        if self.action == "retrieve":
            return MyJobDetailSerializer
        if self.action in ("create", "update", "partial_update"):
            return JobWriteSerializer
        return MyJobReadSerializer

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

    def update(self, request, *args, **kwargs):
        job = self.get_object()
        if job.status != JobRequest.Status.OPEN:
            raise PermissionDenied(
                "Mund të redaktohen vetëm kërkesat e hapura.",
            )
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        job = self.get_object()
        if job.status not in {JobRequest.Status.OPEN}:
            raise PermissionDenied(
                "Mund të fshihen vetëm kërkesat e hapura.",
            )
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=["post"], url_path="cancel")
    def cancel(self, request, pk=None):
        job = self.get_object()
        if job.status != JobRequest.Status.OPEN:
            raise PermissionDenied("Vetëm kërkesat e hapura mund të anulohen.")
        job.status = JobRequest.Status.CANCELLED
        job.save(update_fields=["status", "updated_at"])
        pending = list(
            job.quotes.filter(status=Quote.Status.PENDING).select_related("freelancer__user"),
        )
        Quote.objects.filter(job=job, status=Quote.Status.PENDING).update(
            status=Quote.Status.REJECTED,
        )
        for q in pending:
            notify(
                user=q.freelancer.user,
                kind=Notification.Kind.JOB_CANCELLED,
                title=f"Kërkesa «{job.title}» u anulua",
                body=f"{job.customer.first_name} anuloi kërkesën — oferta juaj nuk është më në pritje.",
                link=f"/dashboard/freelancer/punet",
                actor=request.user,
                job=job,
                quote=q,
            )
        return Response(MyJobDetailSerializer(job).data)

    @action(detail=True, methods=["post"], url_path="complete")
    def complete(self, request, pk=None):
        job = self.get_object()
        if job.status != JobRequest.Status.IN_PROGRESS:
            raise PermissionDenied("Vetëm kërkesat në proces mund të përfundohen.")
        job.status = JobRequest.Status.COMPLETED
        job.save(update_fields=["status", "updated_at"])
        if job.accepted_quote:
            notify(
                user=job.accepted_quote.freelancer.user,
                kind=Notification.Kind.JOB_COMPLETED,
                title=f"Kërkesa «{job.title}» u shënua e përfunduar",
                body=f"{job.customer.first_name} e shënoi punën si të përfunduar. Ata mund t’ju lënë një vlerësim.",
                link=f"/dashboard/freelancer/punet",
                actor=request.user,
                job=job,
                quote=job.accepted_quote,
            )
        return Response(MyJobDetailSerializer(job).data)

    @action(
        detail=True,
        methods=["post"],
        url_path="quotes/(?P<quote_id>[^/.]+)/accept",
    )
    @transaction.atomic
    def accept_quote(self, request, pk=None, quote_id=None):
        job = self.get_object()
        if job.status != JobRequest.Status.OPEN:
            raise PermissionDenied("Vetëm kërkesat e hapura mund të pranojnë oferta.")

        try:
            quote = job.quotes.select_for_update().get(
                id=quote_id, status=Quote.Status.PENDING,
            )
        except Quote.DoesNotExist:
            raise ValidationError("Oferta nuk u gjet ose nuk është më në pritje.")

        # Accept this quote, reject all other pending quotes, move job to in_progress
        quote.status = Quote.Status.ACCEPTED
        quote.save(update_fields=["status", "updated_at"])
        job.quotes.exclude(id=quote.id).filter(status=Quote.Status.PENDING).update(
            status=Quote.Status.REJECTED,
        )
        job.accepted_quote = quote
        job.status = JobRequest.Status.IN_PROGRESS
        job.save(update_fields=["accepted_quote", "status", "updated_at"])

        # Notify accepted freelancer
        notify(
            user=quote.freelancer.user,
            kind=Notification.Kind.QUOTE_ACCEPTED,
            title=f"Oferta juaj u pranua: «{job.title}»",
            body=f"{job.customer.first_name} pranoi ofertën tuaj prej {quote.price} {quote.currency}.",
            link=f"/dashboard/freelancer/punet/{job.id}",
            actor=request.user,
            job=job,
            quote=quote,
        )
        # Notify rejected freelancers
        for rej in job.quotes.filter(status=Quote.Status.REJECTED).exclude(id=quote.id).select_related("freelancer__user"):
            notify(
                user=rej.freelancer.user,
                kind=Notification.Kind.QUOTE_REJECTED,
                title=f"Oferta juaj nuk u zgjodh: «{job.title}»",
                body=f"{job.customer.first_name} zgjodhi një ofertë tjetër për këtë punë.",
                link=f"/dashboard/freelancer/punet",
                actor=request.user,
                job=job,
                quote=rej,
            )

        # Re-fetch with fresh prefetched quotes so the serializer sees post-update state
        fresh = self.get_queryset().get(pk=job.pk)
        return Response(MyJobDetailSerializer(fresh).data)


# ---------------------------------------------------------------------------
# Freelancer: open jobs + quoting
# ---------------------------------------------------------------------------

class OpenJobsListView(ListAPIView):
    """Logged-in freelancers see open jobs, optionally filtered."""
    permission_classes = (IsFreelancer,)
    serializer_class = OpenJobListSerializer
    pagination_class = JobPagination

    def get_queryset(self):
        qs = (
            JobRequest.objects
            .filter(status=JobRequest.Status.OPEN)
            .select_related("category", "customer")
        )

        params = self.request.query_params

        q = (params.get("q") or "").strip()
        if q:
            qs = qs.filter(
                Q(title__icontains=q)
                | Q(description__icontains=q)
                | Q(city__icontains=q)
            )

        category = (params.get("category") or "").strip()
        if category:
            qs = qs.filter(category__slug=category)

        city = (params.get("city") or "").strip()
        if city:
            qs = qs.filter(city__iexact=city)

        if (params.get("mine_only") or "").lower() in {"1", "true", "yes"}:
            # Filter to jobs in categories the freelancer offers OR cities they cover
            profile = self.request.user.freelancer_profile
            cat_ids = profile.services.values_list("category_id", flat=True)
            cities = profile.service_areas.values_list("city", flat=True)
            qs = qs.filter(
                Q(category_id__in=cat_ids) | Q(city__in=cities),
            ).distinct()

        return qs.order_by("-created_at")


class OpenJobDetailView(RetrieveAPIView):
    permission_classes = (IsFreelancer,)
    serializer_class = OpenJobDetailSerializer

    def get_queryset(self):
        return JobRequest.objects.select_related("category", "customer")

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx["request"] = self.request
        return ctx


class MyQuoteViewSet(viewsets.ModelViewSet):
    """Freelancer's view of their own quotes."""
    permission_classes = (IsFreelancer,)
    serializer_class = MyQuoteSerializer

    http_method_names = ["get", "patch", "delete", "head", "options"]

    def get_queryset(self):
        return (
            Quote.objects
            .filter(freelancer=self.request.user.freelancer_profile)
            .select_related("job", "job__category")
        )

    def update(self, request, *args, **kwargs):
        quote = self.get_object()
        if quote.status != Quote.Status.PENDING:
            raise PermissionDenied(
                "Vetëm ofertat në pritje mund të modifikohen.",
            )
        # Allow editing price / message only
        write = QuoteWriteSerializer(quote, data=request.data, partial=True)
        write.is_valid(raise_exception=True)
        write.save()
        return Response(MyQuoteSerializer(quote).data)

    def destroy(self, request, *args, **kwargs):
        quote = self.get_object()
        if quote.status != Quote.Status.PENDING:
            raise PermissionDenied("Vetëm ofertat në pritje mund të tërhiqen.")
        quote.status = Quote.Status.WITHDRAWN
        quote.save(update_fields=["status", "updated_at"])
        return Response(status=status.HTTP_204_NO_CONTENT)


class ReviewCreateView(APIView):
    """POST /api/reviews/ — klient reviews a freelancer after completed job."""

    permission_classes = (IsKlient,)

    @transaction.atomic
    def post(self, request):
        ser = ReviewWriteSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        data = ser.validated_data

        try:
            job = JobRequest.objects.select_for_update().get(
                id=data["job_id"],
                customer=request.user,
            )
        except JobRequest.DoesNotExist:
            return Response(
                {"detail": "Kërkesa nuk u gjet ose nuk është juaja."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if job.status != JobRequest.Status.COMPLETED:
            return Response(
                {"detail": "Mund të vlerësoni vetëm punët e përfunduara."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not job.accepted_quote:
            return Response(
                {"detail": "Kjo punë nuk ka një ofertë të pranuar."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if Review.objects.filter(job=job).exists():
            return Response(
                {"detail": "Ju keni vlerësuar tashmë këtë punë."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        review = Review.objects.create(
            job=job,
            reviewer=request.user,
            reviewee=job.accepted_quote.freelancer,
            rating=data["rating"],
            comment=(data.get("comment") or "").strip(),
        )
        recompute_freelancer_rating(job.accepted_quote.freelancer)

        notify(
            user=job.accepted_quote.freelancer.user,
            kind=Notification.Kind.REVIEW_RECEIVED,
            title=f"Vlerësim i ri: {review.rating}/5 yje",
            body=(
                (review.comment[:200] + ("…" if len(review.comment) > 200 else ""))
                if review.comment
                else f"{request.user.first_name} ju vlerësoi {review.rating}/5 yje."
            ),
            link=f"/profesionist/{job.accepted_quote.freelancer.user_id}",
            actor=request.user,
            job=job,
            review=review,
        )

        return Response(
            ReviewPublicSerializer(review).data,
            status=status.HTTP_201_CREATED,
        )


class FreelancerReviewsListView(ListAPIView):
    """Public list of a freelancer's reviews."""

    permission_classes = (permissions.AllowAny,)
    serializer_class = ReviewPublicSerializer
    pagination_class = JobPagination

    def get_queryset(self):
        from apps.profiles.models import FreelancerProfile
        user_id = self.kwargs["user_id"]
        try:
            profile = FreelancerProfile.objects.get(user_id=user_id)
        except FreelancerProfile.DoesNotExist:
            return Review.objects.none()
        return (
            Review.objects
            .filter(reviewee=profile)
            .select_related("reviewer", "job", "job__category")
            .order_by("-created_at")
        )


class JobQuoteCreateView(viewsets.ViewSet):
    """POST /api/jobs/<job_id>/quote/ — submit a quote for an open job."""

    permission_classes = (IsFreelancer,)

    def create(self, request, job_id=None):
        try:
            job = JobRequest.objects.get(id=job_id, status=JobRequest.Status.OPEN)
        except JobRequest.DoesNotExist:
            return Response(
                {"detail": "Kërkesa nuk u gjet ose nuk është më e hapur."},
                status=status.HTTP_404_NOT_FOUND,
            )

        profile = request.user.freelancer_profile
        if Quote.objects.filter(job=job, freelancer=profile).exclude(
            status=Quote.Status.WITHDRAWN,
        ).exists():
            return Response(
                {"detail": "Ju keni dorëzuar tashmë një ofertë për këtë kërkesë."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = QuoteWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        quote = Quote.objects.create(
            job=job,
            freelancer=profile,
            **serializer.validated_data,
        )

        notify(
            user=job.customer,
            kind=Notification.Kind.QUOTE_RECEIVED,
            title=f"Ofertë e re për «{job.title}»",
            body=f"{request.user.full_name} dorëzoi një ofertë prej {quote.price} {quote.currency}.",
            link=f"/dashboard/klient/kerkesat/{job.id}",
            actor=request.user,
            job=job,
            quote=quote,
        )

        return Response(MyQuoteSerializer(quote).data, status=status.HTTP_201_CREATED)
