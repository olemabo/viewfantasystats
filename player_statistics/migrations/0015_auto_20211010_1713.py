# Generated by Django 3.1.4 on 2021-10-10 15:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('player_statistics', '0014_auto_20211010_1710'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='gwschecked',
            name='id',
        ),
        migrations.AddField(
            model_name='gwschecked',
            name='player_id',
            field=models.IntegerField(default=1, help_text='Enter team id (1) ', serialize=False),
        ),
    ]
