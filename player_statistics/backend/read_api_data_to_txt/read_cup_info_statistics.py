from constants import current_season_name_eliteserien, cup_processed_rounds, cup_all_ids_processed_file, cup_data_file, current_season_name_premier_league, cup_delimiter, user_stats_special_delimiter, cup_stats_folder_name, premier_league_api_url, eliteserien_api_url, eliteserien_folder_name, path_to_store_local_data
from utils.utility_functions import get_current_gw_
from utils.dataFetch.DataFetch import DataFetch
import numpy as np
import numpy as np
import time
import os 


def read_cup_info_statistics_eliteserien(league_name=eliteserien_folder_name):
    print("\n\nRead data from API | Cup statistics\n")
    
    api_url = eliteserien_api_url if league_name == eliteserien_folder_name else premier_league_api_url
    DFObject = DataFetch(api_url)
    static_bootstrap = DFObject.get_current_fpl_info()
    
    cup_start = static_bootstrap['game_settings']['cup_start_event_id']
    cup_end = static_bootstrap['game_settings']['cup_stop_event_id']

    if cup_start is None or cup_end is None:
        print("Cup start or/end has not been set yet")
        return 0
    
    current_gameweek = get_current_gw_(DFObject)
    total_number_of_participants = 2**(cup_end - cup_start + 1) 

    print("Cup start: ", cup_start)
    print("Cup end: ", cup_end)

    if current_gameweek < cup_start:
        print("Cup not started. Current gw: ", current_gameweek, " and cup start: ", cup_start)
        return 0
        
    number_of_fantasy_players = DFObject.get_current_fpl_info()['total_players']
    ids_to_check, processed_path, store_cup_data_path, rounds_path, update = check_if_txt_file_exist(league_name, total_number_of_participants, number_of_fantasy_players, cup_start)

    number_of_ids_to_check = len(ids_to_check)
    print("\nNumber of ids to check: ", number_of_ids_to_check)
    print("Update: ", update, "\n")

    total_time = 0
    idx = 0
    update_dict = {}
    for id in ids_to_check:
        start_time = time.time()
        time.sleep(1)
        current_player_cup_info = DFObject.get_current_cup(id)
        cup_matches = current_player_cup_info['cup_matches']
        cup_status = current_player_cup_info['cup_status']
        qualification_state = cup_status['qualification_state']
        if (qualification_state == "QUALIFIED"):
            cup_history_data, round_lost = get_cup_history_data(cup_matches, id, cup_start)
            
            is_entry_1 = id == cup_matches[0]['entry_1_entry']
            entry_id = str(cup_matches[0]['entry_1_entry']) if is_entry_1 else str(cup_matches[0]['entry_2_entry'])
            entry_name = str(cup_matches[0]['entry_1_name']).replace('"', "'").replace("\\", "/") if is_entry_1 else str(cup_matches[0]['entry_2_name']).replace('"', "'").replace("\\", "/")
            entry_player_name = str(cup_matches[0]['entry_1_player_name']).replace('"', "'").replace("\\", "/") if is_entry_1 else str(cup_matches[0]['entry_2_player_name']).replace('"', "'").replace("\\", "/")
            qualification_rank = str(cup_status['qualification_rank'])
            
            if (update == False):
                wrtie_to_file(
                    entry_id + cup_delimiter + 
                    '"' + entry_name + '"' + cup_delimiter + 
                    '"' + entry_player_name + '"' + cup_delimiter + 
                    round_lost + cup_delimiter +
                    qualification_rank + cup_delimiter +
                    cup_history_data, store_cup_data_path)

            if (update):
                update_dict[id] = entry_id + cup_delimiter + '"' + entry_name + '"' + cup_delimiter + '"' + entry_player_name + '"' + cup_delimiter + round_lost + cup_delimiter + qualification_rank + cup_delimiter + cup_history_data
            

        if (update == False):
            wrtie_to_file(str(id), processed_path)
        
        end_time = time.time()
        total_time += (end_time - start_time) 
        avg_time = total_time / (idx + 1)
        sec_left = avg_time * (number_of_ids_to_check - idx)
        if (sec_left < 60):
            print(idx, " / ", number_of_ids_to_check, " | ", round(idx / number_of_ids_to_check * 100, 2) , "% | " , round(sec_left, 2), " secs left")
        elif (sec_left < 60 * 60):
            print(idx, " / ", number_of_ids_to_check, " | ", round(idx / number_of_ids_to_check * 100, 2) , "% | " , round(sec_left / 60, 2), " mins left")
        else:
            print(idx, " / ", number_of_ids_to_check, " | ", round(idx / number_of_ids_to_check * 100, 2) , "% | " , round(sec_left / 3600, 2), " hours left")
        idx += 1
        
    if (update):
        file = open(store_cup_data_path, 'r', encoding='utf-8')
        replaced_content = ""
        for idx, line in enumerate(file):
            if (idx % 1000 == 0):
                print(idx, " / ", number_of_fantasy_players)
            
            line = line.strip()
            id = int(line.split(cup_delimiter)[0])
            new_line = line
            if id in ids_to_check:
                new_line = update_dict[id]

            replaced_content = replaced_content + new_line + "\n"
        file.close()

        # update old file
        write_file = open(store_cup_data_path, "w", encoding="utf-8")
        write_file.write(replaced_content)
        write_file.close()
        
    # update cup_processed rounds
    wrtie_to_file(','.join(str(x) for x in range(cup_start, current_gameweek)), rounds_path, "w")

    return 1


