from django_mysql.models import ListTextField
from django.urls import reverse
from django.db import models
import json


class EliteserienRankAndPoints(models.Model):
    # one stat for each gameweek + 1 total stat for all gws
    gw = models.IntegerField(primary_key=True, help_text='Enter gw (1)')

    ranking_history = ListTextField(
        base_field=models.CharField(max_length=20, help_text='Rank,points,points from 1st -- 1,581,0'),
        size=10,  # Maximum of 10 rank and points
        blank=True,
    )
    
    # Metadata
    class Meta:
        ordering = ['gw']
        verbose_name = "ESF - Ranking stat"
        verbose_name_plural = "ESF - Ranking stats"

    # Methods
    def get_absolute_url(self):
        """Returns the url to access a particular instance of MyModelName."""
        return reverse('model-detail-view', args=[str(self.user_id)])

    def __str__(self):
        """String for representing the MyModelName object (in Admin site etc.)."""
        return f'{self.gw}'

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)