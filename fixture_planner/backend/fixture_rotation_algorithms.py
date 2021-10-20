from fixture_planner.backend.create_data_objects import return_fixture_names_shortnames, \
    create_dict_with_team_name_to_team_ids, create_dict_with_team_ids_to_team_name, \
    create_list_with_team_ids_from_list_with_team_names, create_FDR_dict
from fixture_planner.backend.utility_functions import insertion_sort, create_two_dim_list
import fixture_planner.backend.read_fixture_planner_data as read_data
from utils.models.FDR_team import FixtureDifficultyInfo
from itertools import combinations
import numpy as np
import json


def find_best_rotation_combos(data, GW_start, GW_end, teams_to_check=5, teams_to_play=3, team_names=[-1],
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

    # create fixture dataframe. Each element: ['ARS', 'H', 3]
    df, names, short_names, ids = return_fixture_names_shortnames()

    # adjust the fixture difficulty
    if home_away_adjustment > 0:
        l = 0
        #df = adjust_df_for_home_away(df, home_advantage=home_away_adjustment)

    if top_teams_adjustment:
        l = 0
        #df = adjust_df_for_difficult_teams(df)

    static, fixture = read_data.get_static_and_fixture_data()
    dict_with_team_name_to_team_ids = create_dict_with_team_name_to_team_ids(static['teams'])

    team_ids = []
    for team_name in team_names:
        if team_name == -1:
            number_of_teams = df.shape[0]
            team_ids = np.arange(1, number_of_teams + 1)
            break
        team_id = dict_with_team_name_to_team_ids[team_name]
        team_ids.append(team_id)

    number_of_GW = GW_end - GW_start + 1

    dict_team_id_to_fixtures = {}
    dict_team_id_to_home_away = {}
    dict_team_id_to_opponent = {}


    for idx, team_id in enumerate(team_ids):
        info = fixture_score_one_team(df, team_id, GW_start, GW_end)[3]
        info[info == 0] = 10
        dict_team_id_to_fixtures[team_id] = info
        dict_team_id_to_home_away[team_id] = fixture_score_one_team(df, team_id, GW_start, GW_end)[8]
        dict_team_id_to_opponent[team_id] = fixture_score_one_team(df, team_id, GW_start, GW_end)[2]




    dict_with_team_ids_to_team_name = create_dict_with_team_ids_to_team_name(static['teams'])

    dict_with_team_ids_to_team_short_name = create_dict_with_team_ids_to_team_name(static['teams'], "short_name")


    if len(teams_in_solution) > 0:
        print("This/these team(s) must be in the solution: ", teams_in_solution, "\n")
    if len(teams_not_in_solution) > 0:
        print("This/these team(s) can not be in the solution: ", teams_not_in_solution, "\n")

    ids_must_be_in_solution = create_list_with_team_ids_from_list_with_team_names(static['teams'], teams_in_solution)
    ids_must_not_be_in_solution = create_list_with_team_ids_from_list_with_team_names(static['teams'], teams_not_in_solution)

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


    combos_with_score = []
    combos_with_score_new = []
    for team_combos in unique_team_ids:
        # team_combos = [1, 3]
        team_total_score = 0
        team_total_score_new = 0
        extra_fixtures = 0
        home_games = 0
        #two_D_lis = two_D_list(len(team_combos), number_of_GW)
        two_D_list_new = create_two_dim_list(len(team_combos), number_of_GW)
        for GW_idx, GW in enumerate(range(number_of_GW)):
            #GW_home_scores = []
            GW_home_scores_new = []
            #GW_scores = []
            GW_scores_new = []
            for team_idx, team_id in enumerate(team_combos):
                # team_id = 6
                #FDR = dict_team_id_to_fixtures[team_id][GW]
                #H_A = dict_team_id_to_home_away[team_id][GW]
                #Opponent = dict_team_id_to_opponent[team_id][GW]
                team_name = dict_with_team_ids_to_team_name[team_id]
                #GW_home_scores.append([FDR, H_A])
                #GW_scores.append(FDR)
                #team_object = FDR_team(team_name, Opponent.upper(),
                #                       FDR, H_A, 0)
                #two_D_lis[team_idx][GW_idx] = team_object
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

            #Use_Not_Use_idx = np.array(GW_scores).argsort()[:teams_to_play]
            #for k in Use_Not_Use_idx:
            #    two_D_lis[k][GW_idx].Use_Not_Use = 1

            Use_Not_Use_idx = np.array(GW_scores_new).argsort()[:teams_to_play]
            for k in Use_Not_Use_idx:
                load_json_temp = json.loads(two_D_list_new[k][GW_idx][0])
                load_json_temp["Use_Not_Use"] = 1
                two_D_list_new[k][GW_idx][0] = json.dumps(load_json_temp)
                #two_D_list_new[k][GW_idx][0].Use_Not_Use = 1

            #print("Argsort: ", np.array(GW_scores).argsort()[:teams_to_play], GW_scores)

            # team_total_score += np.sum(sorted(GW_scores, key=float)[:teams_to_play])
            #sorted_scores = np.array(sorted(GW_home_scores, key=lambda l: l[0], reverse=False))
            #home_games += np.sum(sorted_scores[:teams_to_play, 1])
            #team_total_score += np.sum(sorted_scores[:teams_to_play, 0])

            sorted_scores_new = np.array(sorted(GW_home_scores_new, key=lambda l: l[0], reverse=False))
            team_total_score_new += np.sum(sorted_scores_new[:teams_to_play, 0])

            #print(team_combos, team_total_score, home_games, GW_home_scores, teams_to_play)
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

       # combos_with_score.append(
        #    [round(team_total_score / number_of_GW / teams_to_play, 4), team_combos, combo_names, extra_fixtures,
        #     home_games, two_D_lis])

        combos_with_score_new.append(
            [round(team_total_score_new / number_of_GW / teams_to_play, 4), team_combos, combo_names, extra_fixtures,
             home_games, two_D_list_new])
        #print("HEHEH", combo_names, team_total_score)

    # sort all the combos by the team_total_score. Best fixture will be first element and so on.
    insertion_sort(combos_with_score_new, len(combos_with_score_new), element_to_sort=0, min_max="min")

    return combos_with_score_new


def fixture_score_one_team(df, team_idx, gw_start, gw_end):
    """
    return fixture score for one team with team_id = team_idx from GW_start to GW_end.
    :param df: dataframe with fixture info (create_data_frame())
    :param team_idx: team_id + 1
    :param gw_start: first GW
    :param gw_end: last GW
    :return: np.array with length 8. [score, team name, opponents, fixture difficulty, GW_start, GW_end, score / number_of_fixtures]
    [31 'Arsenal' array(['ful', 'WHU', 'liv', 'SHU', 'mci', 'LEI', 'mun', 'AVL', 'lee', 'WOL'], dtype=object)
    array([2, 2, 5, 3, 5, 3, 4, 2, 2, 3]) 1 10 3.1]
    """
    score = 0
    team_idx = team_idx - 1
    team = df.loc[team_idx][0]
    number_of_fixtures = gw_end - gw_start + 1
    upcoming_fixtures = np.empty(number_of_fixtures, dtype=object)
    home_away = np.empty(number_of_fixtures, dtype=int)
    upcoming_fixtures_score = np.empty(number_of_fixtures, dtype=float)
    blanks = []
    if gw_start < 1:
        print("GW_start must be larger than 0")
        return -1
    if gw_end > 38:
        print("GW_end must be smaller than 38")
        return -1
    for gw_i in range(gw_start - 1, gw_end):
        add_score = float(df.loc[team_idx][1:][gw_i][2])
        if add_score == 0:
            number_of_fixtures -= 1
            blanks.append(gw_i + 1)
        score += add_score
        if df.loc[team_idx][1:][gw_i][1] == 'A':
            upcoming_fixtures[gw_i - gw_start + 1] = df.loc[team_idx][1:][gw_i][0].lower()
            home_away[gw_i - gw_start + 1] = 0
        if df.loc[team_idx][1:][gw_i][1] == 'H':
            upcoming_fixtures[gw_i - gw_start + 1] = df.loc[team_idx][1:][gw_i][0].upper()
            home_away[gw_i - gw_start + 1] = 1
        upcoming_fixtures_score[gw_i - gw_start + 1] = float(df.loc[team_idx][1:][gw_i][2])
    return np.array([round(score, 2), team, upcoming_fixtures, upcoming_fixtures_score, gw_start, gw_end, blanks, round(score / number_of_fixtures, 3), home_away], dtype=object)
