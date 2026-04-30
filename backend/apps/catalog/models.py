from django.conf import settings
from django.contrib.gis.db import models as gis_models
from django.contrib.gis.geos import Point
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.text import slugify

from apps.profiles.models import FreelancerProfile

from .cities import lookup_city

# Top-level paths reserved by the Next.js app — categories with these slugs
# would silently shadow real routes (Next's explicit routes always win).
RESERVED_SLUGS = frozenset({
    "admin", "api", "blog", "dashboard", "hyr", "kategorite", "mesazhet",
    "njoftimet", "per-profesionistet", "profesionist", "profesionistet",
    "pyetjet-e-shpeshta", "qytete", "regjistrohu", "rreth-nesh", "si-funksionon",
    "sitemap.xml", "robots.txt", "verifiko-emailin",
})


class Category(models.Model):
    """A service category (Elektricist, Hidraulik, etc.).

    Stored as a tree (`parent` FK) so we can later add subcategories like
    "Elektricist > Punime industriale" without schema changes. Seed data
    is flat for now.
    """

    name = models.CharField(max_length=120)
    name_en = models.CharField(max_length=120, blank=True, default="")
    slug = models.SlugField(max_length=140, unique=True)
    parent = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="children",
    )
    icon = models.CharField(
        max_length=40,
        blank=True,
        default="",
        help_text="Identifier for the frontend icon (e.g. 'bolt', 'wrench').",
    )
    description = models.TextField(blank=True, default="")
    sort_order = models.PositiveSmallIntegerField(default=100)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "categories"
        ordering = ("sort_order", "name")
        verbose_name_plural = "categories"
        indexes = [
            models.Index(fields=["is_active", "sort_order"]),
        ]

    def __str__(self) -> str:
        return self.name

    def clean(self):
        super().clean()
        slug = (self.slug or slugify(self.name))[:140].lower()
        if slug in RESERVED_SLUGS:
            raise ValidationError(
                {"slug": (
                    f"'{slug}' është një slug i rezervuar (përdoret nga "
                    "platforma). Zgjidhni një tjetër."
                )},
            )

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)[:140]
        # Enforce the guard on save (clean() is only called by ModelForm/admin)
        if self.slug.lower() in RESERVED_SLUGS:
            raise ValidationError(
                f"Slug '{self.slug}' është i rezervuar.",
            )
        super().save(*args, **kwargs)


class Service(models.Model):
    """A specific offering by a freelancer (instance of a Category)."""

    class PricingModel(models.TextChoices):
        HOURLY = "hourly", "Me orë"
        FIXED = "fixed", "Çmim fiks"
        QUOTE = "quote", "Me ofertë"

    freelancer = models.ForeignKey(
        FreelancerProfile,
        on_delete=models.CASCADE,
        related_name="services",
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="services",
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, default="")
    pricing_model = models.CharField(
        max_length=10,
        choices=PricingModel.choices,
        default=PricingModel.HOURLY,
    )
    price_min = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True,
    )
    price_max = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True,
    )
    currency = models.CharField(max_length=3, default="ALL")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "services"
        ordering = ("-created_at",)
        indexes = [
            models.Index(fields=["category", "is_active"]),
            models.Index(fields=["freelancer", "is_active"]),
        ]

    def __str__(self) -> str:
        return f"{self.title} ({self.freelancer.user.full_name})"


class ServiceArea(models.Model):
    """A geographic area where a freelancer offers their services.

    `center_point` is auto-populated from the city name via the city-coords
    lookup, so "near me" queries work without a real geocoder.
    """

    freelancer = models.ForeignKey(
        FreelancerProfile,
        on_delete=models.CASCADE,
        related_name="service_areas",
    )
    country = models.CharField(max_length=2, default="AL")
    region = models.CharField(max_length=100, blank=True, default="")
    city = models.CharField(max_length=120)
    center_point = gis_models.PointField(
        geography=True, null=True, blank=True,
        help_text="Auto-populated from city name; SRID 4326 (WGS84).",
    )
    radius_km = models.PositiveSmallIntegerField(default=25)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "service_areas"
        ordering = ("city",)
        constraints = [
            models.UniqueConstraint(
                fields=["freelancer", "country", "city"],
                name="unique_freelancer_country_city",
            ),
        ]
        indexes = [models.Index(fields=["country", "city"])]

    def __str__(self) -> str:
        return f"{self.city}, {self.country}"

    def save(self, *args, **kwargs):
        coords = lookup_city(self.city)
        if coords is not None:
            lat, lng = coords
            self.center_point = Point(lng, lat, srid=4326)
        super().save(*args, **kwargs)
