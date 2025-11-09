# Generated migration for Participation model

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0006_projectimage'),
    ]

    operations = [
        migrations.CreateModel(
            name='Participation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('event', models.CharField(max_length=200)),
                ('year', models.PositiveIntegerField()),
                ('note', models.TextField(blank=True)),
            ],
        ),
    ]
