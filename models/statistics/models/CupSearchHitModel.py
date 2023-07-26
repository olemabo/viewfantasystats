import json 

class CupSearchHitModel:
    def __init__(self, user_id, name, team_name, round_lost, cup_round_data, hit_number):
        ...
        self.user_id = user_id
        self.name = name
        self.team_name = team_name
        self.round_lost = round_lost
        self.cup_round_data = cup_round_data
        self.hit_number = hit_number
    
    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)