from django.conf import settings
from django.db import models

from apps.catalog.models import Category
from apps.profiles.models import FreelancerProfile


class JobRequest(models.Model):
    """A klient's request for work — quoted on by freelancers."""

    class Status(models.TextChoices):
        OPEN = "open", "E hapur"
        IN_PROGRESS = "in_progress", "Në proces"
        COMPLETED = "completed", "Përfunduar"
        CANCELLED = "cancelled", "Anuluar"

    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="job_requests",
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="jobs",
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    budget_min = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True,
    )
    budget_max = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True,
    )
    currency = models.CharField(max_length=3, default="ALL")
    address = models.CharField(max_length=255, blank=True, default="")
    city = models.CharField(max_length=120)
    country = models.CharField(max_length=2, default="AL")
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.OPEN,
    )
    scheduled_at = models.DateTimeField(null=True, blank=True)
    accepted_quote = models.OneToOneField(
        "Quote",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="accepted_for_job",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "job_requests"
        ordering = ("-created_at",)
        indexes = [
            models.Index(fields=["status", "-created_at"]),
            models.Index(fields=["category", "status"]),
            models.Index(fields=["city", "status"]),
        ]

    def __str__(self) -> str:
        return f"{self.title} ({self.get_status_display()})"


class Quote(models.Model):
    """A freelancer's price proposal for a JobRequest."""

    class Status(models.TextChoices):
        PENDING = "pending", "Në pritje"
        ACCEPTED = "accepted", "Pranuar"
        REJECTED = "rejected", "Refuzuar"
        WITHDRAWN = "withdrawn", "Tërhequr"

    job = models.ForeignKey(
        JobRequest,
        on_delete=models.CASCADE,
        related_name="quotes",
    )
    freelancer = models.ForeignKey(
        FreelancerProfile,
        on_delete=models.CASCADE,
        related_name="quotes",
    )
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default="ALL")
    message = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "quotes"
        ordering = ("-created_at",)
        constraints = [
            models.UniqueConstraint(
                fields=["job", "freelancer"],
                name="unique_quote_per_job_freelancer",
            ),
        ]
        indexes = [
            models.Index(fields=["job", "status"]),
            models.Index(fields=["freelancer", "status"]),
        ]

    def __str__(self) -> str:
        return f"{self.freelancer.user.full_name} → {self.job.title} ({self.get_status_display()})"


class Review(models.Model):
    """A klient's rating + comment for a freelancer after a completed job.

    One review per job. Reviews are immutable once posted (V1).
    """

    job = models.OneToOneField(
        JobRequest,
        on_delete=models.CASCADE,
        related_name="review",
    )
    reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reviews_written",
    )
    reviewee = models.ForeignKey(
        FreelancerProfile,
        on_delete=models.CASCADE,
        related_name="reviews",
    )
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "reviews"
        ordering = ("-created_at",)
        indexes = [models.Index(fields=["reviewee", "-created_at"])]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(rating__gte=1) & models.Q(rating__lte=5),
                name="review_rating_in_range",
            ),
        ]

    def __str__(self) -> str:
        return f"{self.reviewer} → {self.reviewee} ({self.rating}/5)"
