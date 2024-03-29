# Generated by Django 3.1.4 on 2021-10-10 10:45

from django.db import migrations, models
import django_mysql.models


class Migration(migrations.Migration):

    dependencies = [
        ('player_statistics', '0003_globalownershipstats100_globalownershipstats1000_globalownershipstats10000'),
    ]

    operations = [
        migrations.AddField(
            model_name='globalownershipstats100',
            name='gws_updated',
            field=django_mysql.models.ListTextField(models.IntegerField(help_text='All GWs that have been updated'), default=0, size=38),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='globalownershipstats1000',
            name='gws_updated',
            field=django_mysql.models.ListTextField(models.IntegerField(help_text='All GWs that have been updated'), default=0, size=38),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='globalownershipstats10000',
            name='gws_updated',
            field=django_mysql.models.ListTextField(models.IntegerField(help_text='All GWs that have been updated'), default=0, size=38),
            preserve_default=False,
        ),
    ]
