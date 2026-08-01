from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    AdminStatsView,
    AdminUserListView,
    ForgotPasswordView,
    LoginView,
    MeView,
    RegisterView,
    ResendVerificationView,
    ResetPasswordConfirmView,
    VerifyEmailView,
)

app_name = "accounts"

urlpatterns = [
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("auth/me/", MeView.as_view(), name="me"),
    path("auth/verify-email/", VerifyEmailView.as_view(), name="verify-email"),
    path(
        "auth/resend-verification/",
        ResendVerificationView.as_view(),
        name="resend-verification",
    ),
    path("auth/forgot-password/", ForgotPasswordView.as_view(), name="forgot-password"),
    path(
        "auth/reset-password/",
        ResetPasswordConfirmView.as_view(),
        name="reset-password",
    ),
    path("admin/stats/", AdminStatsView.as_view(), name="admin-stats"),
    path("admin/users/", AdminUserListView.as_view(), name="admin-users"),
]
