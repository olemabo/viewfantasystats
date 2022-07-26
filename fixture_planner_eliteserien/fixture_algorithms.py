from fixture_planner.backend.utility_functions import fixture_score_one_team, insertion_sort, create_two_dim_list
from fixture_planner.backend.fixture_planner_best_algorithms import compute_best_fixtures_one_team_db_data
from constants import total_number_of_eliteserien_teams
from utils.models.FDR_team import FixtureDifficultyInfo
from itertools import combinations
import numpy as np
from utils.models.RotationPlannerTeamInfo import RotationPlannerTeamInfo
import json


def find_best_rotation_combosEliteserien(data, GW_start, GW_end, teams_to_check=5, teams_to_play=3, team_names=[-1],
                              teams_in_solution=[], teams_not_in_solution=[],
                              top_teams_adjustment=False, one_double_up=False, home_away_adjustment=True,
                              include_extra_good_games=False, num_to_print=20):
    """
    Find the best rotation combo for "teams_to_check" number of team where "team_to_play" number of them must play each gameweek.
    :param GW_start: start count from this gameweek
    :param GW_end: end counting in this gameweek
    :param teams_to_check: how many teams to check (1-5)
    :param teams_to_play: how many of the teams_to_check you want to play in each gameweek. ( team_to_play < teams_to_check)
    teams_to_check = 5 and teams_to_play = 3 will give the best 5 teams to use in your team if you must use at least 3 each round
    :param team_names: which teams to check from. ([-1]: all teams, ["Arsenal", "Spurs"]: check only some teams)
    :param teams_in_solution: ["Liverpool"]: liverpool must be in the optimal solution. []: no extra dependencies.
    :param home_away_adjustment: wheter to give home/away match score -/+ 0.1 points. Default=true
    :param num_to_print: how many of the best results to print to screen
    :return: combos_with_score [[score, [team_ids], [team_names]], ... ]   ([22.2, [1, 4, 11], ['Arsenal', 'Burnley', 'Liverpool']])
    """
    if team_names[0] != -1:
        if teams_to_check > len(team_names):
            print("Teams to check must be >= to number of input teams")
            return -1
    if teams_to_play > teams_to_check:
        print("Teams to play must be smaller than teams_to_check.")
        return -1
    if len(teams_in_solution) > teams_to_check:
        print("Teams_in_solution must be smaller than teams_to_play.")
        return -1
    if one_double_up:
        if teams_to_check < 2:
            print("Teams to check must be >= 1")
            return -1

    dict_with_team_name_to_team_ids = dict()
    for team in data:
        dict_with_team_name_to_team_ids[str(team.team_name)] = team.team_id

    team_ids = []

    for team_name in team_names:
        if team_name == -1:
            number_of_teams = total_number_of_eliteserien_teams # originaly df.shape[0]
            team_ids = np.arange(1, number_of_teams + 1)
            break
        team_id = dict_with_team_name_to_team_ids[team_name]
        team_ids.append(team_id)

    number_of_GW = GW_end - GW_start + 1
    
    dict_with_team_ids_to_team_name = dict()
    for team in data:
        # print(team.team_id, data)
        dict_with_team_ids_to_team_name[team.team_id] = team.team_name

    # ids for the teams that must be in the solution
    ids_must_be_in_solution = []
    for team in teams_in_solution:
        ids_must_be_in_solution.append(dict_with_team_name_to_team_ids[team])

    # ids for the teams that cannot be in the solution
    ids_must_not_be_in_solution = []
    for team in teams_not_in_solution:
        ids_must_be_in_solution.append(dict_with_team_name_to_team_ids[team])

    if one_double_up:
        # allow combinations with one double up from one team
        unique_team_ids = [[*comb] for comb in combinations(team_ids, teams_to_check - 1) if
                           all(elem in [*comb] for elem in ids_must_be_in_solution)]
        temp_unique_team_ids = []
        for unique_team_id in unique_team_ids:
            for id in team_ids:
                temp_unique_team_ids.append(unique_team_id + [id])
        unique_team_ids = temp_unique_team_ids

    if not one_double_up:
        # create unique team combos
        unique_team_ids = [[*comb] for comb in combinations(team_ids, teams_to_check) if
                           all(elem in [*comb] for elem in ids_must_be_in_solution)]

    # remove all combinations where teams from teams_not_in_solution exists
    temp_unique_team_ids = []
    for comb in unique_team_ids:
        if len([i for i in comb if i in ids_must_not_be_in_solution]) == 0:
            temp_unique_team_ids.append(comb)
    unique_team_ids = temp_unique_team_ids

    combos_with_score_new = []
    for team_combos in unique_team_ids:
        # team_combos = [1, 3]
        team_total_score = 0
        team_total_score_new = 0
        extra_fixtures = 0
        home_games = 0
        two_D_list_new = create_two_dim_list(len(team_combos), number_of_GW)
        for GW_idx, GW in enumerate(range(number_of_GW)):
            GW_home_scores_new = []
            GW_scores_new = []
            for team_idx, team_id in enumerate(team_combos):
                team_name = dict_with_team_ids_to_team_name[team_id]
                temp_team_data_dict = create_FDR_dict(data[int(team_id - 1)], 10)
                data_gw = temp_team_data_dict[GW + GW_start]
                gws_this_round = len(data_gw)
                temp_score = 0
                team_object_new = []
                if gws_this_round > 1:
                    for i in range(gws_this_round):
                        temp_score += data_gw[i][2]
                        team_object_new.append(FixtureDifficultyInfo(team_name=team_name,
                                                                     opponent_team_name=data_gw[i][0].upper(),
                                                                     this_difficulty_score=data_gw[i][2],
                                                                     H_A=data_gw[i][1],
                                                                     Use_Not_Use=0).toJson())
                else:
                    temp_score += data_gw[0][2]
                    team_object_new.append(FixtureDifficultyInfo(team_name=team_name,
                                                                 opponent_team_name=data_gw[0][0].upper(),
                                                                 this_difficulty_score=data_gw[0][2],
                                                                 H_A=data_gw[0][1],
                                                                 Use_Not_Use=0).toJson())
                temp_score = temp_score / gws_this_round ** 2
                GW_scores_new.append(temp_score)
                two_D_list_new[team_idx][GW_idx] = team_object_new
                H_A = 1
                # fix this for later feature regarding h_a advantage
                GW_home_scores_new.append([temp_score, H_A])
            
            

            Use_Not_Use_idx = np.array(GW_scores_new).argsort()[:teams_to_play]
            for k in Use_Not_Use_idx:
                load_json_temp = json.loads(two_D_list_new[k][GW_idx][0])
                load_json_temp["Use_Not_Use"] = 1
                two_D_list_new[k][GW_idx][0] = json.dumps(load_json_temp)
                # two_D_list_new[k][GW_idx][0].Use_Not_Use = 1

            sorted_scores_new = np.array(sorted(GW_home_scores_new, key=lambda l: l[0], reverse=False))
            team_total_score_new += np.sum(sorted_scores_new[:teams_to_play, 0])
            
            # if there are more good games than
            if include_extra_good_games:
                if teams_to_play < len(team_combos):
                    extra_scores = sorted_scores_new[teams_to_play:, 0]
                    for extra_score in extra_scores:
                        if extra_score <= 2.9:
                            team_total_score -= 0.1
                            extra_fixtures += 1

        combo_names = []

        for team_id in team_combos:
            combo_names.append(dict_with_team_ids_to_team_name[team_id])
        
        
        combos_with_score_new.append(
            [round(team_total_score_new / number_of_GW / teams_to_play, 4), team_combos, combo_names, extra_fixtures,
             home_games, two_D_list_new])


    # sort all the combos by the team_total_score. Best fixture will be first element and so on.
    insertion_sort(combos_with_score_new, len(combos_with_score_new), element_to_sort=0, min_max="min")
    
    combos_with_score_json = []

    for team in combos_with_score_new:
        team1 = [ str(i) for i in team[1]]
        combos_with_score_json.append(RotationPlannerTeamInfo(team[0], team1, team[2], team[3], team[4], team[5]).toJson())

    return combos_with_score_json


