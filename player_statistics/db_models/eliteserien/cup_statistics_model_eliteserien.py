from constants import number_of_cup_rounds_eliteserien
from django_mysql.models import ListTextField
from django.urls import reverse
from django.db import models


class EliteserienCupStatistics(models.Model):
    # one stat for each gameweek + 1 total stat for all gws

    id = models.IntegerField(primary_key=True, help_text='ISO name')
    name = models.CharField(max_length=30, help_text="Manager name")
    team_name = models.CharField(max_length=30, help_text="Team name")
    round_lost = models.IntegerField(help_text='Round the manager lost in the cup')
    qualification_rank = models.IntegerField(help_text='Qualification rank')
    still_in_cup = models.BooleanField()

    cup_history = ListTextField(
        base_field=models.CharField(max_length=120, help_text='opponent_entry_id, opponent_name, opponent_player_name, opponent_points, current_points, winner_id, current_cup_round  --- 12285,Stensness FK,Mattias Steinnes,70,91,16,17'),
        size=number_of_cup_rounds_eliteserien,
        blank=True,
    )

    # Metadata
    class Meta:
        ordering = ['name', 'team_name']

    # Methods
    def get_absolute_url(self):
        """Returns the url to access a particular instance of MyModelName."""
        return reverse('model-detail-view', args=[str(self.name)])

    def __str__(self):
        """String for representing the MyModelName object (in Admin site etc.)."""
        return f'{self.name}'