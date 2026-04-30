from django.conf import settings
from django.db import models


class NotificationPreference(models.Model):
    """Per-user toggles for which notification kinds send an email.

    The in-app Notification row is always created — these only gate the email
    side. SMS is intentionally not modelled (out of scope; Albania pricing).
    """

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notification_prefs",
    )

    # Default everyone in. Users opt out per kind.
    email_quote_received = models.BooleanField(default=True)
    email_quote_accepted = models.BooleanField(default=True)
    email_quote_rejected = models.BooleanField(default=True)
    email_message_received = models.BooleanField(default=True)
    email_review_received = models.BooleanField(default=True)
    email_job_completed = models.BooleanField(default=True)
    email_job_cancelled = models.BooleanField(default=True)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "notification_preferences"

    def email_enabled_for(self, kind: str) -> bool:
        return getattr(self, f"email_{kind}", True)


class Notification(models.Model):
    """A per-user notification. Optional FKs link to the relevant entity so
    the frontend can render a stable `link` even after the title text changes.
    """

    class Kind(models.TextChoices):
        QUOTE_RECEIVED = "quote_received", "Quote received"
        QUOTE_ACCEPTED = "quote_accepted", "Quote accepted"
        QUOTE_REJECTED = "quote_rejected", "Quote rejected"
        MESSAGE_RECEIVED = "message_received", "Message received"
        REVIEW_RECEIVED = "review_received", "Review received"
        JOB_COMPLETED = "job_completed", "Job completed"
        JOB_CANCELLED = "job_cancelled", "Job cancelled"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications",
    )
    kind = models.CharField(max_length=32, choices=Kind.choices)
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name="actor_notifications",
    )
    job = models.ForeignKey(
        "jobs.JobRequest",
        null=True, blank=True,
        on_delete=models.CASCADE,
        related_name="notifications",
    )
    quote = models.ForeignKey(
        "jobs.Quote",
        null=True, blank=True,
        on_delete=models.CASCADE,
        related_name="notifications",
    )
    review = models.ForeignKey(
        "jobs.Review",
        null=True, blank=True,
        on_delete=models.CASCADE,
        related_name="notifications",
    )
    message = models.ForeignKey(
        "messaging.Message",
        null=True, blank=True,
        on_delete=models.CASCADE,
        related_name="notifications",
    )

    title = models.CharField(max_length=200)
    body = models.TextField(blank=True, default="")
    link = models.CharField(max_length=255, blank=True, default="")

    read_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "notifications"
        ordering = ("-created_at",)
        indexes = [
            models.Index(fields=["user", "-created_at"]),
            models.Index(fields=["user", "read_at"]),
        ]

    def __str__(self) -> str:
        return f"{self.user} · {self.kind} · {self.title[:40]}"
