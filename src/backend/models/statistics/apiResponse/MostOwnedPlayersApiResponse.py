import json 

class MostOwnedPlayersApiResponse:
    def __init__(self, gw, goalkeeper_list, defender_list, midtfielder_list, forward_list):
        ...
        self.gw = gw
        self.goalkeeper_list = goalkeeper_list
        self.defender_list = defender_list
        self.midtfielder_list = midtfielder_list
        self.forward_list = forward_list
    
    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)