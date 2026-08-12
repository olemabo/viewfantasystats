class FixtureDifficultyModel:
    def __init__(
        self,
        team_name,
        opponent_team_name,
        difficulty_score,
        home_away,
        use_not_use,
        fdr_score=0,
        double_blank="",
        message="",
    ):
        self.team_name = team_name
        self.opponent_team_name = opponent_team_name
        self.difficulty_score = difficulty_score
        self.home_away = home_away
        self.use_not_use = use_not_use
        self.fdr_score = fdr_score
        self.double_blank = double_blank
        self.message = message

    def to_dict(self):
        return {
            "teamName": self.team_name,
            "opponentTeamName": self.opponent_team_name,
            "difficultyScore": self.difficulty_score,
            "homeAway": self.home_away,
            "useNotUse": self.use_not_use,
            "fdrScore": self.fdr_score,
            "doubleBlank": self.double_blank,
            "message": self.message,
        }