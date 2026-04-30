import logging

from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from apps.profiles.models import Company, FreelancerProfile, KlientProfile

from .models import User
from .services import send_verification_email

logger = logging.getLogger(__name__)


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "full_name",
            "phone",
            "role",
            "is_email_verified",
            "preferred_language",
            "country",
            "date_joined",
        )
        read_only_fields = ("id", "is_email_verified", "date_joined")


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    phone = serializers.CharField(max_length=32, required=False, allow_blank=True)
    role = serializers.ChoiceField(
        choices=[User.Role.FREELANCER, User.Role.KLIENT],
    )
    company_name = serializers.CharField(
        max_length=200, required=False, allow_blank=True,
    )

    def validate_email(self, value: str) -> str:
        normalized = value.lower().strip()
        if User.objects.filter(email=normalized).exists():
            raise serializers.ValidationError(
                "Ky email është regjistruar tashmë.",
            )
        return normalized

    def validate_password(self, value: str) -> str:
        validate_password(value)
        return value

    def validate_company_name(self, value: str) -> str:
        v = (value or "").strip()
        if v and "@" in v:
            raise serializers.ValidationError(
                "Emri i kompanisë nuk mund të jetë adresë emaili.",
            )
        return v

    @transaction.atomic
    def create(self, validated_data: dict) -> User:
        company_name = validated_data.pop("company_name", "").strip()
        password = validated_data.pop("password")

        user = User.objects.create_user(password=password, **validated_data)

        if user.role == User.Role.FREELANCER:
            company = None
            if company_name:
                company, _ = Company.objects.get_or_create(
                    name=company_name,
                    country=user.country,
                )
            FreelancerProfile.objects.create(user=user, company=company)
        elif user.role == User.Role.KLIENT:
            KlientProfile.objects.create(user=user)

        # Send verification email outside the inner profile-creation block but
        # still inside the transaction. If the mail backend raises, the whole
        # registration is rolled back so the user can retry cleanly.
        try:
            send_verification_email(user)
        except Exception:
            logger.exception("Failed to send verification email to %s", user.email)
            raise serializers.ValidationError(
                {"detail": "Nuk arritëm të dërgojmë email verifikimi. Provoni përsëri."},
            )

        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs: dict) -> dict:
        email = attrs["email"].lower().strip()
        password = attrs["password"]
        user = authenticate(
            request=self.context.get("request"),
            username=email,
            password=password,
        )
        if user is None:
            raise serializers.ValidationError(
                {"detail": "Email ose fjalëkalim i pasaktë."},
            )
        if not user.is_active:
            raise serializers.ValidationError(
                {"detail": "Llogaria juaj është çaktivizuar."},
            )
        attrs["user"] = user
        return attrs


def tokens_for_user(user: User) -> dict:
    refresh = RefreshToken.for_user(user)
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }
