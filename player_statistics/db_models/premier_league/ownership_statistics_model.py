import json
from django.db import models
from django.urls import reverse
from django_mysql.models import ListTextField
from constants import total_number_of_gameweeks


class PremierLeagueGlobalOwnershipStats10000(models.Model):
    # one stat for each gameweek + 1 total stat for all gws
    number_of_gws = total_number_of_gameweeks
    top_x = 10000
    number_of_ownership_stats = 6 # [starting and not captain, starting and captain, starting and vice captain, owners, benched]
    player_id = models.IntegerField(primary_key=True, help_text='Enter team id (1) ')
    player_team_id = models.IntegerField(help_text='Enter team id for this player (1)  ')
    player_position_id = models.IntegerField(help_text='Enter position id for this player (2) ')
    player_name = models.CharField(max_length=40, help_text='Enter player name (Salah) ')

    gws_updated = ListTextField(
        base_field=models.IntegerField(help_text='All GWs that have been updated'),
        size=number_of_gws,  # Maximum of 100 ids in list
    )

    gw_1 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 1'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_2 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 2'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_3 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 3'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )
    gw_4 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 4'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_5 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 5'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_6 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 6'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_7 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 7'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_8 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 8'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_9 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 9'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_10 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 10'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_11 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 11'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_12 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 12'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_13 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 13'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_14 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 14'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_15 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 15'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_16 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 16'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_17 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 17'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_18 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 18'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_19 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 19'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_20 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 20'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_21 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 21'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_22 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 22'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_23 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 23'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_24 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 24'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_25 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 25'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_26 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 26'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_27 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 27'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_28 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 28'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_29 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 29'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_30 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 30'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_31 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 31'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_32 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 32'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_33 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 33'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_34 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 34'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_35 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 35'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_36 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 36'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_37 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 37'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_38 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 38'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    # Metadata
    class Meta:
        ordering = ['player_id', 'player_name', 'player_team_id', 'player_position_id']
        verbose_name = "PL - Ownership stat (10000)"
        verbose_name_plural = "PL - Ownership stats (10000)"

    # Methods
    def get_absolute_url(self):
        """Returns the url to access a particular instance of MyModelName."""
        return reverse('model-detail-view', args=[str(self.player_id)])

    def __str__(self):
        """String for representing the MyModelName object (in Admin site etc.)."""
        return f'{self.player_id}, {self.player_name}'
    
    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)


class PremierLeagueGlobalOwnershipStats1000(models.Model):
    # one stat for each gameweek + 1 total stat for all gws
    number_of_gws = total_number_of_gameweeks
    top_x = 1000
    number_of_ownership_stats = 6  # [starting and not captain, starting and captain, starting and vice captain, owners, benched]
    player_id = models.IntegerField(primary_key=True, help_text='Enter team id (1) ')
    player_team_id = models.IntegerField(help_text='Enter team id for this player (1)  ')
    player_position_id = models.IntegerField(help_text='Enter position id for this player (2) ')
    player_name = models.CharField(max_length=40, help_text='Enter player name (Salah) ')

    gws_updated = ListTextField(
        base_field=models.IntegerField(help_text='All GWs that have been updated'),
        size=number_of_gws,  # Maximum of 100 ids in list
    )

    gw_1 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 1'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_2 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 2'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_3 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 3'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )
    gw_4 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 4'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_5 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 5'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_6 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 6'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_7 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 7'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_8 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 8'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_9 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 9'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_10 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 10'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_11 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 11'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_12 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 12'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_13 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 13'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_14 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 14'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_15 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 15'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_16 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 16'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_17 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 17'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_18 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 18'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_19 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 19'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_20 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 20'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_21 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 21'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_22 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 22'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_23 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 23'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_24 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 24'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_25 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 25'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_26 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 26'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_27 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 27'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_28 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 28'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_29 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 29'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_30 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 30'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_31 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 31'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_32 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 32'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_33 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 33'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_34 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 34'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_35 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 35'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_36 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 36'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_37 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 37'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_38 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 38'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    def extract_data_from_current_gw(self, current_gw):
        field_name = f'gw_{current_gw}'
        field_value = getattr(self, field_name, None)
        if field_value:
            return field_value
        else:
            return None

    # Metadata
    class Meta:
        ordering = ['player_id', 'player_name', 'player_team_id', 'player_position_id']
        verbose_name = "PL - Ownership stat (1000)"
        verbose_name_plural = "PL - Ownership stats (1000)"

    # Methods
    def get_absolute_url(self):
        """Returns the url to access a particular instance of MyModelName."""
        return reverse('model-detail-view', args=[str(self.player_id)])

    def __str__(self):
        """String for representing the MyModelName object (in Admin site etc.)."""
        return f'{self.player_id}, {self.player_name}'

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)


