import json 

class CupStatisticsApiResponse:
    def __init__(self, cup_start, cup_last_gw, cup_data):
        ...
        self.cup_start = cup_start
        self.cup_last_gw = cup_last_gw
        self.cup_data = cup_data
    
    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)