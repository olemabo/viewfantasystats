
from utils.models.DataFetch import DataFetch
from constants import premier_league_api_url, eliteserien_api_url, eliteserien_folder_name, premier_league_folder_name, name_of_extra_info_file, name_of_nationality_file, path_to_store_local_data, web_global_league, all_top_x_players, time_to_sleep_for_each_iteration, name_of_ownership_file
import time

def read_user_info_statistics_eliteserien(league_name=eliteserien_folder_name):
    api_url = eliteserien_api_url if league_name == eliteserien_folder_name else premier_league_api_url
    DFObject = DataFetch(api_url)
    
    # get number of fantasy players
    number_of_fantasy_players = DFObject.get_current_fpl_info()['total_players']
    for id in range(1, number_of_fantasy_players + 1):
        time.sleep(0.4)
        print(id)
    
    return 0

read_user_info_statistics_eliteserien()