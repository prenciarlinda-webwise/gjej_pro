from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Notification
from .serializers import NotificationSerializer


class NotificationPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100


def _own(user):
    return Notification.objects.filter(user=user).select_related("actor")


class NotificationListView(ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = NotificationSerializer
    pagination_class = NotificationPagination

    def get_queryset(self):
        return _own(self.request.user).order_by("-created_at")


class UnreadCountView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        count = _own(request.user).filter(read_at__isnull=True).count()
        return Response({"unread_count": count})


class MarkReadView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, pk):
        n = get_object_or_404(_own(request.user), pk=pk)
        if n.read_at is None:
            n.read_at = timezone.now()
            n.save(update_fields=["read_at"])
        return Response(NotificationSerializer(n).data)


class MarkAllReadView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        updated = (
            _own(request.user)
            .filter(read_at__isnull=True)
            .update(read_at=timezone.now())
        )
        return Response({"updated": updated})
