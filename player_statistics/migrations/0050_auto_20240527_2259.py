# Generated by Django 3.1.4 on 2024-05-27 20:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('player_statistics', '0049_alter_premierleagueplayers_creativity_list_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='eliteserienchipsanduserinfo',
            name='date_updated',
            field=models.DateTimeField(blank=True, help_text='Dato eierandel og chips ble lastet ned', null=True),
        ),
        migrations.AddField(
            model_name='premierleaguechipsanduserinfo',
            name='date_updated',
            field=models.DateTimeField(blank=True, help_text='Dato eierandel og chips ble lastet ned', null=True),
        ),
    ]
