class FDR_team_Eliteserien:
    """
        Class of a team
    """

    def __init__(self, gws, opp_team_home_away_list, opp_team_name_list, opp_team_difficulty_score):
        """
            Initialize object
        """
        self.gw = gws
        self.oppTeamHomeAwayList = opp_team_home_away_list
        self.oppTeamNameList = opp_team_name_list
        self.oppTeamDifficultyScore = opp_team_difficulty_score
