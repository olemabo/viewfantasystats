from constants import current_season_name_eliteserien, finished_file_name, all_top_x_players_eliteserien_nationality, all_top_x_players_eliteserien_total_chips, all_top_x_players_premier_league_total_chips, all_top_x_players_premier_league_nationality, top_x_players_ids_backup_file_name, backup_data_txt_file_name, current_season_name_premier_league, backup_data_folder_name, how_often_do_back_up_of_global_data, nationality_delimiter, name_of_nationality_file, global_stats_folder_name, eliteserien_wc_due_date, premier_league_wc_due_date, total_chip_usage_txt_file_name, country_population_txt_file_name, global_stats_folder_name, premier_league_api_url, eliteserien_api_url, web_global_league_eliteserien, eliteserien_folder_name, premier_league_folder_name, name_of_extra_info_file, path_to_store_local_data, web_global_league_premier_league, all_top_x_players_premier_league, all_top_x_players_eliteserien, time_to_sleep_for_each_iteration, name_of_ownership_file
from utils.dataFetch.DataFetch import DataFetch
from tqdm import tqdm
import pandas as pd
import numpy as np
import requests
import datetime
import time
import os


def save_all_global_stats_for_current_gw(league_name=premier_league_folder_name):
    """
    Save ownership stats from "top_x_players" fpl teams based on the fpl players they have in their teams
    :param top_x_players: top x fpl teams based on global ranking (10000)
    :return:

    TODO: Add number of years played fantasy (see history_stats.py)
    Find a way to decrease computational time. ATM 10000 teams yield approx 45 minutes.
    Create a plotting function which takes complete_ownership.txt as input.
    Can plot stats for one single player. Can plot top 10 captains.

    """
    
    all_top_x_players = all_top_x_players_eliteserien if league_name == eliteserien_folder_name else all_top_x_players_premier_league

    start_time = time.time()
    
    # collect fpl api class for premier league or eliteserien
    api_url = eliteserien_api_url if league_name == eliteserien_folder_name else premier_league_api_url
    DFObject = DataFetch(api_url)
    
    current_gameweek = get_current_gw(DFObject)
    season_name = current_season_name_eliteserien if league_name == eliteserien_folder_name else current_season_name_premier_league

    print("\nCurrent GW: ", current_gameweek, "\nCurrent season: ", season_name, "\n")

    print("League name: ", league_name, "\n")

    print("You will now extract data from the FPL api. It will be for top " +  str(max(all_top_x_players)) + " fpl managers. " +
             "Time to sleep between each api call is: " + str(time_to_sleep_for_each_iteration) + "\n")
    
    if time_to_sleep_for_each_iteration < 0.2:
        print("Team to sleep should be over 0.2, now it is ", time_to_sleep_for_each_iteration)
        return 0
        
    # create new directories if not already done
    league_path = path_to_store_local_data + "/" + league_name + "/"
    if not os.path.isdir(league_path):
        print("Created path: ", league_path)
        os.mkdir(league_path)

    season_path = league_path + "/" + season_name + "/"
    if not os.path.isdir(season_path):
        print("Created path: ", season_path)
        os.mkdir(season_path)
    
    global_stats_path = season_path + "/" + global_stats_folder_name + "/"
    if not os.path.isdir(global_stats_path):
        print("Created path: ", global_stats_path)
        os.mkdir(global_stats_path)

    # create new directories if not already done
    gw_path = global_stats_path + "/" + str(current_gameweek)
    if not os.path.isdir(gw_path):
        print("Created path: ", gw_path)
        os.mkdir(gw_path)

    path_ids_txt_file = gw_path + "/" + finished_file_name
    if os.path.exists(path_ids_txt_file):
        return -1
    
    # find max top_x players to check
    top_x_players = max(all_top_x_players)
    all_top_x_player_nationality = all_top_x_players_eliteserien_nationality if league_name == eliteserien_folder_name else all_top_x_players_premier_league_nationality
    all_top_x_player_total_chips = all_top_x_players_eliteserien_total_chips if league_name == eliteserien_folder_name else all_top_x_players_premier_league_total_chips
    top_x_players_nationality = max(all_top_x_player_nationality)
    top_x_players_total_chips = max(all_top_x_player_total_chips)

    # get soccer player name and ids
    ids = get_player_name_ids(DFObject)

    # create dict where each key is the soccer player id
    ids_dict = create_dict(ids)

    # check if we allready have the ids downlaoded in top_x_players_ids_backup.txt file
    id_s = []
    path_ids_txt_file = gw_path + "/" + top_x_players_ids_backup_file_name
    if (os.path.exists(path_ids_txt_file)):
        ids_allready_stored = np.loadtxt(path_ids_txt_file, encoding="utf-8", delimiter="\n", dtype="int")
        if (len(ids_allready_stored) == top_x_players):
            print("\nWill use ids from " + top_x_players_ids_backup_file_name + " file") 
            id_s = ids_allready_stored
    
    # find the team ids from the top x fpl players on global rank
    if len(id_s) != top_x_players:
        id_s = find_team_ids_from_top_x_players(top_x_players, league_name)
        
        if id_s == -1:
            return -1
        
        f_ids = open(path_ids_txt_file, "w", encoding="utf-8")
        for id in id_s:
            f_ids.write(str(id) + "\n")
        f_ids.close()

    # should not return duplicate ids and should be equal top 'top_x_players'
    if has_list_duplicates(id_s) or len(id_s) != top_x_players:
        print("Has duplicates")
        return 0
    
    print("All ids successfully extracted for gw ", str(current_gameweek), "\n")

    # [free hit, bench boost, triple captain, wildcard, no chips] chips usage this round
    fpl_player_chip_info = [0, 0, 0, 0, 0]
    
    # [ team_value, event_transfer, event_transfer_cost, total points, bank ]
    event_fpl_team_info = np.zeros((top_x_players, 5))

    dict_chip_to_index_premier_league = {"freehit": 0, "bboost": 1, "3xc": 2, "wildcard": 3, None: 4}
    dict_chip_to_index_eliteserien = {"rich": 0, "frush": 1, "2capt": 2, "wildcard": 3, None: 4}
    dict_chip_to_index = dict_chip_to_index_eliteserien if league_name == eliteserien_folder_name else dict_chip_to_index_premier_league

    # data for total chip usage
    total_chip_usage_eliteserien_dict = {"wildcard": [0, 0], "rich": 0, "frush": 0, "2capt": 0}
    total_chip_usage_premier_league_dict = {"wildcard": [0, 0], "freehit": 0, "3xc": 0, "bboost": 0}
    dict_total_chip_usage_to_index = total_chip_usage_eliteserien_dict if league_name == eliteserien_folder_name else total_chip_usage_premier_league_dict
    wildcard_date = eliteserien_wc_due_date if league_name == eliteserien_folder_name else premier_league_wc_due_date
    wildcard_deadline = get_tz_notation_to_seconds(wildcard_date)

    # data for nationality data
    regions_dict = {}

    # use current updated data
    number_of_ids_allready_stored = 0
    current_data_path = gw_path + "/" + backup_data_folder_name
    if (os.path.exists(current_data_path)):
        fpl_player_chip_info, event_fpl_team_info = read_chips_and_event_info(top_x_players, current_data_path + "/" + name_of_extra_info_file)
        dict_total_chip_usage_to_index = read_dict_total_chip_usage_to_index(dict_total_chip_usage_to_index, current_data_path + "/" + total_chip_usage_txt_file_name)
        regions_dict = read_regions_dict(current_data_path + "/" + name_of_nationality_file)
        ids_dict = read_complete_ownership(current_data_path + "/" + name_of_ownership_file, ids_dict)
        id_s, current_number_stored = get_id_s(current_data_path + "/" + backup_data_txt_file_name, id_s, top_x_players)
        print("Extract data from backup. Start from player number: ", current_number_stored)
        if (len(id_s) + current_number_stored != top_x_players):
            print("Wrong input data")
            return 0
        number_of_ids_allready_stored = current_number_stored

    print("Remaining ids to check: ", len(id_s), "\n")
    # extract different data for each id among top_x_players
    for player_i in tqdm(range(len(id_s))):
        # sleep som seconds to not get DDOS
        time.sleep(time_to_sleep_for_each_iteration)
        
        user_id = id_s[player_i]
        
        player_i = player_i + number_of_ids_allready_stored
        # print(player_i, top_x_players_nationality, top_x_players_total_chips)
        
        ### extract ownership info ###
        # get info for player_i with id = user_id
        team_info = DFObject.get_current_ind_team(user_id, current_gameweek)

        # chip info
        chip_used_this_round = team_info["active_chip"]
        fpl_player_chip_info[dict_chip_to_index[chip_used_this_round]] += 1

        # team info
        entry_history = team_info["entry_history"]
        event_fpl_team_info[player_i, 0] = int(entry_history["value"])
        event_fpl_team_info[player_i, 1] = int(entry_history["event_transfers"])
        event_fpl_team_info[player_i, 2] = int(entry_history["event_transfers_cost"])
        event_fpl_team_info[player_i, 3] = int(entry_history["total_points"])
        event_fpl_team_info[player_i, 4] = int(entry_history["bank"])

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
            if player_row['is_vice_captain'] and player_row['multiplier'] == 1:
                ids_dict[player_id][3] = int(ids_dict[player_id][3]) + 1
            if player_row['multiplier'] == 3:
                ids_dict[player_id][11] = int(ids_dict[player_id][11]) + 1
            ids_dict[player_id][4] = int(ids_dict[player_id][4]) + 1

        
        # extract nationality info 
        if player_i < top_x_players_nationality:
            nationality = DFObject.get_current_fpl_player(user_id)
            region_name = nationality['player_region_name']
            region_iso_name = nationality['player_region_iso_code_long']
            if region_name not in regions_dict.keys():
                regions_dict[region_name] = [1, region_iso_name]
            else:
                regions_dict[region_name][0] += 1

            # extract total chip usage info 
        
        if player_i < top_x_players_total_chips:
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

        # store data when it reach player limits found in all_top_x_players (1, 10, 100, 1000 ...) or when we do backup
        if (player_i + 1) in all_top_x_players or ((player_i + 1) % how_often_do_back_up_of_global_data == 0):
            top_x_players_i = player_i + 1
            
            if (player_i + 1) in all_top_x_players:
                print("Store data for top: ", player_i + 1)
                general_folder_path = gw_path + "/top_" + str(top_x_players_i)
                if not os.path.isdir(general_folder_path):
                    os.mkdir(general_folder_path)

            if ((player_i + 1) % how_often_do_back_up_of_global_data == 0):
                print("Do backup data for first ", player_i + 1, " players")
                general_folder_path = gw_path + "/" + backup_data_folder_name
                if not os.path.isdir(general_folder_path):
                    os.mkdir(general_folder_path)
                f_current_id = open(general_folder_path + "/" + backup_data_txt_file_name, "w", encoding="utf-8")
                f_current_id.write(str(user_id) + "," + str(top_x_players_i))
                f_current_id.close()
            

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
                    str(int(id)) + "," + 
                    str(ids_dict[int(id)][7]) + "," + 
                    str(ids_dict[int(id)][6]) + "," +
                    str(ids_dict[int(id)][0]) + "," + 
                    str(ids_dict[int(id)][1]) + "," + 
                    str(ids_dict[int(id)][2]) + "," + 
                    str(ids_dict[int(id)][11]) + "," + 
                    str(ids_dict[int(id)][3]) + "," + 
                    str(ids_dict[int(id)][4]) + "," + 
                    str(ids_dict[int(id)][5]) + "," + 
                    str(ids_dict[int(id)][10]) + "\n")
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
            if (player_i + 1) <= top_x_players_nationality:
                store_nationality_path = general_folder_path + "/" + country_population_txt_file_name

                f3 = open(store_nationality_path, "w", encoding="utf-8")
                f3.write("Country name, number of fpl players from this country \n")
                for key in regions_dict.keys():
                    f3.write(str(key) + nationality_delimiter + str(regions_dict[key][1]) + nationality_delimiter + str(regions_dict[key][0]) + "\n")
                f3.close()

            # write data to total chip usage txt file
            if (player_i + 1) <= top_x_players_total_chips:
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
    print("\nTotal time to collect data for top " + str(top_x_players) + " players: ", round((end_time - start_time) / 60, 3), " min")

    path_ids_txt_file = gw_path + "/" + finished_file_name
    if not os.path.exists(path_ids_txt_file):
        f_finished = open(path_ids_txt_file, "w", encoding="utf-8")
        f_finished.close()

    return current_gameweek


