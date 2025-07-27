from constants import total_number_of_gameweeks
from django_mysql.models import ListTextField
from django.urls import reverse
from django.db import models
from datetime import date


class PremierLeagueTeamInfo(models.Model):
    """A typical class defining a model, derived from the Model class."""

    # Fields
    team_name = models.CharField(max_length=30, help_text='Enter team name (Arsenal)')
    team_id = models.IntegerField(primary_key=True, help_text='Enter team id (1) ')
    team_short_name = models.CharField(max_length=3, help_text='Enter team name short (ARS)')
    date = models.DateField(default=date.today(), help_text='Date entered into database')

    oppTeamNameList = ListTextField(
        base_field=models.CharField(max_length=3, help_text='Enter team name short (ARS)'),
        size=total_number_of_gameweeks,  # Maximum of 100 ids in list
    )

    oppTeamHomeAwayList = ListTextField(
        base_field=models.CharField(max_length=1, help_text='H/A'),
        size=total_number_of_gameweeks,  # Maximum of 100 ids in list
    )

    oppTeamDifficultyScore = ListTextField(
        base_field=models.IntegerField(help_text='1-5'),
        size=total_number_of_gameweeks,  # Maximum of 100 ids in list
    )

    gw = ListTextField(
        base_field=models.IntegerField(help_text='1-38'),
        size=total_number_of_gameweeks,  # Maximum of 100 ids in list
    )

    possibleBlank = ListTextField(
        base_field=models.CharField(max_length=3, help_text='+90'),
        size=total_number_of_gameweeks,  # Maximum of 100 ids in list
    )

    # Metadata
    class Meta:
        ordering = ['team_id', '-team_name', 'team_short_name']
        verbose_name = "PL - Fixturedata"
        verbose_name_plural = "PL - Fixturedata"

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
        verbose_name = "PL - Kickoff Time"
        verbose_name_plural = "PL - Kickoff Times"

    def __str__(self):
        """String for representing the MyModelName object (in Admin site etc.)."""
        return f'GW {self.gameweek} - {self.day_month}'

