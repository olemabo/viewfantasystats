# Generated by Django 3.1.4 on 2024-07-16 17:42

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fixture_planner', '0009_auto_20240527_2259'),
    ]

    operations = [
        migrations.AlterField(
            model_name='premierleagueteaminfo',
            name='date',
            field=models.DateField(default=datetime.date(2024, 7, 16), help_text='Date entered into database'),
        ),
    ]
