class RotationPlannerTeamInfoModel:
    def __init__(
        self,
        avg_Score,
        id_list,
        team_name_list,
        extra_fixtures,
        home_games,
        fixture_list,
    ):
        self.avg_Score = avg_Score
        self.id_list = id_list
        self.team_name_list = team_name_list
        self.extra_fixtures = extra_fixtures
        self.home_games = home_games
        self.fixture_list = fixture_list

    def to_dict(self):
        return {
            "avg_Score": self.avg_Score,
            "id_list": self.id_list,
            "team_name_list": self.team_name_list,
            "extra_fixtures": self.extra_fixtures,
            "home_games": self.home_games,
            "fixture_list": self.fixture_list,
        }