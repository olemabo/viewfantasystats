# Generated by Django 4.1.7 on 2023-04-19 17:44

from django.db import migrations, models
import django_mysql.models


class Migration(migrations.Migration):

    dependencies = [
        ('player_statistics', '0042_alter_eliteserienchipsanduserinfo_options_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='eliteserienplayerstatistic',
            name='opta_index_list',
            field=django_mysql.models.ListTextField(models.CharField(blank=True, default='', help_text='Opta index ("47.810070")', max_length=10, null=True), default='', size=31),
            preserve_default=False,
        ),
    ]