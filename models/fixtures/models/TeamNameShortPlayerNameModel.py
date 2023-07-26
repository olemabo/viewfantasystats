import json 


class TeamNameShortPlayerNameModel:
    def __init__(self, team_name_short, player_name):
        ...
        self.team_name_short = team_name_short
        self.player_name = player_name

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)