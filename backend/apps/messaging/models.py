from django.conf import settings
from django.db import models


class Conversation(models.Model):
    """A 1:1 thread between two users. Participant order is canonicalized so
    `participant_a.id < participant_b.id` — that gives us a single row per
    pair regardless of who started the chat.
    """

    participant_a = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="conversations_as_a",
    )
    participant_b = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="conversations_as_b",
    )
    last_message_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "conversations"
        ordering = ("-last_message_at", "-created_at")
        constraints = [
            models.UniqueConstraint(
                fields=["participant_a", "participant_b"],
                name="unique_conversation_pair",
            ),
            models.CheckConstraint(
                condition=models.Q(participant_a__lt=models.F("participant_b")),
                name="conversation_canonical_order",
            ),
        ]
        indexes = [
            models.Index(fields=["participant_a", "-last_message_at"]),
            models.Index(fields=["participant_b", "-last_message_at"]),
        ]

    def __str__(self) -> str:
        return f"{self.participant_a} ↔ {self.participant_b}"

    def other_for(self, user):
        """Return the participant that is *not* `user`."""
        return self.participant_b if self.participant_a_id == user.id else self.participant_a

    def has_participant(self, user) -> bool:
        return user.id in {self.participant_a_id, self.participant_b_id}

    @classmethod
    def get_or_create_pair(cls, user_a, user_b):
        if user_a.id == user_b.id:
            raise ValueError("Cannot start a conversation with yourself.")
        a, b = sorted([user_a, user_b], key=lambda u: u.id)
        obj, _ = cls.objects.get_or_create(
            participant_a=a, participant_b=b,
        )
        return obj


class Message(models.Model):
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name="messages",
    )
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="sent_messages",
    )
    body = models.TextField()
    read_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "messages"
        ordering = ("created_at",)
        indexes = [
            models.Index(fields=["conversation", "-created_at"]),
            models.Index(fields=["conversation", "read_at"]),
        ]

    def __str__(self) -> str:
        return f"{self.sender} → {self.conversation_id}: {self.body[:40]}"
