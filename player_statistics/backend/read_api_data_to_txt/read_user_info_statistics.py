from constants import current_season_name_premier_league, current_season_name_eliteserien, path_to_store_local_data
from constants import user_stats_special_delimiter, user_stats_special_delimiter
from constants import user_stats_folder_name, eliteserien_folder_name
from constants import premier_league_api_url, eliteserien_api_url

from utils.dataFetch.DataFetch import DataFetch
import numpy as np
import time
import os


def read_user_info_statistics_eliteserien(league_name=eliteserien_folder_name, max_time=60 * 60 * 24):
    api_url = eliteserien_api_url if league_name == eliteserien_folder_name else premier_league_api_url
    DFObject = DataFetch(api_url)
    
    # create a folder to store data in txt files, and return data if allready exists
    start_id, path_to_file = check_if_txt_file_exist(league_name)
    print("\n\nRead data from API | User statistics\n")
    print("Start at id: ", start_id, "\n")
    
    # get number of fantasy players
    number_of_fantasy_players = DFObject.get_current_fpl_info()['total_players']
    
    print("Number of fantasy managers: ", number_of_fantasy_players, "\n")
    
    if start_id > number_of_fantasy_players:
        print("All ", number_of_fantasy_players, " managers allready stored :)")
        return 0

    total_time = 0
    for id in range(start_id, number_of_fantasy_players + 1):
        start_time = time.time()
        content = read_single_user_info(id, DFObject)
        wrtie_to_file(content, path_to_file)
        end_time = time.time()
        total_time += (end_time - start_time) 
        avg_time = total_time / (id - start_id + 1)
        sec_left = avg_time * (number_of_fantasy_players - id)
        if (sec_left < 60):
            print(id, " / ", number_of_fantasy_players, " | ", round(total_time, 2), "(s) | ", round(id / number_of_fantasy_players * 100, 2) , "% | " , round(sec_left, 2), " secs left")
        if (sec_left < 60 * 60):
            print(id, " / ", number_of_fantasy_players, " | ", round(total_time, 2), "(s) | ", round(id / number_of_fantasy_players * 100, 2) , "% | " , round(sec_left / 60, 2), " mins left")
        else:
            print(id, " / ", number_of_fantasy_players, " | ", round(total_time, 2), "(s) | ", round(id / number_of_fantasy_players * 100, 2) , "% | " , round(sec_left / 3600, 2), " hours left")

        if (total_time  > max_time):
            return -1

    return 0



def check_if_txt_file_exist(league_name):
    league_path = path_to_store_local_data + "/" + league_name + "/"
    if not os.path.isdir(league_path):
        os.mkdir(league_path)

    season_name = current_season_name_eliteserien if league_name == eliteserien_folder_name else current_season_name_premier_league
    season_path = league_path + "/" + season_name + "/"
    if not os.path.isdir(season_path):
        os.mkdir(season_path)

    user_stat_path = season_path + "/" + user_stats_folder_name
    if not os.path.isdir(user_stat_path):
        os.mkdir(user_stat_path)

    txt_file_path = user_stat_path + "/" + user_stats_folder_name + ".txt"
    if not os.path.exists(txt_file_path):
        f = open(txt_file_path, "w", encoding="utf-8")
        f.write("id, joined_time, started_event, favourite_team, name,  player_first_name, player_last_name, player_region_id, player_region_name, player_region_iso_code_long, ranking \n")
        f.close()

    start_id = 0
    data_allready_stored = np.loadtxt(txt_file_path, dtype="str", delimiter="\n", skiprows=1, encoding="utf-8")
    for data in data_allready_stored:
        start_id = max(start_id, int(data.split(user_stats_special_delimiter)[0]))
    
    return start_id + 1, txt_file_path



def read_single_user_info(id, DFObject: DataFetch):
    time.sleep(1.2)
    
    current_fpl_user = DFObject.get_current_fpl_player(id)
    current_fpl_user_history = DFObject.get_current_member(id)['past']
    
    history_data_str = "["
    for idx, history_data in enumerate(current_fpl_user_history):
        history_data_str += "[" + str(history_data['season_name']) + "," + str(history_data['total_points']) + "," + str(history_data['rank']) + "]"
        if (idx != len(current_fpl_user_history) - 1):
            history_data_str += ","
    history_data_str += "]"
    
    return str(current_fpl_user['id']) + user_stats_special_delimiter + str(current_fpl_user['joined_time']) + user_stats_special_delimiter \
        + str(current_fpl_user['started_event']) + user_stats_special_delimiter + str(current_fpl_user['favourite_team']) + user_stats_special_delimiter \
        + str(current_fpl_user['name']) + user_stats_special_delimiter + str(current_fpl_user['player_first_name']) + user_stats_special_delimiter \
        + str(current_fpl_user['player_last_name']) + user_stats_special_delimiter + str(current_fpl_user['player_region_id']) + user_stats_special_delimiter  \
        + str(current_fpl_user['player_region_name']) + user_stats_special_delimiter + str(current_fpl_user['player_region_iso_code_long']) + user_stats_special_delimiter \
        + history_data_str


def wrtie_to_file(content, path_to_file):
    f2 = open(path_to_file, "a", encoding="utf-8")
    f2.write(content + "\n")
    f2.close()
