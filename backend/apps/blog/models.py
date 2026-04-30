from django.conf import settings
from django.db import models
from django.utils.text import slugify


class Post(models.Model):
    """A blog post — written via Django admin so non-engineers can publish."""

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    excerpt = models.CharField(
        max_length=300, blank=True, default="",
        help_text="Short summary shown on the index page (1–2 sentences).",
    )
    body = models.TextField(
        help_text=(
            "Markdown content. Headings (##), bold (**…**), italics (*…*), "
            "bullet lists, and links work."
        ),
    )
    cover_image = models.ImageField(
        upload_to="blog/covers/", null=True, blank=True,
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="blog_posts",
    )
    is_published = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "blog_posts"
        ordering = ("-published_at", "-created_at")
        indexes = [
            models.Index(fields=["is_published", "-published_at"]),
        ]

    def __str__(self) -> str:
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)[:220]
        super().save(*args, **kwargs)
