# Generated by Django 3.1.4 on 2022-10-09 12:49

from django.db import migrations, models
import django_mysql.models


class Migration(migrations.Migration):

    dependencies = [
        ('player_statistics', '0039_eliteserienrankandpoints'),
    ]

    operations = [
        migrations.CreateModel(
            name='EliteserienCupStatistics',
            fields=[
                ('id', models.IntegerField(help_text='ISO name', primary_key=True, serialize=False)),
                ('name', models.CharField(help_text='Manager name', max_length=30)),
                ('team_name', models.CharField(help_text='Team name', max_length=30)),
                ('round_lost', models.IntegerField(help_text='Round the manager lost in the cup')),
                ('qualification_rank', models.IntegerField(help_text='Qualification rank')),
                ('still_in_cup', models.BooleanField()),
                ('ranking_history', django_mysql.models.ListTextField(models.CharField(help_text='opponent_entry_id, opponent_name, opponent_player_name, opponent_points, current_points, winner_id, current_cup_round  --- 12285,Stensness FK,Mattias Steinnes,70,91,16,17', max_length=120), blank=True, size=15)),
            ],
            options={
                'ordering': ['name', 'team_name'],
            },
        ),
    ]
