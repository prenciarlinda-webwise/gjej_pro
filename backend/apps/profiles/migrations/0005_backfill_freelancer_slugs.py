from django.db import migrations
from django.utils.text import slugify


def backfill(apps, schema_editor):
    FreelancerProfile = apps.get_model("profiles", "FreelancerProfile")
    used = set()
    for fp in FreelancerProfile.objects.select_related("user", "company").all():
        source = ""
        if fp.company_id and fp.company:
            source = fp.company.name
        if not source and fp.user_id:
            full = ((fp.user.first_name or "") + " " + (fp.user.last_name or "")).strip()
            source = full or fp.user.email.split("@")[0]
        base = slugify(source) or f"profesionist-{fp.user_id}"
        candidate = base
        i = 2
        while candidate in used or FreelancerProfile.objects.filter(slug=candidate).exclude(pk=fp.pk).exists():
            candidate = f"{base}-{i}"
            i += 1
        fp.slug = candidate
        fp.save(update_fields=["slug"])
        used.add(candidate)


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0004_freelancerprofile_slug'),
    ]

    operations = [
        migrations.RunPython(backfill, migrations.RunPython.noop),
    ]
