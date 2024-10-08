from constants import fpl, global_stats_folder_name, nationality_delimiter, total_chip_usage_txt_file_name, name_of_extra_info_file, current_season_name_premier_league, name_of_nationality_file, path_to_store_local_data, all_top_x_players_premier_league, name_of_ownership_file, total_number_of_gameweeks
from player_statistics.db_models.premier_league.ownership_statistics_model import PremierLeagueChipsAndUserInfo, PremierLeagueGlobalOwnershipStats10000, \
    PremierLeagueGlobalOwnershipStats1000, PremierLeagueGlobalOwnershipStats100, PremierLeagueGwsChecked
from player_statistics.db_models.premier_league.nationality_statistics_model import PremierLeagueNationalityStatistics
import numpy as np
import datetime
import os
from django.utils import timezone


def write_global_stats_to_db(current_gw=0):
    gws = [gw + 1 for gw in range(total_number_of_gameweeks)]
    gws = [current_gw] if current_gw > 0 else gws 
    
    for gw in gws:
        file_path = path_to_store_local_data + "/" + fpl + "/" + current_season_name_premier_league + "/" + global_stats_folder_name + "/" + str(gw)
        
        fill_db_ownership_statistics(gw, file_path)
        fill_db_extra_info_statistics(gw, file_path)
        fill_db_nationality_statistics(gw, file_path)
        


def fill_db_ownership_statistics(gw, file_path):
    top_x_players = all_top_x_players_premier_league
    current_filled_gws = PremierLeagueGwsChecked.objects.all()[0]
    for top_x in top_x_players:
        try:
            current_path = file_path + "/top_" + str(top_x) + "/" + name_of_ownership_file
            open(current_path, "r", encoding="utf-8")
            current_data = np.loadtxt(current_path, encoding="utf-8", dtype="str", delimiter=",", skiprows=1)
            if top_x == 100:
                fill_global_ownership_statistics_top_x(current_data, gw, top_x)
                temp_list = list(current_filled_gws.gws_updated_100)
                if len(current_filled_gws.gws_updated_100) == 0:
                    fill_Config_model = PremierLeagueGwsChecked(id=1, date_modified=datetime.datetime.today(),
                                                    gws_updated_100=[gw])
                    fill_Config_model.save()
                if gw not in temp_list:
                    temp_list.append(gw)
                    PremierLeagueGwsChecked.objects.filter(pk=1).update(date_modified=datetime.datetime.today(),
                                                            gws_updated_100=temp_list)
                print("\nFilled up Ownership DB for top_x: ", top_x, " for GW: ", gw)

            if top_x == 1000:
                fill_global_ownership_statistics_top_x(current_data, gw, top_x)
                temp_list = list(current_filled_gws.gws_updated_1000)
                if len(current_filled_gws.gws_updated_1000) == 0:
                    fill_Config_model = PremierLeagueGwsChecked(id=1, date_modified=datetime.datetime.today(),
                                                    gws_updated_1000=[gw])
                    fill_Config_model.save()
                elif gw not in temp_list:
                    temp_list.append(gw)
                    PremierLeagueGwsChecked.objects.filter(pk=1).update(date_modified=datetime.datetime.today(),
                                                            gws_updated_1000=temp_list)
                print("Filled up Ownership DB for top_x: ", top_x, " for GW: ", gw)

            if top_x == 10000:
                fill_global_ownership_statistics_top_x(current_data, gw, top_x)
                temp_list = list(current_filled_gws.gws_updated_10000)
                if len(current_filled_gws.gws_updated_10000) == 0:
                    fill_Config_model = PremierLeagueGwsChecked(id=1, date_modified=datetime.datetime.today(),
                                                    gws_updated_10000=[gw])
                    fill_Config_model.save()
                elif gw not in temp_list:
                    temp_list.append(gw)
                    PremierLeagueGwsChecked.objects.filter(pk=1).update(date_modified=datetime.datetime.today(),
                                                            gws_updated_10000=temp_list)

                print("Filled up Ownership DB for top_x: ", top_x, " for GW: ", gw)

        except:
            error = "Error occured"
            # print("Didn't find file: ", current_path)


