from player_statistics.db_models.premier_league.player_statistics_model import PremierLeaguePlayers
from fixture_planner.models import PremierLeagueTeamInfo
from utils.dictionaries import dict_player_position_to_id

def get_player_statistics_from_db(keyword, order_by, asc_dec):
    """
        Extract data from PremierLeaguePlayers with different filters
    :param keyword: filter search (All, GoalKeeper, team id)
    :param order_by: field name from PremierLeaguePlayers (total_points_list)
    :param asc_dec: sort ascending og descending (- or nothing)
    :return:
    """
    order_by = asc_dec + order_by
    position_dict = dict_player_position_to_id
    team_dict = get_pl_teams_from_db()
    if keyword == "All":
        return PremierLeaguePlayers.objects.all().order_by(order_by)
    if keyword in position_dict:
        return PremierLeaguePlayers.objects.filter(player_position_id=position_dict[keyword]).order_by(order_by)
    if keyword in team_dict.keys():
        return PremierLeaguePlayers.objects.filter(player_team_id=team_dict[keyword]).order_by(order_by)


def get_pl_teams_from_db():
    """
        Extract all PL teams from PremierLeagueTeamInfo database
    :return: dict of PL teams (key: team name, value: team id)
    """
    pl_teams_dict = dict()
    fixture_list_db = PremierLeagueTeamInfo.objects.all()
    for team in fixture_list_db:
        pl_teams_dict[team.team_name] = team.team_id
    return pl_teams_dict

