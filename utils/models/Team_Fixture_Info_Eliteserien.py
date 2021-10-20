class Team_Fixture_Info_Eliteserien():
    def __init__(self, team_name, team_id, team_short_name, date, opp_team_name_list,
                 opp_team_home_away_list, opp_team_difficulty_score, gw):
        self.team_name = team_name
        self.team_id = team_id
        self.team_short_name = team_short_name
        self.date = date
        self.oppTeamNameList = opp_team_name_list
        self.oppTeamHomeAwayList = opp_team_home_away_list
        self.oppTeamDifficultyScore = opp_team_difficulty_score
        self.gw = gw
