from django.urls import path

from .views import MyAvatarView, MyProfileView

app_name = "profiles"

urlpatterns = [
    path("profile/me/", MyProfileView.as_view(), name="me"),
    path("profile/me/avatar/", MyAvatarView.as_view(), name="me-avatar"),
]
