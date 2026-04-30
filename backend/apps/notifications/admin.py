from django.contrib import admin

from .models import Notification, NotificationPreference


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("user", "kind", "title", "read_at", "created_at")
    list_filter = ("kind", "read_at")
    search_fields = ("user__email", "title", "body")
    autocomplete_fields = ("user", "actor", "job", "quote", "review", "message")
    readonly_fields = ("created_at",)


@admin.register(NotificationPreference)
class NotificationPreferenceAdmin(admin.ModelAdmin):
    list_display = ("user", "updated_at")
    search_fields = ("user__email",)
    autocomplete_fields = ("user",)
    readonly_fields = ("created_at", "updated_at")