class PremierLeagueGlobalOwnershipStats100(models.Model):
    # one stat for each gameweek + 1 total stat for all gws
    number_of_gws = total_number_of_gameweeks
    top_x = 100
    number_of_ownership_stats = 6  # [starting and not captain, starting and captain, starting and vice captain, owners, benched]
    player_id = models.IntegerField(primary_key=True, help_text='Enter team id (1) ')
    player_team_id = models.IntegerField(help_text='Enter team id for this player (1)  ')
    player_position_id = models.IntegerField(help_text='Enter position id for this player (2) ')
    player_name = models.CharField(max_length=40, help_text='Enter player name (Salah) ')

    gw_1 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 1'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_2 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 2'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_3 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 3'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )
    gw_4 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 4'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_5 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 5'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_6 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 6'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_7 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 7'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_8 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 8'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_9 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 9'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_10 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 10'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_11 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 11'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_12 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 12'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_13 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 13'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_14 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 14'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_15 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 15'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_16 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 16'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_17 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 17'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_18 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 18'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_19 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 19'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_20 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 20'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_21 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 21'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_22 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 22'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_23 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 23'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_24 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 24'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_25 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 25'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_26 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 26'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_27 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 27'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_28 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 28'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_29 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 29'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_30 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 30'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_31 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 31'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_32 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 32'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_33 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 33'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_34 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 34'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_35 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 35'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_36 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 36'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_37 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 37'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    gw_38 = ListTextField(
        base_field=models.IntegerField(help_text='Ownership GW 38'),
        size=number_of_ownership_stats,  # Maximum of 100 ids in list
    )

    # Metadata
    class Meta:
        ordering = ['player_id', 'player_name', 'player_team_id', 'player_position_id']
        verbose_name = "PL - Ownership stat (100)"
        verbose_name_plural = "PL - Ownership stats (100)"

    # Methods
    def get_absolute_url(self):
        """Returns the url to access a particular instance of MyModelName."""
        return reverse('model-detail-view', args=[str(self.player_id)])

    def __str__(self):
        """String for representing the MyModelName object (in Admin site etc.)."""
        return f'{self.player_id}, {self.player_name}'
    
    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)


