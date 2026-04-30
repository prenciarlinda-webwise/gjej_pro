from rest_framework import serializers

from .models import Post


def _absolute_url(request, image) -> str:
    if not image:
        return ""
    url = image.url
    return request.build_absolute_uri(url) if request else url


class PostListSerializer(serializers.ModelSerializer):
    cover_image_url = serializers.SerializerMethodField()
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = (
            "id", "title", "slug", "excerpt",
            "cover_image_url", "author_name",
            "published_at",
        )

    def get_cover_image_url(self, obj: Post) -> str:
        return _absolute_url(self.context.get("request"), obj.cover_image)

    def get_author_name(self, obj: Post) -> str:
        if obj.author:
            return obj.author.full_name or obj.author.email
        return "Ekipi i Gjej Pro"


class PostDetailSerializer(PostListSerializer):
    class Meta(PostListSerializer.Meta):
        fields = PostListSerializer.Meta.fields + ("body", "updated_at")
