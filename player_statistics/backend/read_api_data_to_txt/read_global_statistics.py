from constants import global_stats_folder_name, eliteserien_wc_due_date, premier_league_wc_due_date, total_chip_usage_txt_file_name, country_population_txt_file_name, global_stats_folder_name, premier_league_api_url, eliteserien_api_url, web_global_league_eliteserien, eliteserien_folder_name, premier_league_folder_name, name_of_extra_info_file, path_to_store_local_data, web_global_league, all_top_x_players, time_to_sleep_for_each_iteration, name_of_ownership_file
from utils.models.DataFetch import DataFetch
from tqdm import tqdm
import pandas as pd
import numpy as np
import requests
import time
import os
import datetime
import json

def data_fetch(num, league_type):
    """
    data_fetch will collect 50 teams from page "num" from global rank
    """
    time.sleep(0.4)
    
    if league_type == premier_league_folder_name:
        r = requests.get(web_global_league.replace('X', str(num)))
    elif league_type == eliteserien_folder_name:
        r = requests.get(web_global_league_eliteserien.replace('X', str(num)))
    else:
        return None
    
    json_response = r.json()
    return json_response


def get_current_gw(DFObject: DataFetch):
    events = DFObject.get_current_fpl_info()['events']
    for event in events:
        if event['is_current']:
            return int(event['id'])
    return 1

def find_team_ids_from_top_x_players(top_x_players, league_type):
    """
    find_team_ids_from_top_x_players will find all unique user team ids from 'top_x_players' and return them as a list of numbers [1, 134, 4335, ... ]. 
    
    :param top_x_players: number - number of top x fantasy players to check - 
    :return: Array - list of numbers - [1, 134, 4335, ... ]
    """
    id_s = []
    idx = 0
    _percentage = 10
    print("\nCollect all ids from fpl player among top ", top_x_players, " players from the global rank. \n")
    while True:
        data = data_fetch(idx + 1, league_type)
        data_pd = pd.DataFrame(data['standings'])
        for j in range(len(data_pd)):
            id_s.append(data_pd['results'][j]['entry'])
            if len(id_s) == top_x_players:
                print("\n Collected all ids from all fpl players. Total ids: ", str(len(id_s)))
                return id_s
        idx += 1
        percentage = idx / (top_x_players / 50) * 100
        if percentage > _percentage:
            print(percentage, "%")
            _percentage += 10


def create_dict(players, things_to_store=12):
    """
    Create dict with keys equal to the player ids, which stores a 6 dimensional array with global ownership stats.
    :param players:
    :param things_to_store: store 10 different ownership stats
    :return: array [Name, starting and not captain, starting and captain, starting and vice captain, non owners (not onbench or starting, benched, position_id, team_id, first_name, second_name]
    """
    player_dict = {}
    for player_id, player_web_name, element_type, team_id, first_name, second_name, total_percentage in \
            zip(players[:, 0], players[:, 5], players[:, 1], players[:, 2], players[:, 3], players[:, 4], players[:, 6]):
        player_dict.update({int(player_id): np.zeros(things_to_store, dtype=object)})
        player_dict[int(player_id)][0] = player_web_name
        player_dict[int(player_id)][4] = 0
        player_dict[int(player_id)][6] = element_type
        player_dict[int(player_id)][7] = team_id
        player_dict[int(player_id)][8] = first_name
        player_dict[int(player_id)][9] = second_name
        player_dict[int(player_id)][10] = total_percentage
    return player_dict


def get_player_name_ids(dataFetchObject):
    static_info = dataFetchObject.get_current_fpl_info()['elements']
    ID_POSITIONID_TEAMID_FIRSTNAME_SECONDNAME_WEBNAME_GLOBALPERCENTAGE = []
    for info in static_info:
        ID_POSITIONID_TEAMID_FIRSTNAME_SECONDNAME_WEBNAME_GLOBALPERCENTAGE.append([info['id'], info['element_type'], info['team'], info['first_name'], info['second_name'], info['web_name'], info['selected_by_percent']])
    return np.array(ID_POSITIONID_TEAMID_FIRSTNAME_SECONDNAME_WEBNAME_GLOBALPERCENTAGE)


