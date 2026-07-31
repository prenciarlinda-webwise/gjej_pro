from decimal import Decimal

from rest_framework import serializers

from .models import Category, Service, ServiceArea


class CategorySerializer(serializers.ModelSerializer):
    freelancer_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Category
        fields = (
            "id", "name", "name_en", "slug", "icon", "parent",
            "sort_order", "freelancer_count", "updated_at",
        )


# ---------------------------------------------------------------------------
# Services
# ---------------------------------------------------------------------------

class ServiceReadSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    pricing_model_label = serializers.CharField(
        source="get_pricing_model_display", read_only=True,
    )

    class Meta:
        model = Service
        fields = (
            "id", "title", "description",
            "category", "pricing_model", "pricing_model_label",
            "price_min", "price_max", "currency",
            "is_active", "created_at",
        )


class ServiceWriteSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.filter(is_active=True),
        source="category",
        write_only=True,
    )

    class Meta:
        model = Service
        fields = (
            "id", "title", "description",
            "category_id",
            "pricing_model", "price_min", "price_max", "currency",
            "is_active",
        )
        read_only_fields = ("id",)

    def validate(self, attrs: dict) -> dict:
        rate_min = attrs.get("price_min")
        rate_max = attrs.get("price_max")
        if rate_min is not None and rate_max is not None and rate_min > rate_max:
            raise serializers.ValidationError(
                {"price_min": "Çmimi minimal nuk mund të jetë më i madh se ai maksimal."},
            )
        return attrs


# ---------------------------------------------------------------------------
# Service Areas
# ---------------------------------------------------------------------------

class ServiceAreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceArea
        fields = ("id", "country", "region", "city", "created_at")
        read_only_fields = ("id", "created_at")

    def validate_city(self, value: str) -> str:
        v = (value or "").strip()
        if not v:
            raise serializers.ValidationError("Qyteti është i detyrueshëm.")
        return v


# ---------------------------------------------------------------------------
# Public freelancer search / detail
# ---------------------------------------------------------------------------

def _avatar_url(context, avatar) -> str:
    if not avatar:
        return ""
    request = context.get("request")
    url = avatar.url
    if request is None:
        return url
    return request.build_absolute_uri(url)


class FreelancerListItemSerializer(serializers.Serializer):
    """Compact representation for the search results grid."""
    id = serializers.IntegerField(source="user.id")
    slug = serializers.CharField()
    full_name = serializers.CharField(source="user.full_name")
    headline = serializers.CharField()
    company_name = serializers.SerializerMethodField()
    years_experience = serializers.IntegerField()
    hourly_rate_min = serializers.DecimalField(max_digits=10, decimal_places=2)
    hourly_rate_max = serializers.DecimalField(max_digits=10, decimal_places=2)
    currency = serializers.CharField()
    avg_rating = serializers.DecimalField(max_digits=3, decimal_places=2)
    review_count = serializers.IntegerField()
    is_verified = serializers.BooleanField()
    avatar_url = serializers.SerializerMethodField()
    cities = serializers.SerializerMethodField()
    categories = serializers.SerializerMethodField()
    updated_at = serializers.DateTimeField()

    def get_company_name(self, obj) -> str:
        return obj.company.name if obj.company else ""

    def get_avatar_url(self, obj) -> str:
        return _avatar_url(self.context, obj.avatar)

    def get_cities(self, obj) -> list[str]:
        return list(obj.service_areas.values_list("city", flat=True).distinct())

    def get_categories(self, obj) -> list[dict]:
        seen: dict[int, dict] = {}
        for s in obj.services.filter(is_active=True).select_related("category"):
            c = s.category
            seen.setdefault(
                c.id,
                {"id": c.id, "name": c.name, "name_en": c.name_en, "slug": c.slug},
            )
        return list(seen.values())


class FreelancerDetailSerializer(serializers.Serializer):
    """Full public profile — intentionally omits email/phone/private contact."""
    id = serializers.IntegerField(source="user.id")
    slug = serializers.CharField()
    full_name = serializers.CharField(source="user.full_name")
    headline = serializers.CharField()
    bio = serializers.CharField()
    company_name = serializers.SerializerMethodField()
    years_experience = serializers.IntegerField()
    hourly_rate_min = serializers.DecimalField(max_digits=10, decimal_places=2)
    hourly_rate_max = serializers.DecimalField(max_digits=10, decimal_places=2)
    currency = serializers.CharField()
    avg_rating = serializers.DecimalField(max_digits=3, decimal_places=2)
    review_count = serializers.IntegerField()
    is_verified = serializers.BooleanField()
    avatar_url = serializers.SerializerMethodField()
    categories = serializers.SerializerMethodField()
    cities = serializers.SerializerMethodField()
    services = ServiceReadSerializer(many=True)
    service_areas = ServiceAreaSerializer(many=True)
    member_since = serializers.DateTimeField(source="user.date_joined")
    updated_at = serializers.DateTimeField()

    def get_company_name(self, obj) -> str:
        return obj.company.name if obj.company else ""

    def get_avatar_url(self, obj) -> str:
        return _avatar_url(self.context, obj.avatar)

    def get_categories(self, obj) -> list[dict]:
        seen: dict[int, dict] = {}
        for s in obj.services.filter(is_active=True).select_related("category"):
            c = s.category
            seen.setdefault(
                c.id,
                {"id": c.id, "name": c.name, "name_en": c.name_en, "slug": c.slug},
            )
        return list(seen.values())

    def get_cities(self, obj) -> list[str]:
        return list(obj.service_areas.values_list("city", flat=True).distinct())
