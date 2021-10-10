import json
import numpy as np
import pandas as pd
from itertools import combinations


def create_dict_with_team_ids_to_team_name(fixtures, name_or_short_name="name"):
    # fpl_info = pd.DataFrame(DataFetch().get_current_fpl_info()['teams'])
    fpl_info = pd.DataFrame(fixtures)
    return dict(zip(fpl_info['id'], fpl_info[name_or_short_name]))


def create_dict_with_team_name_to_team_ids(fixtures, name_or_short_name="name"):
    # fpl_info = pd.DataFrame(DataFetch().get_current_fpl_info()['teams'])
    fpl_info = pd.DataFrame(fixtures)
    return dict(zip(fpl_info[name_or_short_name], fpl_info['id']))


def create_data_frame_Eliteserien():
    df = pd.read_excel(r'stored_data/eliteserien/Eliteserien_fixtures.xlsx', engine='openpyxl')
    num_rows = len(df.index)
    num_cols = len(df.columns)
    data = []
    for row in range(1, num_rows):
        gws, oppTeamHomeAwayList, oppTeamNameList, oppTeamDifficultyScore = [], [], [], []
        for col in range(1, num_cols):
            value = df[col][row].split(",")
            df[col][row] = [value[0], value[1], int(value[2])]
            gws.append(col)
            oppTeamHomeAwayList.append(value[1])
            oppTeamNameList.append(value[0])
            oppTeamDifficultyScore.append(int(value[2]))
        data.append(fdr_eliteserien(gws, oppTeamHomeAwayList, oppTeamNameList, oppTeamDifficultyScore))

    return df, data


def fixture_score_one_team(df, team_idx, GW_start, GW_end):
    """
    return fixture score for one team with team_id = team_idx from GW_start to GW_end.
    :param df: dataframe with fixture info (create_data_frame())
    :param team_idx: team_id + 1
    :param GW_start: first GW
    :param GW_end: last GW
    :return: np.array with length 8. [score, team name, opponents, fixture difficulty, GW_start, GW_end, score / number_of_fixtures]
    [31 'Arsenal' array(['ful', 'WHU', 'liv', 'SHU', 'mci', 'LEI', 'mun', 'AVL', 'lee', 'WOL'], dtype=object)
    array([2, 2, 5, 3, 5, 3, 4, 2, 2, 3]) 1 10 3.1]
    """
    score = 0
    team_idx = team_idx - 1
    team = df.loc[team_idx][0]
    number_of_fixtures = GW_end - GW_start + 1
    upcoming_fixtures = np.empty(number_of_fixtures, dtype=object)
    home_away = np.empty(number_of_fixtures, dtype=int)
    upcoming_fixtures_score = np.empty(number_of_fixtures, dtype=float)
    blanks = []
    if GW_start < 1:
        print("GW_start must be larger than 0")
        return -1
    if GW_end > 38:
        print("GW_end must be smaller than 38")
        return -1
    for i in range(GW_start - 1, GW_end):
        add_score = float(df.loc[team_idx][1:][i][2])
        if add_score == 0:
            number_of_fixtures -= 1
            blanks.append(i + 1)
        score += add_score
        if df.loc[team_idx][1:][i][1] == 'A':
            upcoming_fixtures[i - GW_start + 1] = df.loc[team_idx][1:][i][0].lower()
            home_away[i - GW_start + 1] = 0
        if df.loc[team_idx][1:][i][1] == 'H':
            upcoming_fixtures[i - GW_start + 1] = df.loc[team_idx][1:][i][0].upper()
            home_away[i - GW_start + 1] = 1
        upcoming_fixtures_score[i - GW_start + 1] = float(df.loc[team_idx][1:][i][2])
    return np.array([round(score, 2), team, upcoming_fixtures, upcoming_fixtures_score, GW_start, GW_end, blanks, round(score / number_of_fixtures, 3), home_away], dtype=object)


def create_list_with_team_ids_from_list_with_team_names(f, team_names_list):
    team_id_list = []
    dict2 = create_dict_with_team_name_to_team_ids(f, name_or_short_name="name")
    for team_name in team_names_list:
        team_id_list.append(dict2[team_name])
    return team_id_list


def insertion_sort(A, size, element_to_sort, min_max="min"):
    """
    Sort a 2D list with respect to one of the element_idx
    :param A:
    :param size:
    :param element_to_sort: 0 / -1 (score / score divided by fixtures
    :return:
    """
    # sort an array according to its fixture score
    if min_max == "min":
        for i in range(size - 1):
            score = A[i + 1][element_to_sort]
            team_array = A[i + 1]
            while i >= 0 and A[i][element_to_sort] > score:
                A[i + 1] = A[i]
                i = i - 1
            A[i + 1] = team_array
    else:
        for i in range(size - 1):
            score = A[i + 1][element_to_sort]
            team_array = A[i + 1]
            while i >= 0 and A[i][element_to_sort] < score:
                A[i + 1] = A[i]
                i = i - 1
            A[i + 1] = team_array
    return A


