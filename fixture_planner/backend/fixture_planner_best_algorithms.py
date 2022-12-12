from fixture_planner.backend.utility_functions import fixture_score_one_team, calc_score
from fixture_planner.backend.create_data_objects import create_FDR_dict
from utils.fixtures.models.FixtureDifficultyModel import FixtureDifficultyModel
import numpy as np


def find_best_fixture_with_min_length_each_team(data, GW_start, GW_end, min_length=5):
    #df = adjust_df_for_blanks(df, adjust_blank_to=6)
    #df = adjust_df_for_home_away(df)
    #df = adjust_df_for_difficult_teams(df)
    best_fixtures_min_length = []
    first_gw_list = []
    for team_id in range(len(data)):
        info, first_gw = compute_best_fixtures_one_team_db_data(data, GW_start, GW_end, team_id + 1, min_length)
        best_fixtures_min_length.append(info)
        first_gw_list.append(first_gw)
    sorted_best_fixtures = [x for _, x in sorted(zip(first_gw_list, best_fixtures_min_length))]
    return sorted_best_fixtures


def compute_best_fixtures_one_team(df, gw_start, gw_end, team_idx, min_length):
    """
    Find best gameweek region with respect to fixture values between GW_start and GW_end with a length
    >= min_length.
    :param df: dataframe with fixture data. create_data_frame()
    :param gw_start: first GW to count. GW_start > 0. (1)
    :param gw_end: last GW to count. GW_start <= GW_end <= 38 (38)
    :param team_idx:
    :param min_length: must be smaller than GW_end - GW_start + 1
    :return:
    """
    if min_length > (gw_end - gw_start + 1):
        print('min_length: must be smaller than GW_end - GW_start + 1')
        return -1
    max_info = fixture_score_one_team(df, team_idx, gw_start, gw_end)
    ii, jj, length = gw_start, gw_end, len(max_info[2])
    max_score = max_info[0] / (gw_end - gw_start + 1)
    for i in range(gw_end - gw_start + 1):
        for j in range(i + min_length - 1, gw_end - gw_start + 1):
            temp_score = np.sum(max_info[3][i:j+1]) / (j - i + 1)
            temp_len = j - i + 1
            if temp_score <= max_score:
                if temp_score == max_score and temp_len > length:
                    ii, jj, length = i+1, j+1, temp_len
                    max_score = temp_score
                if temp_score != max_score:
                    ii, jj, length = i+1, j+1, temp_len
                    max_score = temp_score
    return fixture_score_one_team(df, team_idx, ii, jj)


def compute_best_fixtures_one_team_db_data(data, gw_start, gw_end, team_idx, min_length, toJson=True):
    """
    Find best gameweek region with respect to fixture values between GW_start and GW_end with a lenght
    >= min_length.
    :param data: dataframe with fixture data. create_data_frame()
    :param gw_start: first GW to count. GW_start > 0. (1)
    :param gw_end: last GW to count. GW_start <= GW_end <= 38 (38)
    :param team_idx:
    :param min_length: must be smaller than GW_end - GW_start + 1
    :return:
    """
    if min_length > (gw_end - gw_start + 1):
        print('min_length: must be smaller than GW_end - GW_start + 1')
        return -1
    fdr_dict = create_FDR_dict(data[team_idx - 1])
    number_of_gameweeks = gw_end - gw_start + 1
    ii, jj, length = gw_start, gw_end, number_of_gameweeks
    first_gw_to_use = 0
    max_score = calc_score(fdr_dict, gw_start, gw_end) / (gw_end - gw_start + 1)
    for i in range(gw_start, gw_end + 1):
        for j in range(i + min_length - 1, gw_end + 1):
            #temp_score = np.sum(max_info[3][i:j+1]) / (j - i + 1)
            temp_len = j - i + 1
            temp_score = calc_score(fdr_dict, gw_start=i, gw_end=j) / temp_len
            if temp_score <= max_score:
                if temp_score == max_score and temp_len > length:
                    ii, jj, length = i, j, temp_len
                    max_score = temp_score
                if temp_score != max_score:
                    ii, jj, length = i, j, temp_len
                    max_score = temp_score
    fixture_list = []
    for gw in range(gw_start, gw_end + 1):
        gw_fixtures = fdr_dict[gw]
        temp_list = []
        good_gw = 0
        if gw >= ii and gw <= jj:
            good_gw = 1
        for gw_fixture in gw_fixtures:
            if (good_gw == 1 and first_gw_to_use==0):
                first_gw_to_use = gw
            if toJson:
                temp_list.append([FixtureDifficultyModel(data[team_idx - 1].team_name, gw_fixture[0].upper(),
                                       gw_fixture[2], gw_fixture[1], good_gw).toJson()])
            else:
                temp_list.append([FixtureDifficultyModel(data[team_idx - 1].team_name, gw_fixture[0].upper(),
                                                        gw_fixture[2], gw_fixture[1], good_gw)])
        fixture_list.append(temp_list)
    
    return fixture_list, first_gw_to_use


