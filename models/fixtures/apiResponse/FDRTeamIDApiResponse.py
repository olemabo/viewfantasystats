import json


class FDRApiResponse:
    def __init__(self, fdr_data, fdr_data_defensive, fdr_data_offensive, 
                 gws_and_dates, gw_start, gw_end, 
                 current_gw, max_gw, player_list=[]):
        ...
        self.fdr_data = fdr_data
        self.fdr_data_defensive = fdr_data_defensive
        self.fdr_data_offensive = fdr_data_offensive
        self.gws_and_dates = gws_and_dates
        self.gw_start = gw_start
        self.gw_end = gw_end
        self.current_gw = current_gw
        self.max_gw = max_gw
        self.player_list = player_list

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)
    

class FDRTeamIDApiResponse:
    def __init__(self, goal_keepers, defenders, midtfielders, forwards):
        ...
        self.goal_keepers = goal_keepers
        self.defenders = defenders
        self.midtfielders = midtfielders
        self.forwards = forwards

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)