def compute_best_fixtures_one_team(df, gw_start, gw_end, team_idx, min_length):
    """
    Find best gameweek region with respect to fixture values between GW_start and GW_end with a lenght
    >= min_length.
    :param df: dataframe with fixture data. create_data_frame()
    :param GW_start: first GW to count. GW_start > 0. (1)
    :param GW_end: last GW to count. GW_start <= GW_end <= 38 (38)
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


def find_best_fixture_with_min_length_each_teamElitserien(data, gw_start, gw_end, min_length=5):
    best_fixtures_min_length = []
    for team_id in range(len(data)):
        info = compute_best_fixtures_one_team_db_data(data, gw_start, gw_end, team_id + 1, min_length, toJson=False)
        best_fixtures_min_length.append(info)
    return best_fixtures_min_length


def create_FDR_dict(fdr_data, blank_score=10):
    num_gws = len(fdr_data.gw)
    new_dict = {new_list: [] for new_list in range(max(fdr_data.gw) + 1)}
    for gw, H_A, opponent, FDR in zip(fdr_data.gw, fdr_data.oppTeamHomeAwayList, fdr_data.oppTeamNameList, fdr_data.oppTeamDifficultyScore):
        new_dict[gw].append([opponent, H_A, FDR])
    for i in range(1, max(fdr_data.gw) + 1):
        if not new_dict[i]:
            new_dict[i] = [['-', ' ', blank_score]]
    return new_dict




