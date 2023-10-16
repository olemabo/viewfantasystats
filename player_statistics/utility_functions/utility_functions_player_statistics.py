from player_statistics.db_models.eliteserien.player_statistics_model import EliteserienPlayerStatistic
from player_statistics.db_models.premier_league.player_statistics_model import PremierLeaguePlayers
from constants import total_number_of_gameweeks, total_number_of_gameweeks_in_eliteserien, esf
from models.statistics.models.PlayerStatisticsModel import PlayerStatisticsModel
from utils.utility_functions import convert_list_with_strings_to_floats
from models.statistics.models.TeamAndIdModel import TeamAndIdModel
from fixture_planner_eliteserien.models import EliteserienTeamInfo
from utils.dictionaries import dict_player_position_to_id
from fixture_planner.models import PremierLeagueTeamInfo
import numpy as np


def get_premier_league_player_statistics_from_db(keyword, order_by, asc_dec):
    """
        Extract data from PremierLeaguePlayers with different filters
    :param keyword: filter search (All, GoalKeeper, team id)
    :param order_by: field name from PremierLeaguePlayers (total_points_list)
    :param asc_dec: sort ascending og descending (- or nothing)
    :return:
    """
    order_by = asc_dec + order_by
    position_dict = dict_player_position_to_id
    team_dict = get_premier_league_teams_from_db()
    if keyword == "All":
        return PremierLeaguePlayers.objects.all().order_by(order_by)
    if keyword in position_dict:
        return PremierLeaguePlayers.objects.filter(player_position_id=position_dict[keyword]).order_by(order_by)
    if keyword in team_dict.keys():
        return PremierLeaguePlayers.objects.filter(player_team_id=team_dict[keyword]).order_by(order_by)


def get_premier_league_teams_from_db():
    """
        Extract all PL teams from PremierLeagueTeamInfo database
    :return: dict of PL teams (key: team name, value: team id)
    """
    pl_teams_dict = dict()
    fixture_list_db = PremierLeagueTeamInfo.objects.all()
    for team in fixture_list_db:
        pl_teams_dict[team.team_name] = team.team_id
    return pl_teams_dict


def list_premier_league_info_from_db(sort_index, last_x_gw):
    list_of_fpl_players_with_info = get_premier_league_player_statistics_from_db("All", sort_index, "-")
          
    player_info, max_gws = [], 0
    last_x_rounds = total_number_of_gameweeks if last_x_gw == 0 else int(last_x_gw)

    for fpl_player_i in list_of_fpl_players_with_info:
        fpl_player_i_has_played_how_many_rounds = len(fpl_player_i.round_list) - 1
        max_gws = max(fpl_player_i_has_played_how_many_rounds, max_gws)
        num_rounds = min(fpl_player_i_has_played_how_many_rounds, last_x_rounds)
        
        model = PlayerStatisticsModel(
            Name=fpl_player_i.player_web_name, 
            player_position_id=fpl_player_i.player_position_id,
            player_team_id=fpl_player_i.player_team_id,
            player_statistics_list=[]
        )

        if last_x_gw == 0:
            points = round(fpl_player_i.total_points_list[0], 2)
            bps = round(fpl_player_i.bps_list[0], 2)
            ict_index = round(float(fpl_player_i.ict_index_list[0]), 2)
            influence = round(float(fpl_player_i.influence_list[0]), 2)
            creativity = round(float(fpl_player_i.creativity_list[0]), 2)
            threat = round(float(fpl_player_i.threat_list[0]), 2)
            minutes = round(float(fpl_player_i.minutes_list[0]), 0)
            xG = 0 if fpl_player_i.expected_goals_list == None else round(float(fpl_player_i.expected_goals_list[0]), 2)
            xA = 0 if fpl_player_i.expected_assists_list == None else round(float(fpl_player_i.expected_assists_list[0]), 2)
            xGI = 0 if fpl_player_i.expected_goal_involvements_list == None else round(float(fpl_player_i.expected_goal_involvements_list[0]), 2)
            xGC = 0 if fpl_player_i.expected_goals_conceded_list == None else round(float(fpl_player_i.expected_goals_conceded_list[0]), 2)
            player_statistics_list = [points, minutes, xG, xA, xGI, bps, ict_index, influence, creativity, 
                    threat, xGC]

        else:
            points = round(np.mean(fpl_player_i.total_points_list[-num_rounds:]), 2)
            bps = round(np.mean(fpl_player_i.bps_list[-num_rounds:]), 2)
            ict_index = round(np.mean(convert_list_with_strings_to_floats(fpl_player_i.ict_index_list[-num_rounds:])), 2)
            influence = round(np.mean(convert_list_with_strings_to_floats(fpl_player_i.influence_list[-num_rounds:])), 2)
            creativity = round(np.mean(convert_list_with_strings_to_floats(fpl_player_i.creativity_list[-num_rounds:])), 2)
            threat = round(np.mean(convert_list_with_strings_to_floats(fpl_player_i.threat_list[-num_rounds:])), 2)
            xG = 0 if fpl_player_i.expected_goals_list == None else round(np.mean(convert_list_with_strings_to_floats(fpl_player_i.expected_goals_list[-num_rounds:])), 2)    
            xA = 0 if fpl_player_i.expected_assists_list == None else round(np.mean(convert_list_with_strings_to_floats(fpl_player_i.expected_assists_list[-num_rounds:])), 2)    
            xGI = 0 if fpl_player_i.expected_goal_involvements_list == None else round(np.mean(convert_list_with_strings_to_floats(fpl_player_i.expected_goal_involvements_list[-num_rounds:])), 2)    
            xGC = 0 if fpl_player_i.expected_goals_conceded_list == None else round(np.mean(convert_list_with_strings_to_floats(fpl_player_i.expected_goals_conceded_list[-num_rounds:])), 2)    
            minutes = 0 if fpl_player_i.minutes_list == None else round(np.mean(convert_list_with_strings_to_floats(fpl_player_i.minutes_list[-num_rounds:])), 0)    
            
            player_statistics_list = [points, minutes, xG, xA, xGI, bps, ict_index, influence, creativity, 
                threat, xGC]

        model.player_statistics_list = player_statistics_list
        player_info.append(model)

    player_info = sorted(player_info, key=lambda x: x.player_statistics_list[0], reverse=True)

    return player_info


