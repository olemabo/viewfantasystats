# Generated by Django 3.1.4 on 2021-10-17 19:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('player_statistics', '0019_nationalitystatistics'),
    ]

    operations = [
        migrations.AddField(
            model_name='fplplayersmodel',
            name='player_web_name',
            field=models.CharField(default='', help_text='Enter player web name (Salah) ', max_length=40),
            preserve_default=False,
        ),
    ]