import json

class PlayerStatisticsApiResponse:
    def __init__(self, last_x_gw, player_info, categories, team_names_and_ids, total_number_of_gws):
        ...
        self.last_x_gw = last_x_gw
        self.player_info = player_info
        self.categories = categories
        self.team_names_and_ids = team_names_and_ids
        self.total_number_of_gws = total_number_of_gws
    
    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)
