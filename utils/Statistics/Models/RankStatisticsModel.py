import json 

class RankStatisticsModel:
    def __init__(self, user_id, name, avg_rank, avg_points, avg_rank_ranking, avg_points_ranking):
        ...
        self.user_id = user_id
        self.name = name
        self.avg_rank = avg_rank
        self.avg_points = avg_points
        self.avg_rank_ranking = avg_rank_ranking
        self.avg_points_ranking = avg_points_ranking
    
    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)