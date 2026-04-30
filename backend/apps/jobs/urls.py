from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    FreelancerReviewsListView,
    JobQuoteCreateView,
    MyJobViewSet,
    MyQuoteViewSet,
    OpenJobDetailView,
    OpenJobsListView,
    ReviewCreateView,
)

app_name = "jobs"

router = DefaultRouter()
router.register("me/jobs", MyJobViewSet, basename="me-jobs")
router.register("me/quotes", MyQuoteViewSet, basename="me-quotes")

urlpatterns = [
    path("jobs/", OpenJobsListView.as_view(), name="open-jobs-list"),
    path("jobs/<int:pk>/", OpenJobDetailView.as_view(), name="open-jobs-detail"),
    path(
        "jobs/<int:job_id>/quote/",
        JobQuoteCreateView.as_view({"post": "create"}),
        name="job-quote-create",
    ),
    path("reviews/", ReviewCreateView.as_view(), name="reviews-create"),
    path(
        "freelancers/<int:user_id>/reviews/",
        FreelancerReviewsListView.as_view(),
        name="freelancer-reviews",
    ),
    path("", include(router.urls)),
]