class FDR_team:
    """
        Class of a team
    """
    def __init__(self, team_name, opponent_team_name_short, FDR, H_A, Use_Not_Use):
        """
            Initialize object
        """
        self.team_name = team_name
        self.opponent_team_name = opponent_team_name_short
        self.difficulty_score = int(FDR)
        self.H_A = H_A
        self.Use_Not_Use = Use_Not_Use



def two_D_list(row, col):
    twod_list = []
    for i in range (0, row):
        new = []
        for j in range (0, col):
            new.append(0)
        twod_list.append(new)
    return twod_list



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

    # create fixture dataframe. Each element: ['ARS', 'H', 3]
    # df = create_data_frame()

    # adjust the fixture difficulty
    #if home_away_adjustment > 0:
        #df = adjust_df_for_home_away(df, home_advantage=home_away_adjustment)

    #if top_teams_adjustment:
        #df = adjust_df_for_difficult_teams(df)


    dict_with_team_name_to_team_ids = dict()
    for team in data:
        dict_with_team_name_to_team_ids[str(team.team_name)] = team.team_id

    team_ids = []

    for team_name in team_names:
        if team_name == -1:
            number_of_teams = 16 # originaly df.shape[0]
            team_ids = np.arange(1, number_of_teams + 1)
            break
        team_id = dict_with_team_name_to_team_ids[team_name]
        team_ids.append(team_id)

    number_of_GW = GW_end - GW_start + 1

    dict_with_team_ids_to_team_name = dict()
    for team in data:
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
        two_D_list_new = two_D_list(len(team_combos), number_of_GW)
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
                        team_object_new.append(FDR_team(team_name, data_gw[i][0].upper(),
                                                        data_gw[i][2], data_gw[i][1], 0))
                else:
                    temp_score += data_gw[0][2]
                    team_object_new.append(FDR_team(team_name, data_gw[0][0].upper(),
                                           data_gw[0][2], data_gw[0][1], 0))
                temp_score = temp_score / gws_this_round ** 2
                GW_scores_new.append(temp_score)
                two_D_list_new[team_idx][GW_idx] = team_object_new
                H_A = 1
                # fix this for later feature regarding h_a advantage
                GW_home_scores_new.append([temp_score, H_A])

            Use_Not_Use_idx = np.array(GW_scores_new).argsort()[:teams_to_play]
            for k in Use_Not_Use_idx:
                two_D_list_new[k][GW_idx][0].Use_Not_Use = 1

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

    return combos_with_score_new


def compute_best_fixtures_one_team(df, GW_start, GW_end, team_idx, min_length):
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
    if min_length > (GW_end-GW_start+1):
        print('min_length: must be smaller than GW_end - GW_start + 1')
        return -1
    max_info = fixture_score_one_team(df, team_idx, GW_start, GW_end)
    ii, jj, length = GW_start, GW_end, len(max_info[2])
    max_score = max_info[0] / (GW_end - GW_start + 1)
    for i in range(GW_end - GW_start + 1):
        for j in range(i + min_length - 1, GW_end - GW_start + 1):
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



def find_best_fixture_with_min_length_each_teamElitserien(data, GW_start, GW_end, min_length=5):
    best_fixtures_min_length = []
    for team_id in range(len(data)):
        info = compute_best_fixtures_one_team_db_data(data, GW_start, GW_end, team_id + 1, min_length)
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


class fdr_eliteserien:
    """
        Class of a team
    """

    def __init__(self, gws, oppTeamHomeAwayList, oppTeamNameList, oppTeamDifficultyScore):
        """
            Initialize object
        """
        self.gw = gws
        self.oppTeamHomeAwayList = oppTeamHomeAwayList
        self.oppTeamNameList = oppTeamNameList
        self.oppTeamDifficultyScore = oppTeamDifficultyScore



def calc_score(fdr_dict, gw_start, gw_end):
    score = 0
    for gw in range(gw_start, gw_end + 1):
        data = fdr_dict[gw]
        gws_this_round = len(data)
        temp_score = 0
        if gws_this_round > 1:
            for i in range(gws_this_round):
                temp_score += data[i][2]
        else:
            temp_score += data[0][2]
        score += temp_score / gws_this_round ** 2
    return score


def compute_best_fixtures_one_team_db_data(data, GW_start, GW_end, team_idx, min_length):
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
    if min_length > (GW_end-GW_start+1):
        print('min_length: must be smaller than GW_end - GW_start + 1')
        return -1
    fdr_dict = create_FDR_dict(data[team_idx - 1])
    number_of_gameweeks = GW_end - GW_start + 1
    ii, jj, length = GW_start, GW_end, number_of_gameweeks
    max_score = calc_score(fdr_dict, GW_start, GW_end) / (GW_end - GW_start + 1)
    for i in range(GW_start, GW_end + 1):
        for j in range(i + min_length - 1, GW_end + 1):
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
    for gw in range(GW_start, GW_end + 1):
        gw_fixtures = fdr_dict[gw]
        temp_list = []
        good_gw = 0
        if gw >= ii and gw <= jj:
            good_gw = 1
        for gw_fixture in gw_fixtures:
            temp_list.append([FDR_team(data[team_idx - 1].team_name, gw_fixture[0].upper(),
                                       gw_fixture[2], gw_fixture[1], good_gw)])
        fixture_list.append(temp_list)
    return fixture_list