def get_season_name(DFObject):
    fixture = DFObject.get_current_fixtures()
    min_year = fixture[0]['kickoff_time'].split("-")[0]
    max_year = fixture[-1]['kickoff_time'].split("-")[0]
    if min_year == max_year:
        return str(min_year)
    else:
        return str(min_year) + "-" + str(max_year)


def data_fetch(num, league_type):
    """
    data_fetch will collect 50 teams from page "num" from global rank
    """
    time.sleep(0.5)
    if league_type == premier_league_folder_name:
        r = requests.get(web_global_league_premier_league.replace('X', str(num)))
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
                print("\nCollected all ids from all fpl players. Total ids: ", str(len(id_s)))
                return id_s
        idx += 1
        percentage = idx / (top_x_players / 50) * 100
        if percentage > _percentage:
            print(percentage, "%")
            _percentage += 10

        if percentage > 101:
            print("Percentage above 100%")
            return -1

        if len(data_pd) == 0:
            print("No results yet")
            return -1


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


def get_player_name_ids(dataFetchObject: DataFetch):
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


def get_tz_notation_to_seconds(time_str):
    date = np.array(time_str.split("T")[0].split("-"), dtype=int)
    hour = np.array(time_str.split("T")[1].split(":"), dtype=int)
    dt = datetime.datetime(date[0], date[1], date[2], hour[0], hour[1])
    return time.mktime(dt.timetuple())


