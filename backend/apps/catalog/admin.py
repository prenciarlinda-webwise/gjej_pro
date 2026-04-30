from django.contrib import admin

from .models import Category, Service, ServiceArea


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "name_en", "slug", "parent", "is_active", "sort_order")
    list_editable = ("is_active", "sort_order")
    list_filter = ("is_active", "parent")
    search_fields = ("name", "name_en", "slug", "description")
    ordering = ("sort_order", "name")
    prepopulated_fields = {"slug": ("name",)}
    autocomplete_fields = ("parent",)


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = (
        "title", "freelancer", "category",
        "pricing_model", "price_min", "price_max", "currency",
        "is_active", "created_at",
    )
    list_filter = ("is_active", "category", "pricing_model", "currency")
    search_fields = ("title", "description", "freelancer__user__email")
    autocomplete_fields = ("freelancer", "category")


@admin.register(ServiceArea)
class ServiceAreaAdmin(admin.ModelAdmin):
    list_display = ("freelancer", "city", "region", "country", "created_at")
    list_filter = ("country", "region")
    search_fields = ("city", "region", "freelancer__user__email")
    autocomplete_fields = ("freelancer",)
