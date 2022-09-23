import json

class RankAndPointsApiResponse:
    def __init__(self, gw, rank_and_points_list):
        ...
        self.gw = gw
        self.rank_and_points_list = rank_and_points_list
    
    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)