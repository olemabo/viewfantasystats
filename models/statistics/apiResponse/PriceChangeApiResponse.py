import json 

class PriceChangeApiModel:
    def __init__(self, player_transfers, team_names_and_ids, gw_list):
        ...
        self.player_transfers = player_transfers
        self.team_names_and_ids = team_names_and_ids
        self.gw_list = gw_list
    
    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)