def get_sort_index_and_categories_premier_league(sort_on):
    sort_index = dict_sort_on_short_name_to_sort_on_name_premier_league[sort_on]
    categories = dict_sort_on_short_name_to_sort_on_name_premier_league.keys()
    list_of_categories = list(map(lambda x: x.replace('Total points', 'Points'), [i for i in categories]))

    return sort_index, list_of_categories


dict_sort_on_short_name_to_sort_on_name_premier_league = {
    "Total points": "total_points_list", 
    "Mins": "Mins", 
    "xG": "expected_goals_list", "xA": "expected_assists_list", "xGI": "expected_goal_involvements_list", 
    "Bps": "bonus_list", 
    "ICT": "ict_index_list", "I": "influence_list", "C": "creativity_list", "T": "threat_list", 
    "xGC": "expected_goals_conceded_list"
}


def get_sort_index_and_categories_eliteserien(sort_on):
    sort_index = dict_sort_on_short_name_to_sort_on_name_eliteserien[sort_on]
    categories = dict_sort_on_short_name_to_sort_on_name_eliteserien.keys()
    list_of_categories = list(map(lambda x: x.replace('Total points', 'Points'), [i for i in categories]))

    return sort_index, list_of_categories


dict_sort_on_short_name_to_sort_on_name_eliteserien = {
    "Total points": "total_points_list", 
    "Mins": "Mins", 
    "Goals": "goals_scored_list", "Assists": "assists_list", 
    "Bps": "bonus_list", "Opta": "opta_index_list",
    "Yellow Cards": "yellow_cards_list", "Red Cards": "red_cards_list"
}

def get_eliteserien_player_statistics_from_db(keyword, order_by, asc_dec):
    """
        Extract data from PremierLeaguePlayers with different filters
    :param keyword: filter search (All, GoalKeeper, team id)
    :param order_by: field name from PremierLeaguePlayers (total_points_list)
    :param asc_dec: sort ascending og descending (- or nothing)
    :return:
    """
    order_by = asc_dec + order_by
    position_dict = dict_player_position_to_id
    team_dict = get_eliteserien_teams_from_db()
    if keyword == "All":
        return EliteserienPlayerStatistic.objects.all().order_by(order_by)
    if keyword in position_dict:
        return EliteserienPlayerStatistic.objects.filter(player_position_id=position_dict[keyword]).order_by(order_by)
    if keyword in team_dict.keys():
        return EliteserienPlayerStatistic.objects.filter(player_team_id=team_dict[keyword]).order_by(order_by)


