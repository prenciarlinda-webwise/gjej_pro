from django.conf import settings
from django.db import models


class Company(models.Model):
    name = models.CharField(max_length=200)
    registration_number = models.CharField(max_length=100, blank=True)
    vat_number = models.CharField(max_length=50, blank=True)
    country = models.CharField(max_length=2, default="AL")
    website = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "companies"
        constraints = [
            models.UniqueConstraint(
                fields=["name", "country"],
                name="unique_company_name_per_country",
            ),
        ]
        verbose_name_plural = "companies"

    def __str__(self) -> str:
        return self.name


class FreelancerProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="freelancer_profile",
    )
    company = models.ForeignKey(
        Company,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="freelancers",
    )
    headline = models.CharField(max_length=200, blank=True)
    bio = models.TextField(blank=True)
    years_experience = models.PositiveIntegerField(null=True, blank=True)
    hourly_rate_min = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True,
    )
    hourly_rate_max = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True,
    )
    currency = models.CharField(max_length=3, default="ALL")
    avg_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    review_count = models.PositiveIntegerField(default=0)
    is_verified = models.BooleanField(default=False)
    avatar = models.ImageField(
        upload_to="avatars/freelancer/", null=True, blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "freelancer_profiles"

    def __str__(self) -> str:
        return f"Profesionist: {self.user.full_name}"


class KlientProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="klient_profile",
    )
    default_address = models.CharField(max_length=255, blank=True, default="")
    city = models.CharField(max_length=120, blank=True, default="")
    avatar = models.ImageField(
        upload_to="avatars/klient/", null=True, blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "klient_profiles"

    def __str__(self) -> str:
        return f"Klient: {self.user.full_name}"
