# Generated by Django 4.1.7 on 2023-05-09 16:42

from django.db import migrations, models
import django_mysql.models


class Migration(migrations.Migration):

    dependencies = [
        ('player_statistics', '0045_premierleagueplayers_fixture_id_list'),
    ]

    operations = [
        migrations.AddField(
            model_name='eliteserienchipsanduserinfo',
            name='global_chip_usage_this_gw',
            field=django_mysql.models.ListTextField(models.IntegerField(blank=True, help_text='Global chip usage for all managers this round', null=True), blank=True, size=6),
        ),
        migrations.AddField(
            model_name='eliteserienchipsanduserinfo',
            name='global_chip_usage_total',
            field=django_mysql.models.ListTextField(models.IntegerField(blank=True, help_text='Global chip usage for all managers in total', null=True), blank=True, size=6),
        ),
        migrations.AddField(
            model_name='premierleaguechipsanduserinfo',
            name='global_chip_usage_this_gw',
            field=django_mysql.models.ListTextField(models.IntegerField(blank=True, help_text='Global chip usage for all managers this round', null=True), blank=True, size=6),
        ),
        migrations.AddField(
            model_name='premierleaguechipsanduserinfo',
            name='global_chip_usage_total',
            field=django_mysql.models.ListTextField(models.IntegerField(blank=True, help_text='Global chip usage for all managers in total', null=True), blank=True, size=6),
        ),
        migrations.AlterField(
            model_name='eliteserienchipsanduserinfo',
            name='total_chip_usage_5000',
            field=django_mysql.models.ListTextField(models.IntegerField(help_text='Total chip usage among top 5000'), blank=True, size=6),
        ),
    ]