def get_eliteserien_teams_from_db():
    """
        Extract all PL teams from PremierLeagueTeamInfo database
    :return: dict of PL teams (key: team name, value: team id)
    """
    pl_teams_dict = dict()
    fixture_list_db = EliteserienTeamInfo.objects.all()
    for team in fixture_list_db:
        pl_teams_dict[team.team_name] = team.team_id
    return pl_teams_dict


def get_team_names_and_ids_to_list(league_name):
    team_names_and_ids = EliteserienTeamInfo.objects.all() if league_name == esf else PremierLeagueTeamInfo.objects.all()
            
    return [TeamAndIdModel(team.team_name, team.team_id).toJson() for team in team_names_and_ids]


def list_eliteserien_info_from_db(sort_index, last_x_gw):
    list_of_esf_players_with_info = get_eliteserien_player_statistics_from_db("All", sort_index, "-")
          
    player_info, max_gws = [], 0
    last_x_rounds = total_number_of_gameweeks_in_eliteserien if last_x_gw == 0 else int(last_x_gw)
    
    esf_player_i: EliteserienPlayerStatistic
    for esf_player_i in list_of_esf_players_with_info:
        esf_player_i_has_played_how_many_rounds = len(esf_player_i.round_list) - 1
        max_gws = max(esf_player_i_has_played_how_many_rounds, max_gws)
        num_rounds = min(esf_player_i_has_played_how_many_rounds, last_x_rounds)
        
        model = PlayerStatisticsModel(
            Name=esf_player_i.player_web_name, 
            player_position_id=esf_player_i.player_position_id,
            player_team_id=esf_player_i.player_team_id,
            player_statistics_list=[]
        )

        if last_x_gw == 0:
            points = round(esf_player_i.total_points_list[0], 2)
            bonus = round(esf_player_i.bonus_list[0], 2)
            opta_index = round(float(esf_player_i.opta_index_list[0]), 2) if len(esf_player_i.opta_index_list) > 0 else 0
            goals = round(float(esf_player_i.goals_scored_list[0]), 2)
            assists = round(float(esf_player_i.assists_list[0]), 2)
            minutes = round(float(esf_player_i.minutes_list[0]), 0)
            yellow_cards = round(float(esf_player_i.yellow_cards_list[0]), 0)
            red_cards = round(float(esf_player_i.red_cards_list[0]), 0)
            player_statistics_list = [points, minutes, goals, assists, bonus, opta_index, yellow_cards, red_cards]

        else:
            points = round(np.mean(esf_player_i.total_points_list[-num_rounds:]), 2)
            bonus = round(np.mean(esf_player_i.bonus_list[-num_rounds:]), 2)
            opta_index = round(np.mean(convert_list_with_strings_to_floats(esf_player_i.opta_index_list[-num_rounds:])), 2) if len(esf_player_i.opta_index_list) > 0 else 0
            goals = 0 if esf_player_i.goals_scored_list == None else round(np.mean(convert_list_with_strings_to_floats(esf_player_i.goals_scored_list[-num_rounds:])), 0)    
            assists = 0 if esf_player_i.assists_list == None else round(np.mean(convert_list_with_strings_to_floats(esf_player_i.assists_list[-num_rounds:])), 0)    
            minutes = 0 if esf_player_i.minutes_list == None else round(np.mean(convert_list_with_strings_to_floats(esf_player_i.minutes_list[-num_rounds:])), 0)    
            yellow_cards = 0 if esf_player_i.yellow_cards_list == None else round(np.mean(convert_list_with_strings_to_floats(esf_player_i.yellow_cards_list[-num_rounds:])), 0)    
            red_cards = 0 if esf_player_i.red_cards_list == None else round(np.mean(convert_list_with_strings_to_floats(esf_player_i.red_cards_list[-num_rounds:])), 0)    
            
            player_statistics_list = [points, minutes, goals, assists, bonus, opta_index, yellow_cards, red_cards]

        model.player_statistics_list = player_statistics_list
        player_info.append(model)

    player_info = sorted(player_info, key=lambda x: x.player_statistics_list[0], reverse=True)

    return player_info