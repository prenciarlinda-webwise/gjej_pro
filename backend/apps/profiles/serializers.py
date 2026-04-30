from decimal import Decimal

from django.db import transaction
from rest_framework import serializers

from apps.accounts.models import User

from .models import Company, FreelancerProfile, KlientProfile


# ---------------------------------------------------------------------------
# Read serializers
# ---------------------------------------------------------------------------

class FreelancerProfileReadSerializer(serializers.ModelSerializer):
    company_name = serializers.SerializerMethodField()
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = FreelancerProfile
        fields = (
            "headline", "bio",
            "years_experience",
            "hourly_rate_min", "hourly_rate_max", "currency",
            "company_name",
            "avg_rating", "review_count", "is_verified",
            "avatar_url",
        )

    def get_company_name(self, obj: FreelancerProfile) -> str:
        return obj.company.name if obj.company else ""

    def get_avatar_url(self, obj: FreelancerProfile) -> str:
        return _absolute_avatar_url(self.context.get("request"), obj.avatar)


class KlientProfileReadSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = KlientProfile
        fields = ("default_address", "city", "avatar_url")

    def get_avatar_url(self, obj: KlientProfile) -> str:
        return _absolute_avatar_url(self.context.get("request"), obj.avatar)


def _absolute_avatar_url(request, avatar) -> str:
    if not avatar:
        return ""
    url = avatar.url
    if request is None:
        return url
    return request.build_absolute_uri(url)


# ---------------------------------------------------------------------------
# Patch serializer (combined User + Profile)
# ---------------------------------------------------------------------------

USER_FIELDS = ("first_name", "last_name", "phone")

FREELANCER_FIELDS = (
    "headline", "bio",
    "years_experience",
    "hourly_rate_min", "hourly_rate_max", "currency",
)

KLIENT_FIELDS = ("default_address", "city")


class ProfilePatchSerializer(serializers.Serializer):
    # User-level
    first_name = serializers.CharField(max_length=100, required=False)
    last_name = serializers.CharField(max_length=100, required=False)
    phone = serializers.CharField(max_length=32, required=False, allow_blank=True)

    # Freelancer-only
    headline = serializers.CharField(max_length=200, required=False, allow_blank=True)
    bio = serializers.CharField(required=False, allow_blank=True)
    years_experience = serializers.IntegerField(
        required=False, min_value=0, max_value=80, allow_null=True,
    )
    hourly_rate_min = serializers.DecimalField(
        max_digits=10, decimal_places=2, required=False, allow_null=True, min_value=Decimal("0"),
    )
    hourly_rate_max = serializers.DecimalField(
        max_digits=10, decimal_places=2, required=False, allow_null=True, min_value=Decimal("0"),
    )
    currency = serializers.CharField(max_length=3, required=False)
    company_name = serializers.CharField(max_length=200, required=False, allow_blank=True)

    # Klient-only
    default_address = serializers.CharField(max_length=255, required=False, allow_blank=True)
    city = serializers.CharField(max_length=120, required=False, allow_blank=True)

    def validate_company_name(self, value: str) -> str:
        v = (value or "").strip()
        if v and "@" in v:
            raise serializers.ValidationError(
                "Emri i kompanisë nuk mund të jetë adresë emaili.",
            )
        return v

    def validate(self, attrs: dict) -> dict:
        rate_min = attrs.get("hourly_rate_min")
        rate_max = attrs.get("hourly_rate_max")
        if rate_min is not None and rate_max is not None and rate_min > rate_max:
            raise serializers.ValidationError(
                {"hourly_rate_min": "Çmimi minimal nuk mund të jetë më i madh se ai maksimal."},
            )
        return attrs

    @transaction.atomic
    def save(self, user: User) -> User:
        data = self.validated_data

        # User-level updates
        user_changes = []
        for f in USER_FIELDS:
            if f in data:
                setattr(user, f, data[f])
                user_changes.append(f)
        if user_changes:
            user_changes.append("updated_at")
            user.save(update_fields=user_changes)

        # Profile-level updates by role
        if user.role == User.Role.FREELANCER:
            profile = user.freelancer_profile
            for f in FREELANCER_FIELDS:
                if f in data:
                    setattr(profile, f, data[f])
            if "company_name" in data:
                name = data["company_name"].strip()
                if name:
                    company, _ = Company.objects.get_or_create(
                        name=name, country=user.country,
                    )
                    profile.company = company
                else:
                    profile.company = None
            profile.save()
        elif user.role == User.Role.KLIENT:
            profile = user.klient_profile
            for f in KLIENT_FIELDS:
                if f in data:
                    setattr(profile, f, data[f])
            profile.save()

        return user


# ---------------------------------------------------------------------------
# Completion calculator (frontend uses this to render progress bars)
# ---------------------------------------------------------------------------

def freelancer_completion(user: User) -> float:
    p = user.freelancer_profile
    fields = [
        bool((user.phone or "").strip()),
        bool((p.headline or "").strip()),
        bool((p.bio or "").strip()),
        p.years_experience is not None,
        p.hourly_rate_min is not None or p.hourly_rate_max is not None,
        bool(user.is_email_verified),
    ]
    return round(sum(fields) / len(fields), 2)


def klient_completion(user: User) -> float:
    p = user.klient_profile
    fields = [
        bool((user.phone or "").strip()),
        bool((p.default_address or "").strip()),
        bool((p.city or "").strip()),
        bool(user.is_email_verified),
    ]
    return round(sum(fields) / len(fields), 2)
