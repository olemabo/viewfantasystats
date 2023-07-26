import json


class FDRModel:
    def __init__(self, opponent_team_name, this_difficulty_score, H_A):
        ...
        self.opponent_team_name = opponent_team_name
        self.difficulty_score = this_difficulty_score
        self.H_A = H_A

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)