def get_cup_history_data(cup_matches, id, cup_start):
    round_lost = cup_start
    history_data_str = "["
    for idx, cup_match in enumerate(cup_matches):
        is_entry_1 = id == cup_match['entry_1_entry']

        opponent_entry_id = str(cup_match['entry_2_entry']) if is_entry_1 else str(cup_match['entry_1_entry'])
        opponent_name = str(cup_match['entry_2_name']).replace('"', "'").replace("\\", "/") if is_entry_1 else str(cup_match['entry_1_name']).replace('"', "'").replace("\\", "/")
        opponent_player_name = str(cup_match['entry_2_player_name']).replace('"', "'").replace("\\", "/") if is_entry_1 else str(cup_match['entry_1_player_name']).replace('"', "'").replace("\\", "/")
        opponent_points = str(cup_match['entry_2_points']) if is_entry_1 else str(cup_match['entry_1_points'])
        current_points = str(cup_match['entry_1_points']) if is_entry_1 else str(cup_match['entry_2_points'])
        current_cup_round = str(cup_match['event'])
        winner = cup_match['winner']
        
        if (winner != id):
            round_lost = cup_match['event']
        if (winner == None):
            winner = -1
            round_lost = -1

        history_data_str += "[" + opponent_entry_id + "," + '"' + opponent_name + '"' + "," + '"' + opponent_player_name + '"'+ "," + opponent_points + "," + current_points + "," + str(winner) + "," + current_cup_round + "]"
        if (idx != len(cup_matches) - 1):
            history_data_str += ","
    history_data_str += "]"

    return history_data_str, str(round_lost)

def check_if_txt_file_exist(league_name, total_number_of_participants, number_of_fantasy_players, cup_start):
    update = False
    league_path = path_to_store_local_data + "/" + league_name + "/"
    if not os.path.isdir(league_path):
        print("Create folder: ", league_path)
        os.mkdir(league_path)

    season_name = current_season_name_eliteserien if league_name == eliteserien_folder_name else current_season_name_premier_league
    season_path = league_path + "/" + season_name + "/"
    if not os.path.isdir(season_path):
        print("Create folder: ", league_path)
        os.mkdir(season_path)

    user_stat_path = season_path + "/" + cup_stats_folder_name
    if not os.path.isdir(user_stat_path):
        print("Create folder: ", league_path)
        os.mkdir(user_stat_path)   
    
    gws_allready_checked_path = user_stat_path + "/" + cup_processed_rounds
    all_ids_list = np.arange(1, number_of_fantasy_players + 1, 1).tolist()
    
    store_cup_data_path = user_stat_path + "/" + cup_data_file
    if not os.path.exists(store_cup_data_path):
        print("Create file: ", store_cup_data_path)
        f = open(store_cup_data_path, "w", encoding="utf-8")
        f.close()

    processed_path = user_stat_path + "/" + cup_all_ids_processed_file
    if not os.path.exists(processed_path):
        print("Create file: ", processed_path)
        f = open(processed_path, "w", encoding="utf-8")
        f.close()
        return all_ids_list, processed_path, store_cup_data_path, gws_allready_checked_path, update

    data_allready_stored = np.loadtxt(store_cup_data_path, dtype="str", comments="&&&&&&&&&&&", delimiter=cup_delimiter, skiprows=0, encoding="utf-8")
    find_duplicates(data_allready_stored)

    ids_allready_stored = np.loadtxt(processed_path, dtype="int", delimiter="\n", skiprows=0, encoding="utf-8")
    print(len(ids_allready_stored) != total_number_of_participants, len(ids_allready_stored), total_number_of_participants)
    # if all qualfied participants has not been stored, start from where you left off last time
    print(len(ids_allready_stored), len(data_allready_stored), total_number_of_participants)
    
    
    if len(data_allready_stored) != total_number_of_participants:
        updated_list_of_ids = [x for x in all_ids_list if x not in ids_allready_stored]
        print("Data for", len(all_ids_list) - len(updated_list_of_ids), "managers allready stored. Start from id: ", str(updated_list_of_ids[0]))
        return updated_list_of_ids, processed_path, store_cup_data_path, gws_allready_checked_path, update
    
    
    # if all all qualfied participants has been stored, update them for the current gw
    # check which gw-s has been check in cup_processed_rounds (make logic for making this file (not done yet))
    # find largest gw number in cup_processed_rounds.txt and find all ids to the players which have lasted longer than this gw
    # return a list of all these ids
    # make sure that data extraction outside this function replaces their lines in cup_data.txt, and not stores from the bottom again
    gws_allready_checked = np.loadtxt(gws_allready_checked_path, dtype="int", delimiter=",", skiprows=0, encoding="utf-8")
    last_gw = max(gws_allready_checked)
    last_gw = max(last_gw, cup_start)
    all_ids_list = []
    for data in data_allready_stored:
        current_id = int(data[0])
        gw_lost = int(data[3])
        if (gw_lost > last_gw or gw_lost == -1):
            all_ids_list.append(current_id)
    print("Extract data from ", len(all_ids_list), " managers")
    update = True

    return all_ids_list, processed_path, store_cup_data_path, gws_allready_checked_path, update


