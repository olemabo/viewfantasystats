import json


class PlayerModel:
    def __init__(self, player_team_id, player_position_id, player_web_name):
        ...
        self.player_team_id = player_team_id
        self.player_position_id = player_position_id
        self.player_web_name = player_web_name

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)
 