# Generated by Django 3.1.4 on 2021-10-10 15:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('player_statistics', '0012_auto_20211010_1640'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='gwschecked',
            options={'ordering': ['player_id']},
        ),
    ]
