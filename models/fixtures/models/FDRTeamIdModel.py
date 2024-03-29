import json


class FDRTeamIDModel:
    def __init__(self, team_name_short, fdr, team_id):
        ...
        self.team_name_short = team_name_short
        self.fdr = fdr
        self.team_id = team_id

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)
