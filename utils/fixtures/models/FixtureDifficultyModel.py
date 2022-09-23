import json


class FixtureDifficultyModel:
    def __init__(self, team_name, opponent_team_name, this_difficulty_score, H_A, Use_Not_Use, total_fdr_score=0):
        ...
        self.team_name = team_name
        self.opponent_team_name = opponent_team_name
        self.difficulty_score = this_difficulty_score
        self.H_A = H_A
        self.FDR_score = total_fdr_score
        self.Use_Not_Use = Use_Not_Use

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)