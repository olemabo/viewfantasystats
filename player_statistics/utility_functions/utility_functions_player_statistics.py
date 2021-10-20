from player_statistics.db_models.player_statistics_model import FPLPlayersModel
from fixture_planner.models import AddPlTeamsToDB


def get_player_statistics_from_db(keyword, order_by, asc_dec):
    """
        Extract data from FPLPlayersModel with different filters
    :param keyword: filter search (All, GoalKeeper, team id)
    :param order_by: field name from FPLPlayersModel (total_points_list)
    :param asc_dec: sort ascending og descending (- or nothing)
    :return:
    """
    order_by = asc_dec + order_by
    position_dict = get_dict_player_position_to_id()
    team_dict = get_pl_teams_from_db()
    if keyword == "All":
        return FPLPlayersModel.objects.all().order_by(order_by)
    if keyword in position_dict:
        return FPLPlayersModel.objects.filter(player_position_id=position_dict[keyword]).order_by(order_by)
    if keyword in team_dict.keys():
        return FPLPlayersModel.objects.filter(player_team_id=team_dict[keyword]).order_by(order_by)


def get_pl_teams_from_db():
    """
        Extract all PL teams from AddPlTeamsToDB database
    :return: dict of PL teams (key: team name, value: team id)
    """
    pl_teams_dict = dict()
    fixture_list_db = AddPlTeamsToDB.objects.all()
    for team in fixture_list_db:
        pl_teams_dict[team.team_name] = team.team_id
    return pl_teams_dict


def get_dict_player_position_to_id():
    return {"Goalkeepers": 1, "Defenders": 2, "Midfielders": 3, "Forwards": 4}


def get_dict_sort_on_short_name_to_sort_on_name():
    return {"Name": "player_name",
            "Total points": "total_points_list",
            "Bps": "bonus_list",
            "ICT": "ict_index_list",
            "I": "influence_list",
            "C": "creativity_list",
            "T": "threat_list"}


def get_dict_sort_on_short_name_to_number():
    return {"Name": 0,
            "Total points": 1,
            "Bps": 2,
            "ICT": 3,
            "I": 4,
            "C": 5,
            "T": 6}

