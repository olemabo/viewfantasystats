# Generated by Django 3.1.4 on 2022-09-09 17:25

from django.db import migrations, models
import django_mysql.models


class Migration(migrations.Migration):

    dependencies = [
        ('player_statistics', '0038_auto_20220807_1325'),
    ]

    operations = [
        migrations.CreateModel(
            name='EliteserienRankAndPoints',
            fields=[
                ('gw', models.IntegerField(help_text='Enter gw (1)', primary_key=True, serialize=False)),
                ('ranking_history', django_mysql.models.ListTextField(models.CharField(help_text='Rank,points,points from 1st -- 1,581,0', max_length=20), blank=True, size=10)),
            ],
            options={
                'ordering': ['gw'],
            },
        ),
    ]