def read_chips_and_event_info(top_x_players, path):
    fpl_player_chip_info = np.loadtxt(path, dtype="int", delimiter=",", skiprows=1, max_rows=1,  encoding="utf-8")
    event_fpl_team_info = np.zeros((top_x_players, 5))
    event_fpl_team_info_data = np.loadtxt(path, dtype="int", delimiter=",", skiprows=4,  encoding="utf-8")
    for idx, data in enumerate(event_fpl_team_info_data):
        event_fpl_team_info[idx, 0] = int(data[1])
        event_fpl_team_info[idx, 1] = int(data[2])
        event_fpl_team_info[idx, 2] = int(data[3])
        event_fpl_team_info[idx, 3] = int(data[4])
        event_fpl_team_info[idx, 4] = int(data[5])
    
    return fpl_player_chip_info, event_fpl_team_info


def read_dict_total_chip_usage_to_index(dict_total_chip_usage_to_index, path):
    if (os.path.exists(path)):
        temp = np.loadtxt(path, dtype="int", delimiter=",", skiprows=1, max_rows=1,  encoding="utf-8")
        total_chip_usage_data = [[temp[0], temp[1]], temp[2], temp[3], temp[4]]
        for dict_i, data_i in zip(dict_total_chip_usage_to_index.keys(), total_chip_usage_data):
            dict_total_chip_usage_to_index[dict_i] = data_i
    return dict_total_chip_usage_to_index