def fill_db_extra_info_statistics(gw, file_path):
    # for gw in gws:
    top_x_players = all_top_x_players_premier_league

    extra_info_top_1 = []
    extra_info_top_10 = []
    extra_info_top_100 = []
    extra_info_top_1000 = []
    extra_info_top_10000 = []
    new_data = False

    total_chip_usage_1 = []
    total_chip_usage_10 = []
    total_chip_usage_100 = []
    total_chip_usage_1000 = []
    total_chip_usage_10000 = []
    
    for top_x in top_x_players:
        try:
            current_path = file_path + "/top_" + str(top_x) + "/" + name_of_extra_info_file
            open(current_path, "r", encoding="utf-8")
            chips_data = np.loadtxt(current_path, dtype="str", delimiter=",", skiprows=1, max_rows=1)
            avg_data = np.loadtxt(current_path, dtype="str", delimiter=",", skiprows=4)

            if top_x == 1:
                avg_team_value = int(float(avg_data[1]))
                avg_gw_transfer = int(float(avg_data[2]))
                avg_transfer_cost = int(float(avg_data[3]))
            else:
                avg_team_value = int(np.mean(np.array(avg_data[:, 1], dtype=float)))
                avg_gw_transfer = int(np.mean(np.array(avg_data[:, 2], dtype=float))*10)
                avg_transfer_cost = int(np.mean(np.array(avg_data[:, 3], dtype=float))*10)

            db_data = [chips_data[0], chips_data[1], chips_data[2], chips_data[3], chips_data[4],
                        avg_team_value, avg_gw_transfer, avg_transfer_cost]

            total_chip_usage = file_path + "/top_" + str(top_x) + "/" + total_chip_usage_txt_file_name
            total_chip_usage_data = []
            if (os.path.exists(total_chip_usage)):
                temp = np.loadtxt(total_chip_usage, dtype="str", delimiter=",", skiprows=1, max_rows=1)
                total_chip_usage_data = [temp[0], temp[1], temp[2], temp[3], temp[4]]
                

            if top_x == 1:
                extra_info_top_1 = db_data
                total_chip_usage_1 = total_chip_usage_data
                new_data = True
            if top_x == 10:
                extra_info_top_10 = db_data
                total_chip_usage_10 = total_chip_usage_data
                new_data = True
            if top_x == 100:
                extra_info_top_100 = db_data
                total_chip_usage_100 = total_chip_usage_data
                new_data = True
            if top_x == 1000:
                extra_info_top_1000 = db_data
                total_chip_usage_1000 = total_chip_usage_data
                new_data = True
            if top_x == 10000:
                extra_info_top_10000 = db_data
                total_chip_usage_10000 = total_chip_usage_data
                new_data = True
        except:
            error = "Error occured"
            #print("Didn't find file: ", current_path)

    if new_data:
        fill_model = PremierLeagueChipsAndUserInfo(
            gw=gw,
            extra_info_top_1=extra_info_top_1,
            extra_info_top_10=extra_info_top_10,
            extra_info_top_100=extra_info_top_100,
            extra_info_top_1000=extra_info_top_1000,
            extra_info_top_10000=extra_info_top_10000,
            total_chip_usage_1=total_chip_usage_1,
            total_chip_usage_10=total_chip_usage_10,
            total_chip_usage_100=total_chip_usage_100,
            total_chip_usage_1000=total_chip_usage_1000,
            total_chip_usage_10000=total_chip_usage_10000,
            date_updated=timezone.now())
        fill_model.save()
        print("Filled up Extra Info DB for GW: ", gw)


