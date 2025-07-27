from rest_framework import serializers

class PlayerStatisticsModel:
    def __init__(self, Name, player_position_id, player_team_id, player_statistics_list):
        self.Name = Name
        self.player_position_id = player_position_id
        self.player_team_id = player_team_id
        self.player_statistics_list = player_statistics_list

    def to_dict(self):
        return {
            "Name": self.Name,
            "player_position_id": self.player_position_id,
            "player_team_id": self.player_team_id,
            "player_statistics_list": self.player_statistics_list
        }