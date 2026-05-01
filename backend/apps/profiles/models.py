from django.conf import settings
from django.db import models
from django.utils.text import slugify


def _build_freelancer_slug(profile: "FreelancerProfile") -> str:
    """Slug source: company name if set, else user's full name, else email local-part."""
    source = ""
    if profile.company_id and profile.company:
        source = profile.company.name
    if not source and profile.user_id:
        full = profile.user.full_name.strip()
        source = full or profile.user.email.split("@")[0]
    base = slugify(source) or f"profesionist-{profile.user_id or 'x'}"
    return base


def _unique_slug(profile: "FreelancerProfile", base: str) -> str:
    qs = FreelancerProfile.objects.exclude(pk=profile.pk)
    candidate = base
    i = 2
    while qs.filter(slug=candidate).exists():
        candidate = f"{base}-{i}"
        i += 1
    return candidate


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
    slug = models.SlugField(max_length=140, unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "freelancer_profiles"

    def __str__(self) -> str:
        return f"Profesionist: {self.user.full_name}"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = _unique_slug(self, _build_freelancer_slug(self))
        super().save(*args, **kwargs)


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
