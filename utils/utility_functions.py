from constants import total_number_of_gameweeks, premier_league_api_url
from fixture_planner.models import PremierLeagueTeamInfo, KickOffTime
from utils.models.DataFetch import DataFetch
from datetime import date
import pandas as pd
import json


def convert_list_with_strings_to_floats(list_of_strings):
    """
    Convert list of strings to list of floats
    :param list_of_strings: List of numbers of strings (["1", "12"])
    :return: list of floats ([1.0, 12.0])
    """
    return [float(str_i) for str_i in list_of_strings]


def get_list_of_all_pl_team_names():
    """
    Extract all pl team names from PremierLeagueTeamInfo db
    :return: a list of all pl team names
    """
    fixture_list_db = PremierLeagueTeamInfo.objects.all()
    return [team.team_name for team in fixture_list_db]


def get_static_json_data(use_api_or_local, api_url=premier_league_api_url):
    """
        Use either local extract json data or fpl api to load data from https://fantasy.premierleague.com/api/bootstrap-static/
    """
    if use_api_or_local == "api":
        return DataFetch(api_url).get_current_fpl_info()
    else:
        with open('stored_data/static_json/static.json', encoding='utf-8') as json_static:
            return json.load(json_static)


def get_current_gw():
    """
    Find out which is the current gw. Extract kick off times from KickOffTime and compares with current date
    :return: current gameweek (int: 1)
    """
    # find current gw
    today_date = date.today()
    kick_off_time_db = KickOffTime.objects.filter(gameweek__range=(0, 38))
    for i in range(len(kick_off_time_db)):
        current_gw = i + 1
        dates = kick_off_time_db[i].kickoff_time.split("T")[0].split("-")
        gw_i_date = date(int(dates[0]), int(dates[1]), int(dates[2]))
        if gw_i_date > today_date:
            return current_gw
    return 1


def create_dict_with_team_ids_to_team_name_and_team_name_to_ids_from_db(fixture_list_db):
    team_names = [team_model.team_name for team_model in fixture_list_db]
    team_ids = [team_model.team_id for team_model in fixture_list_db]
    return dict(zip(team_ids, team_names)), dict(zip(team_names, team_ids))


def create_list_with_team_ids_from_list_with_team_names(fixture_list_db, team_names_list):
    team_names = [team_model.team_name for team_model in fixture_list_db]
    team_ids = [team_model.team_id for team_model in fixture_list_db]
    team_name_to_team_ids_dict = dict(zip(team_names, team_ids))
    team_id_list = []
    for team_name in team_names_list:
        team_id_list.append(team_name_to_team_ids_dict[team_name])
    return team_id_list


def return_fixture_names_shortnames(fixture_list_db):
    team_names = [team_model.team_name for team_model in fixture_list_db]
    team_short_names = [team_model.team_short_name for team_model in fixture_list_db]
    team_ids = [team_model.team_id for team_model in fixture_list_db]

    columns = [str(i) for i in range(0, total_number_of_gameweeks + 1)]
    columns[0] = 'Team'

    data = []
    for team_i_info in fixture_list_db:
        temp_data = [team_i_info.team_name]
        for gw_i, team_i_name_short, team_i_h_a, team_i_difficulty in zip(team_i_info.gw, team_i_info.oppTeamNameList, team_i_info.oppTeamHomeAwayList, team_i_info.oppTeamDifficultyScore):

            temp_data.append([team_i_name_short, team_i_h_a, team_i_difficulty, int(gw_i)])
        data.append(temp_data)

    return pd.DataFrame(data=data, columns=columns), pd.DataFrame(team_names), pd.DataFrame(team_short_names), pd.DataFrame(team_ids)






# from fixture_planner.models import PremierLeagueTeamInfo, KickOffTime
# from utils.models.DataFetch import DataFetch
# from datetime import date
# import json
# from constants import total_number_of_gameweeks
# import pandas as pd





# def convert_list_with_strings_to_floats(list_of_strings):
#     """
#     Convert list of strings to list of floats
#     :param list_of_strings: List of numbers of strings (["1", "12"])
#     :return: list of floats ([1.0, 12.0])
#     """
#     return [float(str_i) for str_i in list_of_strings]


# def get_list_of_all_pl_team_names():
#     """
#     Extract all pl team names from PremierLeagueTeamInfo db
#     :return: a list of all pl team names
#     """
#     fixture_list_db = PremierLeagueTeamInfo.objects.all()
#     return [team.team_name for team in fixture_list_db]


# def get_static_json_data(use_api_or_local):
#     """
#         Use either local extract json data or fpl api to load data from https://fantasy.premierleague.com/api/bootstrap-static/
#     """
#     if use_api_or_local == "api":
#         return DataFetch().get_current_fpl_info()
#     else:
#         with open('stored_data/static_json/static.json', encoding='utf-8') as json_static:
#             return json.load(json_static)


# def get_current_gw():
#     """
#     Find out which is the current gw. Extract kick off times from KickOffTime and compares with current date
#     :return: current gameweek (int: 1)
#     """
#     # find current gw
#     today_date = date.today()
#     kick_off_time_db = KickOffTime.objects.filter(gameweek__range=(0, 38))
#     for i in range(len(kick_off_time_db)):
#         current_gw = i + 1
#         dates = kick_off_time_db[i].kickoff_time.split("T")[0].split("-")
#         gw_i_date = date(int(dates[0]), int(dates[1]), int(dates[2]))
#         if gw_i_date > today_date:
#             return current_gw
#     return 1


# def return_fixture_names_shortnames(fixture_list_db):
#     team_names = [team_model.team_name for team_model in fixture_list_db]
#     team_short_names = [team_model.team_short_name for team_model in fixture_list_db]
#     team_ids = [team_model.team_id for team_model in fixture_list_db]

#     columns = [str(i) for i in range(0, total_number_of_gameweeks + 1)]
#     columns[0] = 'Team'

#     data = []
#     for team_i_info in fixture_list_db:
#         temp_data = [team_i_info.team_name]
#         for gw_i, team_i_name_short, team_i_h_a, team_i_difficulty in zip(team_i_info.gw, team_i_info.oppTeamNameList, team_i_info.oppTeamHomeAwayList, team_i_info.oppTeamDifficultyScore):

#             temp_data.append([team_i_name_short, team_i_h_a, team_i_difficulty, int(gw_i)])
#         data.append(temp_data)

#     return pd.DataFrame(data=data, columns=columns), pd.DataFrame(team_names), pd.DataFrame(team_short_names), pd.DataFrame(team_ids)