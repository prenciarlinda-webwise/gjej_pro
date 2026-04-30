import secrets
from datetime import timedelta

from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone

from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    class Role(models.TextChoices):
        ADMIN = "admin", "Administrator"
        FREELANCER = "freelancer", "Profesionist"
        KLIENT = "klient", "Klient"

    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=32, blank=True)
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.KLIENT,
    )

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_email_verified = models.BooleanField(default=False)

    preferred_language = models.CharField(max_length=2, default="sq")
    country = models.CharField(max_length=2, default="AL")

    date_joined = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name", "role"]

    objects = UserManager()

    class Meta:
        db_table = "users"
        indexes = [
            models.Index(fields=["role"]),
            models.Index(fields=["date_joined"]),
        ]

    def __str__(self) -> str:
        return f"{self.email} ({self.role})"

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}".strip()

    @property
    def is_admin(self) -> bool:
        return self.role == self.Role.ADMIN or self.is_superuser

    @property
    def is_freelancer(self) -> bool:
        return self.role == self.Role.FREELANCER

    @property
    def is_klient(self) -> bool:
        return self.role == self.Role.KLIENT


def _new_verification_token() -> str:
    return secrets.token_urlsafe(32)


class EmailVerificationToken(models.Model):
    """One-time token used to verify a user's email address."""

    TTL = timedelta(hours=24)

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="email_verification_tokens",
    )
    token = models.CharField(max_length=64, unique=True, default=_new_verification_token)
    created_at = models.DateTimeField(auto_now_add=True)
    consumed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "email_verification_tokens"
        indexes = [models.Index(fields=["user", "-created_at"])]

    def is_expired(self) -> bool:
        return timezone.now() > self.created_at + self.TTL

    def is_consumed(self) -> bool:
        return self.consumed_at is not None

    def consume(self) -> None:
        self.consumed_at = timezone.now()
        self.save(update_fields=["consumed_at"])
