"""Account-related side effects (currently: sending verification and password-reset emails)."""
import logging
import sys
import threading

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.utils.html import escape

from .models import EmailVerificationToken, PasswordResetToken, User

logger = logging.getLogger(__name__)


def send_verification_email(user: User) -> EmailVerificationToken:
    """Issue a fresh token for the user and send the verification link."""
    token = EmailVerificationToken.objects.create(user=user)
    link = f"{settings.FRONTEND_URL.rstrip('/')}/verifiko-emailin/{token.token}"

    subject = "Verifikoni emailin tuaj — Gjej Pro"

    text_body = (
        f"Përshëndetje {user.first_name},\n\n"
        f"Ju falënderojmë që u regjistruat në Gjej Pro!\n\n"
        f"Konfirmoni emailin tuaj duke vizituar adresën më poshtë:\n\n"
        f"{link}\n\n"
        f"Linku skadon për 24 orë.\n\n"
        f"Nëse nuk e keni krijuar ju këtë llogari, mund ta injoroni këtë email.\n\n"
        f"— Ekipi i Gjej Pro"
    )

    html_body = f"""\
<!doctype html>
<html lang="sq">
  <body style="margin:0;padding:32px;background:#F5F2EC;font-family:-apple-system,Segoe UI,sans-serif;color:#0E1A14;">
    <div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #D9D4C5;border-radius:12px;padding:32px;">
      <div style="font-family:Georgia,serif;font-size:28px;color:#1F4D3A;margin-bottom:8px;">
        Mirë se erdhët në Gjej Pro
      </div>
      <p style="margin:0 0 16px 0;color:#0E1A14;line-height:1.5;">
        Përshëndetje {escape(user.first_name)},
      </p>
      <p style="margin:0 0 24px 0;color:#0E1A14;line-height:1.5;">
        Ju falënderojmë që u regjistruat. Ju lutemi konfirmoni emailin tuaj
        duke klikuar butonin më poshtë:
      </p>
      <p style="margin:0 0 24px 0;">
        <a href="{escape(link)}"
           style="display:inline-block;background:#1F4D3A;color:#F5F2EC;
                  padding:12px 22px;border-radius:8px;text-decoration:none;
                  font-weight:500;">
          Verifiko emailin tim
        </a>
      </p>
      <p style="margin:0 0 8px 0;color:#6B6F6A;font-size:13px;line-height:1.5;">
        Ose kopjoni dhe ngjitni linkun e mëposhtëm në shfletuesin tuaj:
      </p>
      <p style="margin:0 0 24px 0;color:#1F4D3A;font-size:13px;word-break:break-all;">
        {escape(link)}
      </p>
      <p style="margin:0;color:#6B6F6A;font-size:12px;line-height:1.5;">
        Linku skadon për 24 orë. Nëse nuk e keni krijuar ju këtë llogari, mund
        ta injoroni këtë email.
      </p>
    </div>
  </body>
</html>"""

    msg = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
    )
    msg.attach_alternative(html_body, "text/html")
    msg.send(fail_silently=False)

    # Dev convenience: also print the link unambiguously so it's easy to copy
    # out of the Django terminal (the QP-encoded version in the rendered email
    # gets soft-wrapped and is annoying to grab).
    if settings.DEBUG:
        print(
            f"\n[VERIFY] {user.email}\n[VERIFY] {link}\n",
            file=sys.stdout,
            flush=True,
        )

    return token


def send_password_reset_email(user: User) -> PasswordResetToken:
    """Issue a fresh reset token for the user and hand the email off to a
    background thread.

    ForgotPasswordView returns the same generic response whether or not the
    email is registered — if we sent the (SMTP-backed) email synchronously
    here, that branch would take measurably longer than the "no such user"
    branch, leaking account existence via response timing. Delivery happens
    off-thread instead, and failures are caught there so a mail-backend
    outage can't turn this into a distinguishing 500 either.
    """
    token = PasswordResetToken.objects.create(user=user)
    link = f"{settings.FRONTEND_URL.rstrip('/')}/rivendos-fjalekalimin/{token.token}"
    threading.Thread(
        target=_deliver_password_reset_email,
        args=(user.email, user.first_name, link),
        daemon=True,
    ).start()
    return token


def _deliver_password_reset_email(email: str, first_name: str, link: str) -> None:
    subject = "Rivendosni fjalëkalimin tuaj — Gjej Pro"

    text_body = (
        f"Përshëndetje {first_name},\n\n"
        f"Kemi marrë një kërkesë për të rivendosur fjalëkalimin e llogarisë suaj në Gjej Pro.\n\n"
        f"Klikoni adresën më poshtë për të vendosur një fjalëkalim të ri:\n\n"
        f"{link}\n\n"
        f"Linku skadon për 1 orë.\n\n"
        f"Nëse nuk e keni kërkuar ju këtë, mund ta injoroni këtë email — fjalëkalimi juaj mbetet i pandryshuar.\n\n"
        f"— Ekipi i Gjej Pro"
    )

    html_body = f"""\
<!doctype html>
<html lang="sq">
  <body style="margin:0;padding:32px;background:#F5F2EC;font-family:-apple-system,Segoe UI,sans-serif;color:#0E1A14;">
    <div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #D9D4C5;border-radius:12px;padding:32px;">
      <div style="font-family:Georgia,serif;font-size:28px;color:#1F4D3A;margin-bottom:8px;">
        Rivendosni fjalëkalimin
      </div>
      <p style="margin:0 0 16px 0;color:#0E1A14;line-height:1.5;">
        Përshëndetje {escape(first_name)},
      </p>
      <p style="margin:0 0 24px 0;color:#0E1A14;line-height:1.5;">
        Kemi marrë një kërkesë për të rivendosur fjalëkalimin e llogarisë suaj.
        Klikoni butonin më poshtë për të vendosur një fjalëkalim të ri:
      </p>
      <p style="margin:0 0 24px 0;">
        <a href="{escape(link)}"
           style="display:inline-block;background:#1F4D3A;color:#F5F2EC;
                  padding:12px 22px;border-radius:8px;text-decoration:none;
                  font-weight:500;">
          Rivendos fjalëkalimin
        </a>
      </p>
      <p style="margin:0 0 8px 0;color:#6B6F6A;font-size:13px;line-height:1.5;">
        Ose kopjoni dhe ngjitni linkun e mëposhtëm në shfletuesin tuaj:
      </p>
      <p style="margin:0 0 24px 0;color:#1F4D3A;font-size:13px;word-break:break-all;">
        {escape(link)}
      </p>
      <p style="margin:0;color:#6B6F6A;font-size:12px;line-height:1.5;">
        Linku skadon për 1 orë. Nëse nuk e keni kërkuar ju këtë, mund ta
        injoroni këtë email — fjalëkalimi juaj mbetet i pandryshuar.
      </p>
    </div>
  </body>
</html>"""

    msg = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[email],
    )
    msg.attach_alternative(html_body, "text/html")
    try:
        msg.send(fail_silently=False)
    except Exception:
        logger.exception("Failed to send password reset email to %s", email)
        return

    if settings.DEBUG:
        print(
            f"\n[RESET] {email}\n[RESET] {link}\n",
            file=sys.stdout,
            flush=True,
        )
