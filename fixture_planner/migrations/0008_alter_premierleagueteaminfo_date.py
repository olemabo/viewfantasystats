# Generated by Django 4.1.7 on 2023-06-03 13:12

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fixture_planner', '0007_alter_premierleagueteaminfo_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='premierleagueteaminfo',
            name='date',
            field=models.DateField(default=datetime.date(2023, 6, 3), help_text='Date entered into database'),
        ),
    ]
