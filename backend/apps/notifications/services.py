"""Notification dispatch — creates a Notification row and (best-effort) emails.

Email sending is synchronous for now; for production this should move to a
Celery task so a slow SMTP doesn't block the request thread.
"""
import logging
from typing import Any

from django.conf import settings
from django.core.mail import send_mail

from .models import Notification, NotificationPreference

logger = logging.getLogger(__name__)


def notify(
    user,
    kind: str,
    title: str,
    *,
    body: str = "",
    link: str = "",
    actor=None,
    job=None,
    quote=None,
    review=None,
    message=None,
    send_email: bool = True,
) -> Notification:
    """Persist a notification for `user` and best-effort email them."""
    if user is None:
        return None  # type: ignore[return-value]
    if actor is not None and getattr(actor, "id", None) == user.id:
        # Don't notify the user about their own actions
        return None  # type: ignore[return-value]

    n = Notification.objects.create(
        user=user,
        kind=kind,
        actor=actor,
        job=job,
        quote=quote,
        review=review,
        message=message,
        title=title,
        body=body,
        link=link,
    )

    # Respect per-user email preferences. If the user has opted out of this
    # kind of email, we still create the in-app notification but skip mail.
    if send_email and (user.email or "").strip():
        prefs, _ = NotificationPreference.objects.get_or_create(user=user)
        if not prefs.email_enabled_for(kind):
            send_email = False

    if send_email and (user.email or "").strip():
        absolute_link = (
            f"{settings.FRONTEND_URL.rstrip('/')}{link}"
            if link.startswith("/") else link
        )
        text = (
            f"Përshëndetje {user.first_name},\n\n"
            f"{body or title}\n"
        )
        if absolute_link:
            text += f"\n{absolute_link}\n"
        text += "\n— Ekipi i Gjej Pro"
        try:
            send_mail(
                subject=f"[Gjej Pro] {title}",
                message=text,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=True,
            )
        except Exception:
            logger.exception(
                "Failed to send notification email to %s (kind=%s)",
                user.email, kind,
            )

    return n
