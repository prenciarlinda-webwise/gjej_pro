from django.contrib import admin

from .models import JobRequest, Quote, Review


@admin.register(JobRequest)
class JobRequestAdmin(admin.ModelAdmin):
    list_display = ("title", "customer", "category", "city", "status", "created_at")
    list_filter = ("status", "category", "currency", "country")
    search_fields = ("title", "description", "customer__email", "city")
    autocomplete_fields = ("customer", "category", "accepted_quote")
    readonly_fields = ("created_at", "updated_at")


@admin.register(Quote)
class QuoteAdmin(admin.ModelAdmin):
    list_display = ("job", "freelancer", "price", "currency", "status", "created_at")
    list_filter = ("status", "currency")
    search_fields = ("job__title", "freelancer__user__email", "message")
    autocomplete_fields = ("job", "freelancer")
    readonly_fields = ("created_at", "updated_at")


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("job", "reviewer", "reviewee", "rating", "created_at")
    list_filter = ("rating",)
    search_fields = (
        "job__title", "reviewer__email", "reviewee__user__email", "comment",
    )
    autocomplete_fields = ("job", "reviewer", "reviewee")
    readonly_fields = ("created_at",)
