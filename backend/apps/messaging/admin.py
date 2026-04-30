from django.contrib import admin

from .models import Conversation, Message


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = (
        "id", "participant_a", "participant_b",
        "last_message_at", "created_at",
    )
    search_fields = (
        "participant_a__email", "participant_b__email",
        "participant_a__first_name", "participant_b__first_name",
    )
    autocomplete_fields = ("participant_a", "participant_b")
    readonly_fields = ("created_at", "last_message_at")


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ("id", "conversation", "sender", "read_at", "created_at")
    list_filter = ("read_at",)
    search_fields = ("body", "sender__email")
    autocomplete_fields = ("conversation", "sender")
    readonly_fields = ("created_at",)
