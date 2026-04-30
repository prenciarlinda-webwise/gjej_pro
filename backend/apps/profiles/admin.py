from django.contrib import admin

from .models import Company, FreelancerProfile, KlientProfile


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ("name", "country", "registration_number", "created_at")
    search_fields = ("name", "registration_number", "vat_number")
    list_filter = ("country",)


@admin.register(FreelancerProfile)
class FreelancerProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user", "company", "is_verified", "avg_rating",
        "review_count", "created_at",
    )
    list_filter = ("is_verified", "currency")
    search_fields = ("user__email", "user__first_name", "user__last_name",
                     "company__name", "headline")
    autocomplete_fields = ("user", "company")
    # Needed by autocomplete_fields on Service / ServiceArea admins
    ordering = ("user__email",)


@admin.register(KlientProfile)
class KlientProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "created_at")
    search_fields = ("user__email", "user__first_name", "user__last_name")
    autocomplete_fields = ("user",)
