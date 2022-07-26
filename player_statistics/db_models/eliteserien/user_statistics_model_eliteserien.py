from django.urls import reverse
from django.db import models
import json
# from django_mysql.models import ListTextField

class UserInfoStatistics(models.Model):
    # one stat for each gameweek + 1 total stat for all gws
    user_id = models.IntegerField(primary_key=True, help_text='Enter user id (1)')
    user_team_name = models.CharField(max_length=40, help_text='Enter team name')
    user_first_name = models.CharField(max_length=40, help_text='Enter user first name')
    user_last_name = models.CharField(max_length=40, help_text='Enter user last name')

    # joined_time = models.CharField(max_length=40, help_text='Enter player name (Salah) ')
    # started_event = models.CharField(max_length=40, help_text='Enter player name (Salah) ')
    # favourite_team = models.CharField(max_length=40, help_text='Enter player name (Salah) ')
    # player_region_id = models.CharField(max_length=40, help_text='Enter player name (Salah) ')
    # player_region_name = models.CharField(max_length=40, help_text='Enter player name (Salah) ')
    # player_region_iso_code_long = models.CharField(max_length=40, help_text='Enter player name (Salah) ')
    
    # ranking_history = ListTextField(
    #     base_field=models.IntegerField(help_text='All rankings from previous gws'),
    #     size=number_of_gws,  # Maximum of 100 ids in list
    #     blank=True,
    # )
    # {"season_name":"2017","total_points":1424,"rank":5410},{"season_name":"2018","total_points":1475,"rank":6816},{"season_name":"2019","total_points":1524,"rank":12364},{"season_name":"2020","total_points":1620,"rank":14859},{"season_name":"2021","total_points":1595,"rank":8051}
    
    
    # Metadata
    class Meta:
        ordering = ['user_id', 'user_first_name', 'user_last_name', 'user_team_name']

    # Methods
    def get_absolute_url(self):
        """Returns the url to access a particular instance of MyModelName."""
        return reverse('model-detail-view', args=[str(self.user_id)])

    def __str__(self):
        """String for representing the MyModelName object (in Admin site etc.)."""
        return f'{self.user_id}, {self.user_team_name}'

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)