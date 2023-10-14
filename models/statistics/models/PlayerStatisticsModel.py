import json   


class PlayerStatisticsModel:
    def __init__(self, Name, player_team_id, player_position_id, player_statistics_list):
        ...
        self.Name = Name
        self.player_team_id = player_team_id
        self.player_position_id = player_position_id
        self.player_statistics_list = player_statistics_list
    
    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)
