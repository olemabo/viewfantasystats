import json

class PlayerStatisticsModel:
    def __init__(self, name, points, bps_list, ict_index, influence, creativity, threat, team_id, player_position_id):
        ...
        self.Name = name
        self.Points = points
        self.Bps = bps_list
        self.ICT = ict_index
        self.I = influence
        self.C = creativity
        self.T = threat
        self.player_team_id = team_id
        self.player_position_id = player_position_id
    
    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)
