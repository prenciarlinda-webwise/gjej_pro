"""API for reading and updating the current user's notification preferences."""
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer
from rest_framework.views import APIView

from .models import NotificationPreference


class PreferenceSerializer(ModelSerializer):
    class Meta:
        model = NotificationPreference
        fields = (
            "email_quote_received",
            "email_quote_accepted",
            "email_quote_rejected",
            "email_message_received",
            "email_review_received",
            "email_job_completed",
            "email_job_cancelled",
            "updated_at",
        )
        read_only_fields = ("updated_at",)


class NotificationPreferencesView(APIView):
    """GET / PATCH /api/me/notification-preferences/"""

    permission_classes = (permissions.IsAuthenticated,)

    def _ensure_prefs(self):
        prefs, _ = NotificationPreference.objects.get_or_create(
            user=self.request.user,
        )
        return prefs

    def get(self, request):
        prefs = self._ensure_prefs()
        return Response(PreferenceSerializer(prefs).data)

    def patch(self, request):
        prefs = self._ensure_prefs()
        ser = PreferenceSerializer(prefs, data=request.data, partial=True)
        ser.is_valid(raise_exception=True)
        ser.save()
        return Response(ser.data)