class PremierLeagueChipsAndUserInfo(models.Model):
    # one stat for each gameweek + 1 total stat for all gws
    number_of_gws = total_number_of_gameweeks
    number_of_extra_info = 10  # [Freehit, BB, TC, WC, None, Avg Value, Avg event transfer, Avg transfer cost, total points, bank]
    number_of_total_chip_usage = 6  # [Freehit, BB, TC, WC1, WC2, None]

    gw = models.IntegerField(primary_key=True, help_text='Enter gameweek number (1) ')

    extra_info_top_1 = ListTextField(
        base_field=models.IntegerField(help_text='Extra info among top 1'),
        size=number_of_extra_info,  # Maximum of 100 ids in list
    )

    extra_info_top_10 = ListTextField(
        base_field=models.IntegerField(help_text='Extra info among top 10'),
        size=number_of_extra_info,  # Maximum of 100 ids in list
    )

    extra_info_top_100 = ListTextField(
        base_field=models.IntegerField(help_text='Extra info among top 100'),
        size=number_of_extra_info,  # Maximum of 100 ids in list
    )

    extra_info_top_1000 = ListTextField(
        base_field=models.IntegerField(help_text='Extra info among top 1000'),
        size=number_of_extra_info,  # Maximum of 100 ids in list
    )

    extra_info_top_10000 = ListTextField(
        base_field=models.IntegerField(help_text='Extra info among top 10000'),
        size=number_of_extra_info,  # Maximum of 100 ids in list
    )

    total_chip_usage_1 = ListTextField(
        base_field=models.IntegerField(help_text='Total chip usage among top 1'),
        size=number_of_total_chip_usage,  # Maximum of 100 ids in list
        blank=True,
    )

    total_chip_usage_10 = ListTextField(
        base_field=models.IntegerField(help_text='Total chip usage among top 10'),
        size=number_of_total_chip_usage,  # Maximum of 100 ids in list
        blank=True,
    )

    total_chip_usage_100 = ListTextField(
        base_field=models.IntegerField(help_text='Total chip usage among top 100'),
        size=number_of_total_chip_usage,  # Maximum of 100 ids in list
        blank=True,
    )

    total_chip_usage_1000 = ListTextField(
        base_field=models.IntegerField(help_text='Total chip usage among top 1000'),
        size=number_of_total_chip_usage,  # Maximum of 100 ids in list
        blank=True,
    )

    total_chip_usage_10000 = ListTextField(
        base_field=models.IntegerField(help_text='Total chip usage among top 10000'),
        size=number_of_total_chip_usage,  # Maximum of 100 ids in list
        blank=True,
    )

    global_chip_usage_this_gw = ListTextField(
        base_field=models.IntegerField(help_text='Global chip usage for all managers this round', blank=True, null=True),
        size=number_of_total_chip_usage,  # Maximum of 100 ids in list
        blank=True,
    )

    global_chip_usage_total = ListTextField(
        base_field=models.IntegerField(help_text='Global chip usage for all managers in total', blank=True, null=True),
        size=number_of_total_chip_usage,  # Maximum of 100 ids in list
        blank=True,
    )

    number_of_managers = models.IntegerField(help_text='Number of managers (130328)', blank=True, null=True)

    # Metadata
    class Meta:
        ordering = ['gw']
        verbose_name = "PL - Chip and User stat"
        verbose_name_plural = "PL - Chip and User stats"

    # Methods
    def get_absolute_url(self):
        """Returns the url to access a particular instance of MyModelName."""
        return reverse('model-detail-view', args=[str(self.gw)])

    def __str__(self):
        """String for representing the MyModelName object (in Admin site etc.)."""
        return f'{self.gw}'
    
    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)



class PremierLeagueGwsChecked(models.Model):
    number_of_gws = total_number_of_gameweeks

    id = models.IntegerField(primary_key=True, help_text='Enter team id (1) ', default=1)

    date_modified = models.CharField(max_length=20)

    gws_updated_100 = ListTextField(
        base_field=models.IntegerField(help_text='All GWs that have been updated'),
        size=number_of_gws,  # Maximum of 100 ids in list
    )

    gws_updated_1000 = ListTextField(
        base_field=models.IntegerField(help_text='All GWs that have been updated'),
        size=number_of_gws,  # Maximum of 100 ids in list
    )

    gws_updated_10000 = ListTextField(
        base_field=models.IntegerField(help_text='All GWs that have been updated'),
        size=number_of_gws,  # Maximum of 100 ids in list
    )

    # Metadata
    class Meta:
        ordering = ['id']
        verbose_name = "PL - Updated GW"
        verbose_name_plural = "PL - Updated GWs"

    # Methods
    def get_absolute_url(self):
        """Returns the url to access a particular instance of MyModelName."""
        return reverse('model-detail-view', args=[str(self.id)])

    def __str__(self):
        """String for representing the MyModelName object (in Admin site etc.)."""
        return f'{self.id}'

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)