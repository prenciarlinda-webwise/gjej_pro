from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    CategoryListView,
    FreelancerDetailView,
    FreelancerListView,
    MyServiceAreaViewSet,
    MyServiceViewSet,
    RateBenchmarkView,
)

app_name = "catalog"

router = DefaultRouter()
router.register("me/services", MyServiceViewSet, basename="me-services")
router.register("me/service-areas", MyServiceAreaViewSet, basename="me-areas")

urlpatterns = [
    path("categories/", CategoryListView.as_view(), name="categories"),
    path("freelancers/", FreelancerListView.as_view(), name="freelancers-list"),
    path(
        "freelancers/<int:user_id>/",
        FreelancerDetailView.as_view(),
        name="freelancers-detail",
    ),
    path("rate-benchmark/", RateBenchmarkView.as_view(), name="rate-benchmark"),
    path("", include(router.urls)),
]
