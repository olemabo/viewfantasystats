from constants import backup_data_folder_name, backup_data_txt_file_name, top_x_players_ids_backup_file_name, finished_file_name, current_season_name_eliteserien, global_stats_folder_name, path_to_store_local_data
from player_statistics.db_models.premier_league.ownership_statistics_model import PremierLeagueGlobalOwnershipStats100, \
    PremierLeagueGlobalOwnershipStats1000, PremierLeagueGlobalOwnershipStats10000
from utils.parse.parseStringToInt import parseStringToInt
import numpy as np
import os

def get_ownership_db_data(top_x, field_name, player_position_ids, player_team_ids):
    """
    Extract data from either GlobalOwnershipStats100, GlobalOwnershipStats1000 or GlobalOwnershipStats10000 database.
    Filter on field name, player position and player team ids.
    :param top_x: which database to extract data from. Means data from top x on global rank (100, 1000, 10000)
    :param field_name: database field name (gw_1, gw_2 ..., player_name)
    :param player_position_ids: list of player position ids ([1, 3], meaning goalkeeper and midfielder)
    :param player_team_ids: list of team ids ([1], meaning Arsenal)
    :return: DB object with data from database based on filters.
    """
    if top_x == 100:
        return PremierLeagueGlobalOwnershipStats100.objects.values(field_name).\
                filter(player_position_id__in=player_position_ids).filter(player_team_id__in=player_team_ids)
    if top_x == 1000:
        return PremierLeagueGlobalOwnershipStats1000.objects.values(field_name).\
                filter(player_position_id__in=player_position_ids).filter(player_team_id__in=player_team_ids)
    if top_x == 10000:
        return PremierLeagueGlobalOwnershipStats10000.objects.values(field_name). \
                filter(player_position_id__in=player_position_ids).filter(player_team_id__in=player_team_ids)
    

def checkIfLatestGwIsUpdating(league_name):
    try:
        file_path = path_to_store_local_data + "/" + league_name + "/" + current_season_name_eliteserien + "/" + global_stats_folder_name
        latest_gw = 0
        for file in os.listdir(file_path):
            latest_gw = max(latest_gw, parseStringToInt(file))

        if (latest_gw > 0):
            gw_path = file_path + "/" + str(latest_gw)

            path_ids_txt_file = gw_path + "/" + finished_file_name
            if os.path.exists(path_ids_txt_file):
                return 0, 0
            
            backup_path = gw_path + "/" + backup_data_folder_name + "/" + backup_data_txt_file_name
            
            if (os.path.exists(backup_path)):
                current_data = np.loadtxt(backup_path, encoding="utf-8", dtype="str", delimiter=",", skiprows=0)
                current_number_stored = int(current_data[1])
            
                path_ids_txt_file = gw_path + "/" + top_x_players_ids_backup_file_name
            
                if (os.path.exists(path_ids_txt_file)):
                    with open(path_ids_txt_file, encoding="utf-8") as f:
                        ids_allready_stored = f.read().splitlines()
                        number_of_ids = len(ids_allready_stored)
                
                return current_number_stored / number_of_ids * 100, latest_gw
        
        return 0, 0
    except:
        return 0, 0