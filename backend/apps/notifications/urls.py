from django.urls import path

from .preferences import NotificationPreferencesView
from .views import (
    MarkAllReadView,
    MarkReadView,
    NotificationListView,
    UnreadCountView,
)

app_name = "notifications"

urlpatterns = [
    path("notifications/", NotificationListView.as_view(), name="list"),
    path(
        "notifications/unread-count/",
        UnreadCountView.as_view(),
        name="unread-count",
    ),
    path(
        "notifications/<int:pk>/read/",
        MarkReadView.as_view(),
        name="mark-read",
    ),
    path(
        "notifications/read-all/",
        MarkAllReadView.as_view(),
        name="mark-all-read",
    ),
    path(
        "me/notification-preferences/",
        NotificationPreferencesView.as_view(),
        name="preferences",
    ),
]
