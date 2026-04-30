from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import EmailVerificationToken, User


@admin.register(EmailVerificationToken)
class EmailVerificationTokenAdmin(admin.ModelAdmin):
    list_display = ("user", "created_at", "consumed_at")
    search_fields = ("user__email",)
    readonly_fields = ("token", "created_at", "consumed_at")
    list_filter = ("consumed_at",)


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    ordering = ("-date_joined",)
    list_display = (
        "email",
        "first_name",
        "last_name",
        "role",
        "is_email_verified",
        "is_active",
        "date_joined",
    )
    list_filter = ("role", "is_active", "is_email_verified", "is_staff")
    search_fields = ("email", "first_name", "last_name", "phone")

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personale", {
            "fields": ("first_name", "last_name", "phone"),
        }),
        ("Roli", {"fields": ("role",)}),
        ("Verifikimi", {"fields": ("is_email_verified",)}),
        ("Lokalizimi", {"fields": ("preferred_language", "country")}),
        ("Statusi", {
            "fields": ("is_active", "is_staff", "is_superuser",
                       "groups", "user_permissions"),
        }),
        ("Data të rëndësishme", {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "first_name", "last_name", "role",
                       "password1", "password2"),
        }),
    )
    readonly_fields = ("last_login", "date_joined")
