# Generated by Django 3.1.4 on 2021-10-17 15:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('player_statistics', '0018_auto_20211017_1642'),
    ]

    operations = [
        migrations.CreateModel(
            name='NationalityStatistics',
            fields=[
                ('country_code', models.CharField(help_text='ISO name', max_length=5, primary_key=True, serialize=False)),
                ('country_name', models.CharField(help_text='Country name', max_length=30)),
                ('number_of_managers_from_this_country', models.IntegerField(help_text='Number of managers from this country')),
            ],
            options={
                'ordering': ['country_name', 'number_of_managers_from_this_country', 'country_code'],
            },
        ),
    ]
