from django.db import migrations
from django.utils.text import slugify


SEED_CATEGORIES = [
    # (name, name_en, icon, sort_order)
    ("Elektricist",          "Electrician",        "bolt",       10),
    ("Hidraulik",            "Plumber",            "droplet",    20),
    ("Bravandreqës",         "Locksmith",          "key",        30),
    ("Mjeshtër ndërtimi",    "Construction",       "hard-hat",   40),
    ("Suvatim & Lyerje",     "Plastering & Painting", "brush",   50),
    ("Marangoz",             "Carpenter",          "hammer",     60),
    ("Klimë & Ngrohje",      "HVAC",               "thermometer", 70),
    ("Pastrim shtëpie",      "Home cleaning",      "spray",      80),
    ("Kuzhinier privat",     "Private chef",       "utensils",   90),
    ("Katering",             "Catering",           "cake",      100),
    ("Transport & Mbartje",  "Moving",             "truck",     110),
    ("Mësues privat",        "Private tutor",      "book",      120),
    ("Frizer & Estetistë",   "Hair & Beauty",      "scissors",  130),
    ("Mbështetje IT",        "IT support",         "monitor",   140),
    ("Fotograf",             "Photographer",       "camera",    150),
]


def seed_categories(apps, schema_editor):
    Category = apps.get_model("catalog", "Category")
    for name, name_en, icon, order in SEED_CATEGORIES:
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


def unseed_categories(apps, schema_editor):
    Category = apps.get_model("catalog", "Category")
    slugs = [slugify(name)[:140] for name, _, _, _ in SEED_CATEGORIES]
    Category.objects.filter(slug__in=slugs).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("catalog", "0001_initial"),
    ]
    operations = [
        migrations.RunPython(seed_categories, reverse_code=unseed_categories),
    ]
