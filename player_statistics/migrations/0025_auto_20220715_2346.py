# Generated by Django 3.1.4 on 2022-07-15 21:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('player_statistics', '0024_eliteseriennationalitystatistics'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='EliteserienGlobalOwnershipStats10000',
            new_name='EliteserienGlobalOwnershipStats5000',
        ),
        migrations.RenameField(
            model_name='eliteserienchipsanduserinfo',
            old_name='extra_info_top_10000',
            new_name='extra_info_top_5000',
        ),
        migrations.RenameField(
            model_name='eliteseriengwschecked',
            old_name='gws_updated_10000',
            new_name='gws_updated_5000',
        ),
    ]