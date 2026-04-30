from rest_framework import serializers

from apps.accounts.models import User

from .models import Conversation, Message


class MessageSerializer(serializers.ModelSerializer):
    sender_id = serializers.IntegerField(source="sender.id", read_only=True)

    class Meta:
        model = Message
        fields = ("id", "body", "sender_id", "read_at", "created_at")
        read_only_fields = ("id", "sender_id", "read_at", "created_at")


class _PeerSerializer(serializers.Serializer):
    """Compact representation of the *other* participant in a conversation."""
    id = serializers.IntegerField()
    full_name = serializers.CharField()
    role = serializers.CharField()
    headline = serializers.SerializerMethodField()
    avatar_url = serializers.SerializerMethodField()

    def get_headline(self, obj: User) -> str:
        try:
            return obj.freelancer_profile.headline or ""
        except Exception:
            return ""

    def get_avatar_url(self, obj: User) -> str:
        request = self.context.get("request")
        try:
            avatar = None
            if obj.role == User.Role.FREELANCER:
                avatar = obj.freelancer_profile.avatar
            elif obj.role == User.Role.KLIENT:
                avatar = obj.klient_profile.avatar
            if not avatar:
                return ""
            url = avatar.url
            return request.build_absolute_uri(url) if request else url
        except Exception:
            return ""


class ConversationListItemSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    peer = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    last_message_at = serializers.DateTimeField()
    unread_count = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField()

    def get_peer(self, obj: Conversation) -> dict:
        me = self.context["request"].user
        peer = obj.other_for(me)
        return _PeerSerializer(peer, context=self.context).data

    def get_last_message(self, obj: Conversation) -> dict | None:
        last = obj.messages.order_by("-created_at").first()
        if not last:
            return None
        return {
            "body": last.body[:240],
            "sender_id": last.sender_id,
            "created_at": last.created_at.isoformat(),
        }

    def get_unread_count(self, obj: Conversation) -> int:
        me = self.context["request"].user
        return obj.messages.filter(read_at__isnull=True).exclude(sender=me).count()


class ConversationDetailSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    peer = serializers.SerializerMethodField()
    messages = MessageSerializer(many=True)
    created_at = serializers.DateTimeField()

    def get_peer(self, obj: Conversation) -> dict:
        me = self.context["request"].user
        peer = obj.other_for(me)
        return _PeerSerializer(peer, context=self.context).data
