from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0003_remove_freelancerprofile_avatar_url_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='freelancerprofile',
            name='slug',
            field=models.SlugField(blank=True, max_length=140, null=True),
        ),
    ]
