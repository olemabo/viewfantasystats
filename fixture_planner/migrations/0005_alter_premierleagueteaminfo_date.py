# Generated by Django 4.1.7 on 2023-04-19 17:44

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fixture_planner', '0004_alter_kickofftime_options_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='premierleagueteaminfo',
            name='date',
            field=models.DateField(default=datetime.date(2023, 4, 19), help_text='Date entered into database'),
        ),
    ]
