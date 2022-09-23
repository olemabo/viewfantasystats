import json

class RankStatisticsApiResponse:
    def __init__(self, fantasy_manager_url, list_of_ranks, number_of_last_years):
        ...
        self.fantasy_manager_url = fantasy_manager_url
        self.list_of_ranks = list_of_ranks
        self.number_of_last_years = number_of_last_years
    
    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)