def fill_global_ownership_statistics_top_x(ownership_data, gw, top_x):
    for data_i in ownership_data:
        if top_x == 100:
            if len(PremierLeagueGlobalOwnershipStats100.objects.filter(player_id = data_i[0])) > 0:
                fill_model = PremierLeagueGlobalOwnershipStats100.objects.filter(player_id = data_i[0])
                fill_model.update(player_name=data_i[3], player_team_id=data_i[1], player_position_id=data_i[2])
                fill_and_update_model(data_i, gw, fill_model)
            else:
                fill_model = PremierLeagueGlobalOwnershipStats100(player_id=data_i[0],
                                                    player_team_id=data_i[1],
                                                    player_position_id=data_i[2],
                                                    player_name=data_i[3])
                fill_and_save_model(data_i, gw, fill_model)

        if top_x == 1000:
            if len(PremierLeagueGlobalOwnershipStats1000.objects.filter(player_id = data_i[0])) > 0:
                fill_model = PremierLeagueGlobalOwnershipStats1000.objects.filter(player_id = data_i[0])
                fill_model.update(player_name=data_i[3], player_team_id=data_i[1], player_position_id=data_i[2])
                fill_and_update_model(data_i, gw, fill_model)
            else:
                fill_model = PremierLeagueGlobalOwnershipStats1000(player_id=data_i[0],
                                                    player_team_id=data_i[1],
                                                    player_position_id=data_i[2],
                                                    player_name=data_i[3])
                fill_and_save_model(data_i, gw, fill_model)

        if top_x == 10000:
            if len(PremierLeagueGlobalOwnershipStats10000.objects.filter(player_id = data_i[0])) > 0:
                fill_model = PremierLeagueGlobalOwnershipStats10000.objects.filter(player_id = data_i[0])
                fill_model.update(player_name=data_i[3], player_team_id=data_i[1], player_position_id=data_i[2])
                fill_and_update_model(data_i, gw, fill_model)
            else:
                fill_model = PremierLeagueGlobalOwnershipStats10000(player_id=data_i[0],
                                                    player_team_id=data_i[1],
                                                    player_position_id=data_i[2],
                                                    player_name=data_i[3])
                fill_and_save_model(data_i, gw, fill_model)


def fill_db_nationality_statistics(gw, file_path):
    try:
        current_path = file_path + "/top_10000" + "/" + name_of_nationality_file
        open(current_path, "r", encoding="utf-8")
        nationality_data = np.loadtxt(current_path, dtype="str", delimiter=nationality_delimiter, skiprows=1)

        for data_i in nationality_data:
            country_code = data_i[1]
            country_name = data_i[0]
            total = int(data_i[2])
            fill_model = PremierLeagueNationalityStatistics(country_code=country_code,
                                                country_name=country_name,
                                                number_of_managers_from_this_country=total)

            fill_model.save()
        print("Filled up Nationality DB for GW: ", gw, "\n")

    except:
        error = "Not found"



