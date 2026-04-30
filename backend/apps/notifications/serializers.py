from rest_framework import serializers

from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    actor_name = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = (
            "id", "kind", "title", "body", "link",
            "actor_name",
            "read_at", "created_at",
        )
        read_only_fields = fields

    def get_actor_name(self, obj: Notification) -> str:
        return obj.actor.full_name if obj.actor else ""
