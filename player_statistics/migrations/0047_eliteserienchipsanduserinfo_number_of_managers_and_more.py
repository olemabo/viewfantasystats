# Generated by Django 4.1.7 on 2023-05-09 18:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('player_statistics', '0046_eliteserienchipsanduserinfo_global_chip_usage_this_gw_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='eliteserienchipsanduserinfo',
            name='number_of_managers',
            field=models.IntegerField(blank=True, help_text='Number of managers (130328)', null=True),
        ),
        migrations.AddField(
            model_name='premierleaguechipsanduserinfo',
            name='number_of_managers',
            field=models.IntegerField(blank=True, help_text='Number of managers (130328)', null=True),
        ),
    ]
