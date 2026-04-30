from rest_framework import permissions, status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import User
from apps.accounts.serializers import UserSerializer

from .serializers import (
    FreelancerProfileReadSerializer,
    KlientProfileReadSerializer,
    ProfilePatchSerializer,
    freelancer_completion,
    klient_completion,
)

MAX_AVATAR_BYTES = 5 * 1024 * 1024  # 5MB
ALLOWED_AVATAR_TYPES = {"image/jpeg", "image/png", "image/webp"}


def _profile_payload(user: User, request=None) -> dict:
    ctx = {"request": request} if request is not None else {}
    payload: dict = {"user": UserSerializer(user).data}

    if user.role == User.Role.FREELANCER:
        payload["profile"] = FreelancerProfileReadSerializer(
            user.freelancer_profile, context=ctx,
        ).data
        payload["completion"] = freelancer_completion(user)
    elif user.role == User.Role.KLIENT:
        payload["profile"] = KlientProfileReadSerializer(
            user.klient_profile, context=ctx,
        ).data
        payload["completion"] = klient_completion(user)
    else:
        payload["profile"] = None
        payload["completion"] = 1.0
    return payload


class MyProfileView(APIView):
    """GET / PATCH the current user's combined profile (user + role-specific)."""

    def get(self, request):
        return Response(_profile_payload(request.user, request))

    def patch(self, request):
        serializer = ProfilePatchSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        user = serializer.save(user=request.user)
        return Response(_profile_payload(user, request))


class MyAvatarView(APIView):
    """Upload or delete the current user's avatar.

    POST/PUT: multipart with `avatar` file → saves to the role's profile.
    DELETE: clears avatar.
    """

    parser_classes = (MultiPartParser, FormParser)

    def _profile_for(self, user: User):
        if user.role == User.Role.FREELANCER:
            return user.freelancer_profile
        if user.role == User.Role.KLIENT:
            return user.klient_profile
        return None

    def post(self, request):
        return self._save(request)

    def put(self, request):
        return self._save(request)

    def delete(self, request):
        profile = self._profile_for(request.user)
        if profile and profile.avatar:
            profile.avatar.delete(save=False)
            profile.avatar = None
            profile.save(update_fields=["avatar"])
        return Response(_profile_payload(request.user, request))

    def _save(self, request):
        profile = self._profile_for(request.user)
        if profile is None:
            return Response(
                {"detail": "Roli juaj nuk ka profil për avatar."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        f = request.FILES.get("avatar")
        if not f:
            return Response(
                {"avatar": "Skedari mungon."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if f.size > MAX_AVATAR_BYTES:
            return Response(
                {"avatar": f"Skedari është më i madh se {MAX_AVATAR_BYTES // (1024 * 1024)} MB."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if f.content_type not in ALLOWED_AVATAR_TYPES:
            return Response(
                {"avatar": "Lejohen vetëm JPEG, PNG ose WebP."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Replace any existing file
        if profile.avatar:
            profile.avatar.delete(save=False)
        profile.avatar = f
        profile.save(update_fields=["avatar"])
        return Response(_profile_payload(request.user, request))
