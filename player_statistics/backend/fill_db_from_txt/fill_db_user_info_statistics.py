from player_statistics.db_models.eliteserien.user_statistics_model_eliteserien import EliteserienUserInfoStatistics
from constants import ranking_delimiter, user_stats_special_delimiter, user_stats_special_delimiter
from constants import user_stats_folder_name, eliteserien_folder_name, user_stats_txt_file_name
from constants import current_season_name_eliteserien, path_to_store_local_data
import numpy as np
import json


def write_user_info_to_db_eliteserien():
    path = path_to_store_local_data + "/" + eliteserien_folder_name + "/" + current_season_name_eliteserien + "/" + user_stats_folder_name + "/" + user_stats_txt_file_name
    user_info_data = np.loadtxt(path, dtype="str", comments="&&&&&&&&&&&", delimiter=user_stats_special_delimiter, skiprows=1, encoding="utf-8")
    new, update = 0, 0
    print("\n")
    
    for idx, data in enumerate(user_info_data):
        # Data stored in txt file but not added to the database model yet
        started_event = data[2]
        favourite_team = data[3]
        player_region_id = data[7]
        player_region_name = data[8]
        player_region_iso_code_long = data[9]
        joined_time = data[1]
        
        id = data[0]
        team_name = data[4]
        player_first_name = data[5]
        player_last_name = data[6]
        ranking_list = json.loads(data[10])
        ranking_list_str = []
        
        for i in ranking_list:
            list_as_string = str(i).replace(",", ranking_delimiter).replace(" ", "").replace("[", "").replace("]", "")
            ranking_list_str.append(list_as_string)
        
        if len(EliteserienUserInfoStatistics.objects.filter(user_id = id)) > 0:
            update += 1 
            fill_model = EliteserienUserInfoStatistics.objects.filter(user_id = id)
            fill_model.update(user_team_name=team_name, 
                    user_first_name=player_first_name, 
                    user_last_name=player_last_name,
                    ranking_history=ranking_list_str)
        else:
            new += 1
            fill_model = EliteserienUserInfoStatistics(
                user_id=id,
                user_team_name=team_name, 
                user_first_name=player_first_name, 
                user_last_name=player_last_name,
                ranking_history=ranking_list_str)
            fill_model.save()

        if (idx % 100 == 0):
            print(idx, " / ", len(user_info_data), "(", new, "/", update, ")", " (new/update)")
    
    # this is for deleting user ids from other seasons
    all_data = EliteserienUserInfoStatistics.objects.all()
    number_of_users = len(all_data)
    print("\nNumber of users in database: ", number_of_users)
    last_id = int(user_info_data[-1][0])
    print("Number of users from txt file: ", last_id)
    
    for old_user_id in range(last_id + 1, number_of_users + 1):
        EliteserienUserInfoStatistics.objects.filter(user_id=old_user_id).delete()
        print("Deleted id: ", old_user_id)