def read_regions_dict(path):
    regions_dict = {}
    if (os.path.exists(path)):
        data = np.loadtxt(path, dtype="str", delimiter=nationality_delimiter, skiprows=1,  encoding="utf-8")
        for data_i in data:
            region_name = str(data_i[0])
            region_iso_name = str(data_i[1])
            number = int(data_i[2])
            if region_name not in regions_dict.keys():
                regions_dict[region_name] = [number, region_iso_name]
        
    return regions_dict


def read_complete_ownership(path, ids_dict):
    current_data = np.loadtxt(path, encoding="utf-8", dtype="str", delimiter=",", skiprows=1)
    for data in current_data:
        player_id = int(data[0])
        ids_dict[player_id][1] = int(data[4])
        ids_dict[player_id][2] = int(data[5])
        ids_dict[player_id][3] = int(data[7])
        ids_dict[player_id][4] = int(data[8])
        ids_dict[player_id][5] = int(data[9])
        ids_dict[player_id][11] = int(data[6])
    return ids_dict


def get_id_s(path, id_s, top_x_players):
    current_data = np.loadtxt(path, encoding="utf-8", dtype="str", delimiter=",", skiprows=0)
    current_number_stored = int(current_data[1])
    
    # if all data is stored
    if current_number_stored == top_x_players:
        return [], current_number_stored
    
    next_id = np.where(id_s == id_s[current_number_stored])[0]
    new_id_s_list = id_s[int(next_id):]
    
    return new_id_s_list, current_number_stored


