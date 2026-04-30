from django.db import transaction
from django.db.models import Count, Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import User
from apps.notifications.models import Notification
from apps.notifications.services import notify

from .models import Conversation, Message
from .serializers import (
    ConversationDetailSerializer,
    ConversationListItemSerializer,
    MessageSerializer,
)


def _user_conversations(user):
    """All conversations the user participates in, with messages prefetched."""
    return (
        Conversation.objects
        .filter(Q(participant_a=user) | Q(participant_b=user))
        .select_related("participant_a", "participant_b")
        .prefetch_related("messages")
    )


def _ensure_member(conversation: Conversation, user) -> None:
    if not conversation.has_participant(user):
        raise PermissionDenied("Nuk keni akses në këtë bisedë.")


class ConversationListCreateView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        qs = _user_conversations(request.user).order_by(
            "-last_message_at", "-created_at",
        )
        data = ConversationListItemSerializer(
            qs, many=True, context={"request": request},
        ).data
        # Sum of unread counts (handy for badges)
        total_unread = sum(c["unread_count"] for c in data)
        return Response({"results": data, "total_unread": total_unread})

    def post(self, request):
        peer_id = request.data.get("peer_id")
        if not peer_id:
            raise ValidationError({"peer_id": "peer_id është i detyrueshëm."})

        try:
            peer = User.objects.get(id=peer_id, is_active=True)
        except User.DoesNotExist:
            raise ValidationError({"peer_id": "Përdoruesi nuk u gjet."})

        if peer.id == request.user.id:
            raise ValidationError(
                {"peer_id": "Nuk mund të bisedoni me veten tuaj."},
            )

        # Allow only klient↔freelancer pairs (admin can chat with anyone).
        roles = {peer.role, request.user.role}
        if not request.user.is_admin and not peer.is_admin and roles != {User.Role.KLIENT, User.Role.FREELANCER}:
            raise PermissionDenied(
                "Bisedat lejohen vetëm midis klientëve dhe profesionistëve.",
            )

        conv = Conversation.get_or_create_pair(request.user, peer)
        return Response(
            ConversationDetailSerializer(conv, context={"request": request}).data,
            status=status.HTTP_200_OK,
        )


class ConversationDetailView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, pk):
        conv = get_object_or_404(_user_conversations(request.user), pk=pk)
        _ensure_member(conv, request.user)
        return Response(
            ConversationDetailSerializer(conv, context={"request": request}).data,
        )


class MessageCreateView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    @transaction.atomic
    def post(self, request, pk):
        conv = get_object_or_404(_user_conversations(request.user), pk=pk)
        _ensure_member(conv, request.user)

        body = (request.data.get("body") or "").strip()
        if not body:
            raise ValidationError({"body": "Mesazhi nuk mund të jetë bosh."})
        if len(body) > 4000:
            raise ValidationError({"body": "Mesazhi është shumë i gjatë (max 4000)."})

        msg = Message.objects.create(
            conversation=conv,
            sender=request.user,
            body=body,
        )
        conv.last_message_at = msg.created_at
        conv.save(update_fields=["last_message_at"])

        # Notify the *other* participant.
        recipient = conv.other_for(request.user)
        # Build a role-aware deep link so the recipient lands inside their own dashboard
        recipient_role = recipient.role if recipient.role in {"freelancer", "klient"} else "klient"
        notify(
            user=recipient,
            kind=Notification.Kind.MESSAGE_RECEIVED,
            title=f"Mesazh i ri nga {request.user.first_name}",
            body=body[:200] + ("…" if len(body) > 200 else ""),
            link=f"/dashboard/{recipient_role}/mesazhet?conv={conv.id}",
            actor=request.user,
            message=msg,
        )

        return Response(MessageSerializer(msg).data, status=status.HTTP_201_CREATED)


class MarkReadView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, pk):
        conv = get_object_or_404(_user_conversations(request.user), pk=pk)
        _ensure_member(conv, request.user)
        updated = (
            Message.objects
            .filter(conversation=conv, read_at__isnull=True)
            .exclude(sender=request.user)
            .update(read_at=timezone.now())
        )
        return Response({"updated": updated})
