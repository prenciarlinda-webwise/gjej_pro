from django.urls import path

from .views import (
    ConversationDetailView,
    ConversationListCreateView,
    MarkReadView,
    MessageCreateView,
)

app_name = "messaging"

urlpatterns = [
    path(
        "conversations/",
        ConversationListCreateView.as_view(),
        name="conversations",
    ),
    path(
        "conversations/<int:pk>/",
        ConversationDetailView.as_view(),
        name="conversation-detail",
    ),
    path(
        "conversations/<int:pk>/messages/",
        MessageCreateView.as_view(),
        name="conversation-messages",
    ),
    path(
        "conversations/<int:pk>/read/",
        MarkReadView.as_view(),
        name="conversation-read",
    ),
]