def has_list_duplicates(a_list):
    a_set = set(a_list)
    contains_duplicates = len(a_list) != len(a_set)
    if contains_duplicates:
        return True
    return False


def save_all_fpl_teams_stats(league_name=premier_league_folder_name):
    """
    Save ownership stats from "top_x_players" fpl teams based on the fpl players they have in their teams
    :param top_x_players: top x fpl teams based on global ranking (10000)
    :return:

    TODO: Add number of years played fantasy (see history_stats.py)
    Find a way to decrease computational time. ATM 10000 teams yield approx 45 minutes.
    Create a plotting function which takes complete_ownership.txt as input.
    Can plot stats for one single player. Can plot top 10 captains.

    """

    x = input("You will now extract data from the FPL api. It will be for top " +  str(max(all_top_x_players)) + " fpl managers. " +
            "Time to sleep between each api call is: " + str(time_to_sleep_for_each_iteration) +
                  " and should be more than 0.2 at least. Will you proceed? (y/n) ")

    if str(x) == "n":
        return 0

    start_time = time.time()
    
    # collect fpl api class
    api_url = eliteserien_api_url if league_name == eliteserien_folder_name else premier_league_api_url
    DFObject = DataFetch(api_url)
    current_gameweek = get_current_gw(DFObject)
    
    # create new directories if not already done
    if not os.path.isdir(path_to_store_local_data + "/" + league_name):
        os.mkdir(path_to_store_local_data + "/" + league_name)
    
    if not os.path.isdir(path_to_store_local_data + "/" + league_name + "/" + global_stats_folder_name + "/"):
        os.mkdir(path_to_store_local_data + "/" + league_name + "/" + global_stats_folder_name + "/")

    # create new directories if not already done
    general_path = path_to_store_local_data + "/" + league_name + "/" + global_stats_folder_name + "/" + str(current_gameweek)
    if not os.path.isdir(general_path):
        os.mkdir(general_path)

    # find max top_x players to check
    top_x_players = max(all_top_x_players)


    # get soccer player name and ids
    ids = get_player_name_ids(DFObject)

    # create dict where each key is the soccer player id
    ids_dict = create_dict(ids)

    
    # check if we allready have the ids downlaoded in ids.txt file
    id_s = []
    path_ids_txt_file = general_path + "/ids.txt"
    if (os.path.exists(path_ids_txt_file)):
        ids_allready_stored = np.loadtxt(path_ids_txt_file, encoding="utf-8", delimiter="\n", dtype="int")
        if (len(ids_allready_stored) == top_x_players):
            print("Will use ids from ids.txt file") 
            id_s = ids_allready_stored
    
    # find the team ids from the top x fpl players on global rank
    if (len(id_s) != top_x_players):
        id_s = find_team_ids_from_top_x_players(top_x_players, league_name, )
        f_ids = open(path_ids_txt_file, "w", encoding="utf-8")
        for id in id_s:
            f_ids.write(str(id) + "\n")
        f_ids.close()


    # should not return duplicate ids and should be equal top 'top_x_players'
    if has_list_duplicates(id_s) or len(id_s) != top_x_players:
        return 0
    
    print("\nAll ids successfully extracted for gw ", str(current_gameweek), "\n")

    # [free hit, bench boost, triple captain, wildcard, no chips]
    fpl_player_chip_info = [0, 0, 0, 0, 0]
    
    # [ team_value, event_transfer, event_transfer_cost ]
    event_fpl_team_info = np.zeros((top_x_players, 5))

    dict_chip_to_index_premier_league = {"freehit": 0, "bboost": 1, "3xc": 2, "wildcard": 3, None: 4}
    dict_chip_to_index_eliteserien = {"rich": 0, "frush": 1, "2capt": 2, "wildcard": 3, None: 4}
    dict_chip_to_index = dict_chip_to_index_eliteserien if league_name == eliteserien_folder_name else dict_chip_to_index_premier_league

    # data for total chip usage
    total_chip_usage_eliteserien_dict = {"wildcard": [0, 0], "rich": 0, "frush": 0, "2capt": 0}
    total_chip_usage_premier_league_dict = {"wildcard": [0, 0], "freehit": 0, "3xc": 0, "bboost": 0}
    dict_total_chip_usage_to_index = total_chip_usage_eliteserien_dict if league_name == eliteserien_folder_name else total_chip_usage_premier_league_dict
    wildcard_date = eliteserien_wc_due_date if league_name == eliteserien_folder_name else premier_league_wc_due_date
    # data for nationality data
    regions_dict = {}

    for player_i in tqdm(range(len(id_s))):
        # sleep som seconds to not get DDOS
        time.sleep(time_to_sleep_for_each_iteration)
        user_id = id_s[player_i]
        
        ### extract ownership info ###
        # get info for player_i
        team_info = DFObject.get_current_ind_team(user_id, current_gameweek)

        # chip info
        chip_used_this_round = team_info["active_chip"]
        fpl_player_chip_info[dict_chip_to_index[chip_used_this_round]] += 1

        # team info
        event_fpl_team_info[player_i, 0] = int(team_info["entry_history"]["value"])
        event_fpl_team_info[player_i, 1] = int(team_info["entry_history"]["event_transfers"])
        event_fpl_team_info[player_i, 2] = int(team_info["entry_history"]["event_transfers_cost"])
        event_fpl_team_info[player_i, 3] = int(team_info["entry_history"]["total_points"])
        event_fpl_team_info[player_i, 4] = int(team_info["entry_history"]["bank"])

        # extract soccer player info
        players_with_all_info = pd.DataFrame(team_info['picks'])
        for index, player_row in players_with_all_info.iterrows():
            player_id = player_row["element"]
            if player_row['multiplier'] == 0:
                ids_dict[player_id][5] = int(ids_dict[player_id][5]) + 1
            if player_row['multiplier'] == 1:
                ids_dict[player_id][1] = int(ids_dict[player_id][1]) + 1
            if player_row['multiplier'] == 2:
                ids_dict[player_id][2] = int(ids_dict[player_id][2]) + 1
            if player_row['is_vice_captain']:
                ids_dict[player_id][3] = int(ids_dict[player_id][3]) + 1
            if player_row['multiplier'] == 3:
                ids_dict[player_id][11] = int(ids_dict[player_id][11]) + 1
            ids_dict[player_id][4] = int(ids_dict[player_id][4]) + 1

        # extract nationality info 
        nationality = DFObject.get_current_fpl_player(user_id)
        region_name = nationality['player_region_name']
        region_iso_name = nationality['player_region_iso_code_long']
        if region_name not in regions_dict.keys():
            regions_dict[region_name] = [1, region_iso_name]
        else:
            regions_dict[region_name][0] += 1

        # extract total chip usage info 
        wildcard_deadline = get_tz_notation_to_seconds(wildcard_date)
        
        chip_usage = DFObject.get_current_member(user_id)["chips"]
        for chips_used in chip_usage:
            chip = chips_used["name"]
            if chip != "wildcard":
                dict_total_chip_usage_to_index[chip] += 1
            else:
                wildcard_time = chips_used["time"].split(".")[0]
                wildcard_time_used = get_tz_notation_to_seconds(wildcard_time)
                if wildcard_time_used < wildcard_deadline:
                    dict_total_chip_usage_to_index[chip][0] += 1
                else:
                    dict_total_chip_usage_to_index[chip][1] += 1


        # store data when it reach player limits found in all_top_x_players (1, 10, 100, 1000 ...)
        if (player_i + 1) in all_top_x_players:
            print("Store data for top: ", player_i + 1)
            top_x_players_i = player_i + 1
            general_folder_path = path_to_store_local_data + "/" + league_name + "/" + global_stats_folder_name + "/" + str(current_gameweek) + "/top_" + str(top_x_players_i)

            if not os.path.isdir(general_folder_path):
                os.mkdir(general_folder_path)

            # write data to complete ownership txt file
            store_file = general_folder_path + "/" + name_of_ownership_file
            f = open(store_file, "w", encoding="utf-8")
            f.write("player_id, "
                    "player_team_id, "
                    "player_position_id, "
                    "player_name, "
                    "starting and not captain, "
                    "starting and captain, "
                    "starting and triple captain,"
                    "starting and vice captain, "
                    "owners, "
                    "benched,"
                    "total_percentage \n")

            for id in ids[:, 0]:
                f.write(
                    str(int(id)) + "," + str(ids_dict[int(id)][7]) + "," + str(ids_dict[int(id)][6]) + "," +
                    str(ids_dict[int(id)][0]) + "," + str(ids_dict[int(id)][1]) + "," + str(ids_dict[int(id)][2]) + "," + 
                    str(ids_dict[int(id)][11]) + "," + str(ids_dict[int(id)][3]) + "," + str(ids_dict[int(id)][4]) + "," + 
                    str(ids_dict[int(id)][5]) + "," + str(ids_dict[int(id)][10]) + "\n")
            f.close()

            # write data to chips and user info txt file
            store_extra_info = general_folder_path + "/" + name_of_extra_info_file

            f2 = open(store_extra_info, "w", encoding="utf-8")
            first_line = "Rich Uncle, Forward Rush, 2 Captains, Wildcard, None\n" if league_name == eliteserien_folder_name else "Freehit, Bench Boost, Triple Captain, Wildcard, None\n"
            f2.write(first_line)
            f2.write(str(fpl_player_chip_info[0]) + "," + 
                str(fpl_player_chip_info[1]) + "," + str(fpl_player_chip_info[2]) + "," + 
                str(fpl_player_chip_info[3]) + "," + str(fpl_player_chip_info[4]) + "\n\n")
            f2.write("Overall rank, team value, event transfers, event transfer cost, total points, bank\n")
            
            for n in range(top_x_players_i):
                f2.write(str(n) + "," + 
                str(event_fpl_team_info[n, 0]) + "," + 
                str(event_fpl_team_info[n, 1]) + "," + 
                str(event_fpl_team_info[n, 2]) + "," +
                str(event_fpl_team_info[n, 3]) + "," + 
                str(event_fpl_team_info[n, 4]) + "\n")
            f2.close()

            # write data to nationlaity text file
            store_nationality_path = general_folder_path + "/" + country_population_txt_file_name

            f3 = open(store_nationality_path, "w", encoding="utf-8")
            f3.write("Country name, number of fpl players from this country \n")
            for key in regions_dict.keys():
                f3.write(str(key) + ":" + str(regions_dict[key][1]) + ":" + str(regions_dict[key][0]) + "\n")
            f3.close()

            # write data to total chip usage txt file
            store_total_chips_usage_path = general_folder_path + "/" + total_chip_usage_txt_file_name
            first_line, data_line = "", ""
            for idx, chip_key in enumerate(dict_total_chip_usage_to_index.keys()):
                if (chip_key == "wildcard"):
                    first_line += "wildcard_1, wildcard_2"
                    data_line += str(dict_total_chip_usage_to_index["wildcard"][0]) + "," + str(dict_total_chip_usage_to_index["wildcard"][1])
                else:
                    first_line += chip_key
                    data_line += str(dict_total_chip_usage_to_index[chip_key])
                if (idx != len(dict_total_chip_usage_to_index.keys()) - 1):
                   first_line += "," 
                   data_line += "," 
            f4 = open(store_total_chips_usage_path, "w", encoding="utf-8")
            f4.write(first_line + "\n")
            f4.write(data_line + "\n")
            f4.close()

    end_time = time.time()
    print("\nTotal time to collect data for top " + str(top_x_players) + " players: ", (end_time - start_time) / 60, " min")


def get_tz_notation_to_seconds(time_str):
    date = np.array(time_str.split("T")[0].split("-"), dtype=int)
    hour = np.array(time_str.split("T")[1].split(":"), dtype=int)
    dt = datetime.datetime(date[0], date[1], date[2], hour[0], hour[1])
    return time.mktime(dt.timetuple())


if __name__ == "__main__":
    save_all_fpl_teams_stats(eliteserien_folder_name)


