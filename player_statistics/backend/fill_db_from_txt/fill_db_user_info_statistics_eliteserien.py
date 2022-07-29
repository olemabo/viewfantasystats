from constants import user_stats_special_delimiter, user_stats_folder_name, total_number_of_gameweeks_in_eliteserien, user_stats_txt_file_name, eliteserien_folder_name, name_of_extra_info_file, name_of_nationality_file, path_to_store_local_data, all_top_x_players_eliteserien, name_of_ownership_file, total_number_of_gameweeks
from player_statistics.db_models.eliteserien.user_statistics_model_eliteserien import UserInfoStatistics
import numpy as np
import json


def write_user_info_to_db_eliteserien():
    path = path_to_store_local_data + "/" + eliteserien_folder_name + "/" + user_stats_folder_name + "/" + user_stats_txt_file_name
    user_info_data = np.loadtxt(path, dtype="str", delimiter=user_stats_special_delimiter, skiprows=1, encoding="utf-8")
    for data in user_info_data:
        id = data[0]
        started_event = data[2]
        favourite_team = data[3]
        team_name = data[4]
        player_first_name = data[5]
        player_last_name = data[6]
        player_region_id = data[7]
        player_region_name = data[8]
        player_region_iso_code_long = data[9]
        ranking_list = json.loads(data[10])
        joined_time = data[1]

        if len(UserInfoStatistics.objects.filter(user_id = id)) > 0:
            fill_model = UserInfoStatistics.objects.filter(user_id = id)
            fill_model.update(user_team_name=team_name, 
                    user_first_name=player_first_name, 
                    user_last_name=player_last_name)
        else:
            fill_model = UserInfoStatistics(
                user_id=id,
                user_team_name=team_name, 
                user_first_name=player_first_name, 
                user_last_name=player_last_name)
            fill_model.save()
        
        # print(id, joined_time, started_event, favourite_team, team_name, player_first_name, player_last_name,
        # player_region_id, player_region_name, player_region_iso_code_long, ranking_list)


if __name__ == '__main__':
    write_user_info_to_db_eliteserien()

