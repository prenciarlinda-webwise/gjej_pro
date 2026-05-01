from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0005_backfill_freelancer_slugs'),
    ]

    operations = [
        migrations.AlterField(
            model_name='freelancerprofile',
            name='slug',
            field=models.SlugField(blank=True, max_length=140, unique=True),
        ),
    ]
