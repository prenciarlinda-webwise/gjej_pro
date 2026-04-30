from django.contrib import admin
from django.utils import timezone

from .models import Post


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "is_published", "published_at", "updated_at")
    list_filter = ("is_published",)
    search_fields = ("title", "slug", "excerpt", "body")
    prepopulated_fields = {"slug": ("title",)}
    autocomplete_fields = ("author",)
    readonly_fields = ("created_at", "updated_at")
    fieldsets = (
        (None, {"fields": ("title", "slug", "author", "cover_image")}),
        ("Përmbajtja", {"fields": ("excerpt", "body")}),
        ("Publikimi", {"fields": ("is_published", "published_at")}),
        ("Meta", {"fields": ("created_at", "updated_at")}),
    )
    actions = ("publish_now",)

    @admin.action(description="Publiko tani (vendos published_at = tani dhe is_published=True)")
    def publish_now(self, request, queryset):
        n = queryset.update(is_published=True, published_at=timezone.now())
        self.message_user(request, f"{n} postim(e) u publikuan.")
