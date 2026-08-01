from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from django.db.models import Q
from rest_framework import permissions, status, viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import User
from apps.profiles.models import FreelancerProfile

from .models import Category, Service, ServiceArea
from .pricing import compute_rate_benchmark
from .serializers import (
    CategorySerializer,
    FreelancerDetailSerializer,
    FreelancerListItemSerializer,
    ServiceAreaSerializer,
    ServiceReadSerializer,
    ServiceWriteSerializer,
)


# ---------------------------------------------------------------------------
# Categories (public list)
# ---------------------------------------------------------------------------

class CategoryListView(ListAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = CategorySerializer

    def get_queryset(self):
        from django.db.models import Count
        return (
            Category.objects
            .filter(is_active=True)
            .annotate(
                freelancer_count=Count(
                    "services__freelancer",
                    filter=Q(services__is_active=True),
                    distinct=True,
                ),
            )
            .order_by("sort_order", "name")
        )


class RateBenchmarkView(APIView):
    """Public, read-only market-rate stats for a category + area — no
    sensitive data, just aggregate numbers the frontend uses to decide
    whether to show a non-blocking "below market rate" warning."""

    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        category_slug = (request.query_params.get("category") or "").strip()
        city = (request.query_params.get("city") or "").strip()
        country = (request.query_params.get("country") or "").strip()
        currency = (request.query_params.get("currency") or "ALL").strip()

        try:
            category = Category.objects.get(slug=category_slug, is_active=True)
        except Category.DoesNotExist:
            return Response({
                "currency": currency.upper(),
                "sample_size": 0,
                "median": None,
                "p25": None,
                "scope": "insufficient",
            })

        return Response(
            compute_rate_benchmark(category.id, city, country, currency),
        )


# ---------------------------------------------------------------------------
# Services — owner-only CRUD
# ---------------------------------------------------------------------------

class IsFreelancer(permissions.BasePermission):
    message = "Kjo veprim është vetëm për profesionistë."

    def has_permission(self, request, view) -> bool:
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == User.Role.FREELANCER
        )


class MyServiceViewSet(viewsets.ModelViewSet):
    """CRUD for the current freelancer's services."""

    permission_classes = (IsFreelancer,)

    def get_queryset(self):
        return Service.objects.filter(
            freelancer=self.request.user.freelancer_profile,
        ).select_related("category").order_by("-created_at")

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return ServiceWriteSerializer
        return ServiceReadSerializer

    def perform_create(self, serializer):
        serializer.save(freelancer=self.request.user.freelancer_profile)


# ---------------------------------------------------------------------------
# Service Areas — owner-only CRUD
# ---------------------------------------------------------------------------

class MyServiceAreaViewSet(viewsets.ModelViewSet):
    permission_classes = (IsFreelancer,)
    serializer_class = ServiceAreaSerializer

    def get_queryset(self):
        return ServiceArea.objects.filter(
            freelancer=self.request.user.freelancer_profile,
        ).order_by("city")

    def perform_create(self, serializer):
        try:
            serializer.save(freelancer=self.request.user.freelancer_profile)
        except Exception as e:
            # Likely the unique constraint (same city already added)
            from django.db import IntegrityError
            if isinstance(e, IntegrityError):
                raise PermissionDenied("Ky qytet është shtuar tashmë.")
            raise


# ---------------------------------------------------------------------------
# Public freelancer search + detail
# ---------------------------------------------------------------------------

class FreelancerPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = "page_size"
    max_page_size = 60


class FreelancerListView(ListAPIView):
    """Public list of freelancers with search and filters."""

    permission_classes = (permissions.AllowAny,)
    serializer_class = FreelancerListItemSerializer
    pagination_class = FreelancerPagination

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx["request"] = self.request
        return ctx

    def get_queryset(self):
        qs = (
            FreelancerProfile.objects
            .select_related("user", "company")
            .prefetch_related("services__category", "service_areas")
            .filter(user__is_active=True)
        )

        params = self.request.query_params

        slug = (params.get("slug") or "").strip()
        if slug:
            qs = qs.filter(slug=slug)

        q = (params.get("q") or "").strip()
        if q:
            qs = qs.filter(
                Q(user__first_name__icontains=q)
                | Q(user__last_name__icontains=q)
                | Q(headline__icontains=q)
                | Q(bio__icontains=q)
                | Q(services__title__icontains=q)
                | Q(company__name__icontains=q)
            ).distinct()

        category = (params.get("category") or "").strip()
        if category:
            qs = qs.filter(services__category__slug=category, services__is_active=True).distinct()

        # country + city must be filtered in a single service_areas__ lookup
        # so both conditions match the *same* ServiceArea row — a freelancer
        # serving both Tiranë (AL) and New York (US) must not match
        # country=US + city=Tiranë from two different rows.
        country = (params.get("country") or "").strip().upper()
        city = (params.get("city") or "").strip()
        area_filter = {}
        if country:
            area_filter["service_areas__country"] = country
        if city:
            from .cities import canonical_city
            area_filter["service_areas__city__iexact"] = canonical_city(city)
        if area_filter:
            qs = qs.filter(**area_filter).distinct()

        # Geo "near me" filter — accepts ?lat=&lng=&radius_km=
        lat = params.get("lat")
        lng = params.get("lng")
        if lat and lng:
            try:
                point = Point(float(lng), float(lat), srid=4326)
                radius_km = float(params.get("radius_km") or 25)
                qs = qs.filter(
                    service_areas__center_point__distance_lte=(point, D(km=radius_km)),
                ).distinct()
            except (TypeError, ValueError):
                pass  # silently ignore malformed coords

        if (params.get("verified") or "").lower() in {"1", "true", "yes"}:
            qs = qs.filter(is_verified=True)

        return qs.order_by("-is_verified", "-avg_rating", "-review_count")


class FreelancerDetailView(RetrieveAPIView):
    """Public profile by underlying User.id (numeric, canonical)."""

    permission_classes = (permissions.AllowAny,)
    serializer_class = FreelancerDetailSerializer
    lookup_field = "user_id"
    lookup_url_kwarg = "user_id"

    def get_queryset(self):
        return (
            FreelancerProfile.objects
            .select_related("user", "company")
            .prefetch_related("services__category", "service_areas")
            .filter(user__is_active=True, user__role=User.Role.FREELANCER)
        )

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx["request"] = self.request
        return ctx
