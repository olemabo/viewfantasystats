class TeamNameShortPlayerNameModel:
    def __init__(self, team_name_short, player_name):
        ...
        self.team_name_short = team_name_short
        self.player_name = player_name

    def to_dict(self):
        return {
            "team_name_short": self.team_name_short,
            "player_name": self.player_name,
        }