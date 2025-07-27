class TeamModel:
    def __init__(self, team_name, team_id):
        self.team_name = team_name
        self.team_id = team_id

    def toJson(self):
        return {
            "team_name": self.team_name,
            "team_id": self.team_id
        }