def fill_and_save_model(data_i, gw, fill_model):
        data = [data_i[4], data_i[5], data_i[6], data_i[7], data_i[8], data_i[9], int(float(data_i[10]) * 100)]

        if gw == 1:
            fill_model.gw_1 = data
        if gw == 2:
            fill_model.gw_2 = data
        if gw == 3:
            fill_model.gw_3 = data
        if gw == 4:
            fill_model.gw_4 = data
        if gw == 5:
            fill_model.gw_5 = data
        if gw == 6:
            fill_model.gw_6 = data
        if gw == 7:
            fill_model.gw_7 = data
        if gw == 8:
            fill_model.gw_8 = data
        if gw == 9:
            fill_model.gw_9 = data
        if gw == 10:
            fill_model.gw_10 = data
        if gw == 11:
            fill_model.gw_11 = data
        if gw == 12:
            fill_model.gw_12 = data
        if gw == 13:
            fill_model.gw_13 = data
        if gw == 14:
            fill_model.gw_14 = data
        if gw == 15:
            fill_model.gw_15 = data
        if gw == 16:
            fill_model.gw_16 = data
        if gw == 17:
            fill_model.gw_17 = data
        if gw == 18:
            fill_model.gw_18 = data
        if gw == 19:
            fill_model.gw_19 = data
        if gw == 20:
            fill_model.gw_20 = data
        if gw == 21:
            fill_model.gw_21 = data
        if gw == 22:
            fill_model.gw_22 = data
        if gw == 23:
            fill_model.gw_23 = data
        if gw == 24:
            fill_model.gw_24 = data
        if gw == 25:
            fill_model.gw_25 = data
        if gw == 26:
            fill_model.gw_26 = data
        if gw == 27:
            fill_model.gw_27 = data
        if gw == 28:
            fill_model.gw_28 = data
        if gw == 29:
            fill_model.gw_29 = data
        if gw == 30:
            fill_model.gw_30 = data
        if gw == 31:
            fill_model.gw_31 = data
        if gw == 32:
            fill_model.gw_32 = data
        if gw == 33:
            fill_model.gw_33 = data
        if gw == 34:
            fill_model.gw_34 = data
        if gw == 35:
            fill_model.gw_35 = data
        if gw == 36:
            fill_model.gw_36 = data
        if gw == 37:
            fill_model.gw_37 = data
        if gw == 38:
            fill_model.gw_38 = data

        fill_model.save()


def fill_and_update_model(data_i, gw, fill_model):
        data = [data_i[4], data_i[5], data_i[6], data_i[7], data_i[8], data_i[9], int(float(data_i[10]) * 100)]

        if gw == 1:
            fill_model.update(gw_1 = data)
        if gw == 2:
            fill_model.update(gw_2 = data)
        if gw == 3:
            fill_model.update(gw_3 = data)
        if gw == 4:
            fill_model.update(gw_4 = data)
        if gw == 5:
            fill_model.update(gw_5 = data)
        if gw == 6:
            fill_model.update(gw_6 = data)
        if gw == 7:
            fill_model.update(gw_7 = data)
        if gw == 8:
            fill_model.update(gw_8 = data)
        if gw == 9:
            fill_model.update(gw_9 = data)
        if gw == 10:
            fill_model.update(gw_10 = data)
        if gw == 11:
            fill_model.update(gw_11 = data)
        if gw == 12:
            fill_model.update(gw_12 = data)
        if gw == 13:
            fill_model.update(gw_13 = data)
        if gw == 14:
            fill_model.update(gw_14 = data)
        if gw == 15:
            fill_model.update(gw_15 = data)
        if gw == 16:
            fill_model.update(gw_16 = data)
        if gw == 17:
            fill_model.update(gw_17 = data)
        if gw == 18:
            fill_model.update(gw_18 = data)
        if gw == 19:
            fill_model.update(gw_19 = data)
        if gw == 20:
            fill_model.update(gw_20 = data)
        if gw == 21:
            fill_model.update(gw_21 = data)
        if gw == 22:
            fill_model.update(gw_22 = data)
        if gw == 23:
            fill_model.update(gw_23 = data)
        if gw == 24:
            fill_model.update(gw_24 = data)
        if gw == 25:
            fill_model.update(gw_25 = data)
        if gw == 26:
            fill_model.update(gw_26 = data)
        if gw == 27:
            fill_model.update(gw_27 = data)
        if gw == 28:
            fill_model.update(gw_28 = data)
        if gw == 29:
            fill_model.update(gw_29 = data)
        if gw == 30:
            fill_model.update(gw_30 = data)
        if gw == 31:
            fill_model.update(gw_31 = data)
        if gw == 32:
            fill_model.update(gw_32 = data)
        if gw == 33:
            fill_model.update(gw_33 = data)
        if gw == 34:
            fill_model.update(gw_34 = data)
        if gw == 35:
            fill_model.update(gw_35 = data)
        if gw == 36:
            fill_model.update(gw_36 = data)
        if gw == 37:
            fill_model.update(gw_37 = data)
        if gw == 38:
            fill_model.update(gw_38 = data)