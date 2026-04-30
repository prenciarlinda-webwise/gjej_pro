from datetime import timedelta

from django.db.models import Count, Q
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import EmailVerificationToken, User
from .serializers import (
    LoginSerializer,
    RegisterSerializer,
    UserSerializer,
    tokens_for_user,
)
from .services import send_verification_email


class RegisterView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "user": UserSerializer(user).data,
                "tokens": tokens_for_user(user),
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        return Response(
            {
                "user": UserSerializer(user).data,
                "tokens": tokens_for_user(user),
            }
        )


class MeView(APIView):
    def get(self, request):
        return Response(UserSerializer(request.user).data)


class VerifyEmailView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        token_value = (request.data.get("token") or "").strip()
        if not token_value:
            return Response(
                {"detail": "Tokeni mungon."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            token = EmailVerificationToken.objects.select_related("user").get(
                token=token_value,
            )
        except EmailVerificationToken.DoesNotExist:
            return Response(
                {"detail": "Linku është i pavlefshëm."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if token.is_consumed():
            if token.user.is_email_verified:
                return Response(
                    {"detail": "Emaili është verifikuar tashmë.", "already": True},
                )
            return Response(
                {"detail": "Linku është përdorur tashmë."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if token.is_expired():
            return Response(
                {"detail": "Linku ka skaduar. Kërkoni një link të ri."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        token.consume()
        user = token.user
        if not user.is_email_verified:
            user.is_email_verified = True
            user.save(update_fields=["is_email_verified", "updated_at"])
        return Response({"detail": "Emaili u verifikua me sukses.", "email": user.email})


class ResendVerificationView(APIView):
    """Authenticated user requests a new verification link."""

    THROTTLE_SECONDS = 60

    def post(self, request):
        user = request.user
        if user.is_email_verified:
            return Response(
                {"detail": "Emaili juaj është verifikuar tashmë."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        last = (
            EmailVerificationToken.objects
            .filter(user=user)
            .order_by("-created_at")
            .first()
        )
        if last:
            elapsed = (timezone.now() - last.created_at).total_seconds()
            if elapsed < self.THROTTLE_SECONDS:
                wait = int(self.THROTTLE_SECONDS - elapsed)
                return Response(
                    {"detail": f"Prisni {wait} sekonda para se të kërkoni përsëri."},
                    status=status.HTTP_429_TOO_MANY_REQUESTS,
                )

        send_verification_email(user)
        return Response({"detail": "Email i ri u dërgua."})


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view) -> bool:
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_admin
        )


class AdminUserPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100


class AdminUserListView(ListAPIView):
    """Admin-only list of all users with search + role filter."""

    permission_classes = (IsAdmin,)
    serializer_class = UserSerializer
    pagination_class = AdminUserPagination

    def get_queryset(self):
        qs = User.objects.all().order_by("-date_joined")

        params = self.request.query_params
        q = (params.get("q") or "").strip()
        if q:
            qs = qs.filter(
                Q(email__icontains=q)
                | Q(first_name__icontains=q)
                | Q(last_name__icontains=q)
                | Q(phone__icontains=q)
            )

        role = (params.get("role") or "").strip()
        if role in {r.value for r in User.Role}:
            qs = qs.filter(role=role)

        is_active = (params.get("is_active") or "").lower()
        if is_active in {"1", "true", "yes"}:
            qs = qs.filter(is_active=True)
        elif is_active in {"0", "false", "no"}:
            qs = qs.filter(is_active=False)

        return qs


class AdminStatsView(APIView):
    permission_classes = (IsAdmin,)

    def get(self, request):
        now = timezone.now()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        week_start = today_start - timedelta(days=7)

        by_role = dict(
            User.objects.values_list("role").annotate(count=Count("id"))
        )

        recent = User.objects.order_by("-date_joined")[:10]

        return Response(
            {
                "totals": {
                    "all_users": User.objects.count(),
                    "freelancers": by_role.get(User.Role.FREELANCER, 0),
                    "klients": by_role.get(User.Role.KLIENT, 0),
                    "admins": by_role.get(User.Role.ADMIN, 0),
                },
                "signups": {
                    "today": User.objects.filter(date_joined__gte=today_start).count(),
                    "last_7_days": User.objects.filter(
                        date_joined__gte=week_start,
                    ).count(),
                },
                "recent": UserSerializer(recent, many=True).data,
            }
        )
