class FDRModel:
    def __init__(self, opponent_team_name, this_difficulty_score, H_A, message):
        ...
        self.opponent_team_name = opponent_team_name
        self.difficulty_score = this_difficulty_score
        self.H_A = H_A
        self.message = message

    def to_dict(self):
        return {
            "opponentTeamName": self.opponent_team_name,
            "difficultyScore": self.difficulty_score,
            "H_A": self.H_A,
            "UseNotUse": getattr(self, "UseNotUse", 0),
            "message": self.message,
        }