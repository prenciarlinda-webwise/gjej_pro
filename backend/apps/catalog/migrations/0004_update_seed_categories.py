"""Drop the Frizer & Estetistë category, add construction/trade categories."""
from django.db import migrations
from django.utils.text import slugify


REMOVE_SLUGS = ["frizer-estetiste"]

# (name, name_en, icon, sort_order)
ADD_CATEGORIES = [
    ("Punime gipsi",          "Drywall & Plasterboard",   "hammer",     45),
    ("Sistemim parketi",      "Flooring",                  "hammer",     65),
    ("Saldim & Metalike",     "Welding & Metalwork",       "spark",      72),
    ("Termoizolim",           "Thermal insulation",        "thermometer", 75),
    ("Tapiceri",              "Upholstery",                "scissors",   78),
    ("Mirëmbajtje kopshti",   "Garden maintenance",        "leaf",       82),
    ("Dezinfektim",           "Pest control & disinfection", "spray",    85),
    ("Servis makine",         "Auto repair",               "wrench",    155),
]


def update_categories(apps, schema_editor):
    Category = apps.get_model("catalog", "Category")
    Service = apps.get_model("catalog", "Service")

    # Remove obsolete categories — only if no services reference them.
    for slug in REMOVE_SLUGS:
        try:
            cat = Category.objects.get(slug=slug)
        except Category.DoesNotExist:
            continue
        in_use = Service.objects.filter(category=cat).exists()
        if in_use:
            # Don't break referential integrity; just hide.
            cat.is_active = False
            cat.save(update_fields=["is_active"])
        else:
            cat.delete()

    # Add new categories (idempotent via update_or_create)
    for name, name_en, icon, order in ADD_CATEGORIES:
        Category.objects.update_or_create(
            slug=slugify(name)[:140],
            defaults={
                "name": name,
                "name_en": name_en,
                "icon": icon,
                "sort_order": order,
                "is_active": True,
            },
        )


def reverse(apps, schema_editor):
    Category = apps.get_model("catalog", "Category")
    Service = apps.get_model("catalog", "Service")

    # Re-seed Frizer & Estetistë
    Category.objects.update_or_create(
        slug="frizer-estetiste",
        defaults={
            "name": "Frizer & Estetistë",
            "name_en": "Hair & Beauty",
            "icon": "scissors",
            "sort_order": 130,
            "is_active": True,
        },
    )

    # Remove the new ones if no services use them
    new_slugs = [slugify(n)[:140] for n, _, _, _ in ADD_CATEGORIES]
    for slug in new_slugs:
        try:
            cat = Category.objects.get(slug=slug)
        except Category.DoesNotExist:
            continue
        if not Service.objects.filter(category=cat).exists():
            cat.delete()


class Migration(migrations.Migration):
    dependencies = [
        ("catalog", "0003_service_servicearea"),
    ]
    operations = [
        migrations.RunPython(update_categories, reverse_code=reverse),
    ]
