from fixture_planner.models import AddPlTeamsToDB, KickOffTime
from utils.models.DataFetch import DataFetch
from datetime import date
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
    Extract all pl team names from AddPlTeamsToDB db
    :return: a list of all pl team names
    """
    fixture_list_db = AddPlTeamsToDB.objects.all()
    return [team.team_name for team in fixture_list_db]


def get_static_json_data(use_api_or_local):
    """
        Use either local extract json data or fpl api to load data from https://fantasy.premierleague.com/api/bootstrap-static/
    """
    if use_api_or_local == "api":
        return DataFetch().get_current_fpl_info()
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

