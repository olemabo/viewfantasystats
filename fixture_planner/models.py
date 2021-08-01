from django.db import models

# Create your models here.

from django.db import models
from django.urls import reverse
from datetime import date
from django_mysql.models import ListTextField
import fixture_planner.read_data as read_data


class AddPlTeamsToDB(models.Model):
    """A typical class defining a model, derived from the Model class."""

    # Fields
    team_name = models.CharField(max_length=30, help_text='Enter team name (Arsenal)')
    team_id = models.IntegerField(primary_key=True, help_text='Enter team id (1) ')
    team_short_name = models.CharField(max_length=3, help_text='Enter team name short (ARS)')
    date = models.DateField(default=date.today(), help_text='Date entered into database')

    oppTeamNameList = ListTextField(
        base_field=models.CharField(max_length=3, help_text='Enter team name short (ARS)'),
        size=38,  # Maximum of 100 ids in list
    )

    oppTeamHomeAwayList = ListTextField(
        base_field=models.CharField(max_length=1, help_text='H/A'),
        size=38,  # Maximum of 100 ids in list
    )

    oppTeamDifficultyScore = ListTextField(
        base_field=models.IntegerField(help_text='1-5'),
        size=38,  # Maximum of 100 ids in list
    )

    gw = ListTextField(
        base_field=models.IntegerField(help_text='1-38'),
        size=38,  # Maximum of 100 ids in list
    )


    # Metadata
    class Meta:
        ordering = ['team_id', '-team_name', 'team_short_name']

    # Methods
    def get_absolute_url(self):
        """Returns the url to access a particular instance of MyModelName."""
        return reverse('model-detail-view', args=[str(self.team_id)])


    def __str__(self):
        """String for representing the MyModelName object (in Admin site etc.)."""
        return f'{self.team_name}, {self.team_id}'

    def as_json(self):
        return dict(
            team_name=self.team_name,
            team_id=self.team_id,
            team_short_name=self.team_short_name,
            date=self.date,
            oppTeamNameList=self.oppTeamNameList,
            oppTeamHomeAwayList=self.oppTeamHomeAwayList,
            oppTeamDifficultyScore=self.oppTeamDifficultyScore,
            gw=self.gw,
        )


class KickOffTime(models.Model):
    gameweek = models.IntegerField(primary_key=True, help_text='Gameweek number')
    kickoff_time = models.CharField(max_length=20, help_text="Kickoff time for given gameweek")
    day_month = models.CharField(max_length=7, help_text="Kickoff time short version (12. jan)")

    class Meta:
        ordering = ['gameweek']

    def __str__(self):
        """String for representing the MyModelName object (in Admin site etc.)."""
        return f'{self.gameweek}, {self.kickoff_time}'



def fill_database():
    df, names, short_names = read_data.return_fixture_names_shortnames()
