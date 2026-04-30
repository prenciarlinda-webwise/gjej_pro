from django.utils import timezone
from rest_framework import permissions
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.pagination import PageNumberPagination

from .models import Post
from .serializers import PostDetailSerializer, PostListSerializer


class PostPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = "page_size"
    max_page_size = 50


def _published():
    now = timezone.now()
    return (
        Post.objects
        .filter(is_published=True, published_at__lte=now)
        .select_related("author")
    )


class PostListView(ListAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = PostListSerializer
    pagination_class = PostPagination

    def get_queryset(self):
        return _published().order_by("-published_at", "-created_at")

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx["request"] = self.request
        return ctx


class PostDetailView(RetrieveAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = PostDetailSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return _published()

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx["request"] = self.request
        return ctx
