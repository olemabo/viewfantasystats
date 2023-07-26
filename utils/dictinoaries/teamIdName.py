from fixture_planner_eliteserien.models import EliteserienTeamInfo
from fixture_planner.models import PremierLeagueTeamInfo


def createTeamIdToTeamNameEliteserienDict():
    team_dict = {}
    for team in EliteserienTeamInfo.objects.all():
        team_dict[str(team.team_id)] = team.team_name   

    return team_dict


def createTeamIdToTeamNamePremierLeagueDict():
    team_dict = {}
    for team in PremierLeagueTeamInfo.objects.all():
        team_dict[str(team.team_id)] = team.team_name   

    return team_dict