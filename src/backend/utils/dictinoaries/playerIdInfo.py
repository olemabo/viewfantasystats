from player_statistics.db_models.eliteserien.player_statistics_model import EliteserienPlayerStatistic
from player_statistics.db_models.premier_league.player_statistics_model import PremierLeaguePlayers
from fixture_planner_eliteserien.models import EliteserienTeamInfo
from fixture_planner.models import PremierLeagueTeamInfo

def createPlayerIdToPlayerNameEliteserienDict():
    player_dict = {}
    players = EliteserienPlayerStatistic.objects.all()
    player: EliteserienPlayerStatistic
    for player in players:
        player_dict[str(player.player_id)] = [player.player_web_name, player.player_position_id, player.player_team_id, 
                                              player.minutes_list, player.opta_index_list, player.total_points_list, player.fixture_id_list]

    return player_dict


def createPlayerIdToPlayerNamePremierLeagueDict():
    player_dict = {}
    players = PremierLeaguePlayers.objects.all()
    player: PremierLeaguePlayers
    for player in players:
        player_dict[str(player.player_id)] = [player.player_web_name, player.player_position_id, player.player_team_id, 
                                              player.minutes_list, player.bps_list, player.total_points_list, player.fixture_id_list]

    return player_dict


def createTeamIdToTeamNameShortEliteserienDict():
    team_dict = {}
    teams = EliteserienTeamInfo.objects.all()
    teams: EliteserienTeamInfo
    for team in teams:
        team_dict[str(team.team_id)] = team.team_short_name

    return team_dict


def createTeamIdToTeamNameShortPremierLeagueDict():
    team_dict = {}
    teams = PremierLeagueTeamInfo.objects.all()
    teams: PremierLeagueTeamInfo
    for team in teams:
        team_dict[str(team.team_id)] = team.team_short_name

    return team_dict