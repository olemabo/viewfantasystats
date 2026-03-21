class FDRTeamIDModel:
    def __init__(self, team_name_short, fdr, team_id):
        self.team_name_short = team_name_short
        self.fdr = fdr
        self.team_id = team_id

    def to_dict(self):
        return {
            "team_name_short": self.team_name_short,
            "fdr": self.fdr,
            "team_id": self.team_id,
        }