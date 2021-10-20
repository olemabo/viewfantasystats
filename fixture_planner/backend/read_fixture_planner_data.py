from utils.dictionaries import dict_month_number_to_month_name_short
from utils.utility_functions import get_static_json_data
from utils.models.DataFetch import DataFetch
import json


def get_static_and_fixture_data(api_local="api"):
    if api_local == "local":
        with open('stored_data/static_json/static.json', encoding='UTF-8') as json_static:
            static_info = json.load(json_static)
        with open('stored_data/fixture_json/fixture.json', encoding='UTF-8') as json_fixture:
            fixture_info = json.load(json_fixture)
        return static_info, fixture_info

    if api_local == "api":
        static_info = DataFetch().get_current_fpl_info()
        fixture_info = DataFetch().get_current_fixtures()
        return static_info, fixture_info


def return_kick_off_time():
    static = get_static_json_data("api")
    number_of_gws = len(static['events'])
    kick_off_time_info = []
    for gw in range(number_of_gws):
        gw_info = static['events'][gw]
        kick_off_time = gw_info['deadline_time']
        month = int(kick_off_time.split("-")[1])
        day = str(kick_off_time.split("T")[0].split("-")[2])
        kick_off_time_short = day + " " + dict_month_number_to_month_name_short[str(month)]
        kick_off_time_info.append([gw + 1, kick_off_time, kick_off_time_short])

    return kick_off_time_info


