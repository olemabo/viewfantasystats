from constants import total_number_of_gameweeks_in_eliteserien
from django_mysql.models import ListTextField
from django.urls import reverse
from django.db import models


class EliteserienPlayerStatistic(models.Model):
    """FPL Player model. Statistics relevant for each player in fpl."""
    # one stat for each gameweek + 1 total stat for all gws
    number_of_gws = total_number_of_gameweeks_in_eliteserien + 1
    # Fields
    player_id = models.IntegerField(primary_key=True, help_text='Enter team id (1) ')
    player_team_id = models.IntegerField(help_text='Enter team id for this player (1)  ')
    player_position_id = models.IntegerField(help_text='Enter position id for this player (2) ')
    player_name = models.CharField(max_length=40, help_text='Enter player name (Bruno Miguel & Borges Fernandes) ')
    player_web_name = models.CharField(max_length=40, help_text='Enter player web name (Fernandes) ')
    chance_of_playing = models.CharField(max_length=5, help_text='Enter chance of playing next round (75%) ')
    player_status = models.CharField(max_length=1, help_text='Player status (a=available, u=unavailble,i,d)', blank=True, null=True)

    assists_list = ListTextField(
        base_field=models.IntegerField(help_text='Enter number of assist (2)'),
        size=number_of_gws,  # Maximum of 100 ids in list
    )

    bonus_list = ListTextField(
        base_field=models.IntegerField(help_text='Enter number of bonus (3)'),
        size=number_of_gws,  # Maximum of 100 ids in list
    )

    clean_sheets_list = ListTextField(
        base_field=models.IntegerField(help_text='Clean sheets (1/0)'),
        size=number_of_gws,  # Maximum of 100 ids in list
    )

    goals_conceded_list = ListTextField(
        base_field=models.IntegerField(help_text='Enter number of goals_conceded (2)'),
        size=number_of_gws,  # Maximum of 100 ids in list
    )

    goals_scored_list = ListTextField(
        base_field=models.IntegerField(help_text='Enter number of goals_scored in this match by this team (2)'),
        size=number_of_gws,  # Maximum of 100 ids in list
    )

    minutes_list = ListTextField(
        base_field=models.IntegerField(help_text='Enter number of minutes played (61)'),
        size=number_of_gws,  # Maximum of 100 ids in list
    )

    opponent_team_list = ListTextField(
        base_field=models.IntegerField(help_text='Enter opponent_team index (6)'),
        size=number_of_gws,  # Maximum of 100 ids in list
    )

    own_goals_list = ListTextField(
        base_field=models.IntegerField(help_text='Enter number of own_goals (2)'),
        size=number_of_gws,  # Maximum of 100 ids in list
    )

    penalties_missed_list = ListTextField(
        base_field=models.IntegerField(help_text='Enter number of penalties_missed (1)'),
        size=number_of_gws,  # Maximum of 100 ids in list
    )

    penalties_saved_list = ListTextField(
        base_field=models.IntegerField(help_text='Enter number of penalties_saved (0)'),
        size=number_of_gws,  # Maximum of 100 ids in list
    )

    red_cards_list = ListTextField(
        base_field=models.IntegerField(help_text='Enter number of red_cards (0)'),
        size=number_of_gws,  # Maximum of 100 ids in list
    )

    round_list = ListTextField(
        base_field=models.IntegerField(help_text='Enter gw/round number (28)'),
        size=number_of_gws,  # Maximum of 100 ids in list
    )

    saves_list = ListTextField(
        base_field=models.IntegerField(help_text='Enter number of saves (6)'),
        size=number_of_gws,  # Maximum of 100 ids in list
    )

    selected_list = ListTextField(
        base_field=models.IntegerField(help_text='Enter number of people selected this player (335552)'),
        size=number_of_gws,  # Maximum of 100 ids in list
    )

    team_a_score_list = ListTextField(
        base_field=models.CharField(max_length=5, help_text='Enter goals scored by away team (3)'),
        size=number_of_gws,  # Maximum of 100 ids in list
    )

    team_h_score_list = ListTextField(
        base_field=models.CharField(max_length=5, help_text='Enter goals scored by home team (1)'),
        size=number_of_gws,  # Maximum of 100 ids in list
    )

    total_points_list = ListTextField(
        base_field=models.IntegerField(help_text='Enter total_points (12)'),
        size=number_of_gws,  # Maximum of 100 ids in list
    )

    transfers_balance_list = ListTextField(
        base_field=models.IntegerField(help_text='Enter transfers_balance (-140303)'),
        size=number_of_gws,  # Maximum of 100 ids in list
    )

    transfers_in_list = ListTextField(
        base_field=models.IntegerField(help_text='Enter transfers_in (71659)'),
        size=number_of_gws,  # Maximum of 100 ids in list
    )

    transfers_out_list = ListTextField(
        base_field=models.IntegerField(help_text='Enter transfers_out (216199)'),
        size=number_of_gws,  # Maximum of 100 ids in list
    )

    value_list = ListTextField(
        base_field=models.IntegerField(help_text='Enter value (126)'),
        size=number_of_gws,  # Maximum of 100 ids in list
    )

    was_home_list = ListTextField(
        base_field=models.IntegerField(help_text='Played a home game? (1/0)'),
        size=number_of_gws,  # Maximum of 100 ids in list
    )

    yellow_cards_list = ListTextField(
        base_field=models.IntegerField(help_text='Number of yellow_cards (1)'),
        size=number_of_gws,  # Maximum of 100 ids in list
    )

    opta_index_list = ListTextField(
        base_field=models.CharField(max_length=10, help_text='Opta index ("47.810070")', blank=True, null=True),
        size=number_of_gws,  # Maximum of 100 ids in list
    )

    fixture_id_list = ListTextField(
        base_field=models.IntegerField(help_text='Fixture id (9)', blank=True, null=True),
        size=number_of_gws,  # Maximum of 100 ids in list
    )

    # Metadata
    class Meta:
        ordering = ['player_id', 'player_name', 'player_team_id', 'player_position_id']
        verbose_name = "ESF - Player stat"
        verbose_name_plural = "ESF - Player stats"

    # Methods
    def get_absolute_url(self):
        """Returns the url to access a particular instance of MyModelName."""
        return reverse('model-detail-view', args=[str(self.player_id)])

    def __str__(self):
        """String for representing the MyModelName object (in Admin site etc.)."""
        return f'{self.player_id}, {self.player_name}'