def find_duplicates(data_allready_stored):
    ids_list = []
    for i in data_allready_stored:
            ids_list.append(int(i[0]))
    seen = set()
    dupes = [x for x in ids_list if x in seen or seen.add(x)]    
    if (len(dupes) > 0):
        print("Duplication ids: ", dupes)
        print(1/0)
     

def wrtie_to_file(content, path_to_file, mode="a"):
    f2 = open(path_to_file, mode, encoding="utf-8")
    f2.write(content + "\n")
    f2.close()




# check file with ids processed to know where to start

    # if length of processed ids == number of contestents, the return a list of all ids still in the cup, dont check all


    # ids_to_check = all_ids_list

    # print(user_stat_path, txt_file_path, len(all_ids_list))
    # print(1/0)

    # for id in all_ids_list:
    #     print(id)

    # for gw in range(cup_start, current_gameweek + 1):
    #     gw_path = user_stat_path + "/" + cup_stats_folder_name + "_" + str(gw) + ".txt"
    #     if not os.path.exists(gw_path):
    #         f = open(gw_path, "w", encoding="utf-8")
    #         f.close()
    #         return ids_to_check, gw_path
    #     if os.path.exists(gw_path):
    #         data_allready_stored = np.loadtxt(gw_path, dtype="str", delimiter="\n", skiprows=0, encoding="utf-8")
    #         # read data from file and return all ids
    #         list_from_data_stored = [] #get_data()
    #         if len(data_allready_stored) / 2 != 2 ** (cup_end - gw):
    #             return list_from_data_stored, user_stat_path + "/" + cup_stats_folder_name + "_" + str(gw + 1) + ".txt"
    #         ids_to_check = list_from_data_stored

    # onlyfiles = [f for f in listdir(user_stat_path) if isfile(join(user_stat_path, f))]
    
    # if len(onlyfiles) == 1:
    #     gw_path = user_stat_path + "/" + cup_stats_folder_name + "_" + str(cup_start) + ".txt"
    #     if not os.path.exists(gw_path):
    #         f = open(gw_path, "w", encoding="utf-8")
    #         f.close()
    
    # start_gw = cup_start
    # if len(onlyfiles) > 1:
    #     for file in onlyfiles:
    #         if (file == cup_all_ids_processed_file): 
    #             continue
    #         data_allready_stored = np.loadtxt(user_stat_path + "/" + file, dtype="str", delimiter="\n", skiprows=0, encoding="utf-8")
    #         if len(data_allready_stored) / 2 != 2 ** (cup_end - start_gw):
    #             data_allready_stored = np.loadtxt(txt_file_path, dtype="int", delimiter="\n", skiprows=0, encoding="utf-8")
    #             return [1, 2, 3]

    # for gw in range(cup_start, current_gameweek + 1):
    #     gw_path = user_stat_path + "/" + cup_stats_folder_name + "_" + str(gw) + ".txt"
    #     if not os.path.exists(gw_path):
    #         f = open(gw_path, "w", encoding="utf-8")
    #         f.close()

    # ids_processed_list = []
    # data_allready_stored = np.loadtxt(txt_file_path, dtype="int", delimiter="\n", skiprows=0, encoding="utf-8")
    # for id in data_allready_stored:
    #     ids_processed_list.append(id)
   
    # return ids_processed_list