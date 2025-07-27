from constants import current_season_name_premier_league
from django.urls import reverse
from django.db import models
import json

class PremierLeagueSeasonMetadata(models.Model):
    season_name = models.CharField(primary_key=True, max_length=20, help_text='Season name: ', default=current_season_name_premier_league)

    date_modified = models.CharField(max_length=20)

    # Metadata
    class Meta:
        ordering = ['season_name']
        verbose_name = "PL - Season metadata"
        verbose_name_plural = "PL - Season metadata"

    # Methods
    def get_absolute_url(self):
        """Returns the url to access a particular instance of MyModelName."""
        return reverse('model-detail-view', args=[str(self.season_name)])

    def __str__(self):
        """String for representing the MyModelName object (in Admin site etc.)."""
        return f'{self.season_name}'

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)