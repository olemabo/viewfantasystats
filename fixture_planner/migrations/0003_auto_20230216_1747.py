# Generated by Django 3.1.4 on 2023-02-16 16:47

from django.db import migrations, models
import django_mysql.models


class Migration(migrations.Migration):

    dependencies = [
        ('fixture_planner', '0002_auto_20230216_1732'),
    ]

    operations = [
        migrations.AlterField(
            model_name='premierleagueteaminfo',
            name='possibleBlank',
            field=django_mysql.models.ListTextField(models.CharField(help_text='+90', max_length=3), size=38),
        ),
    ]
