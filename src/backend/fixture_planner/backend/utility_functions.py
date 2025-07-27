import numpy as np


def insertion_sort(A, size, element_to_sort, min_max="min"):
    """
    Sort a 2D list with respect to one of the element_idx.
    :param A: List of all combinations of team with total fdr score.
    [2.8333, [1, 2], ['Arsenal', 'Aston Villa'], 0, 0,
    [[['{"team_name": "Arsenal", "opponent_team_name": "AVL", "difficulty_score": 3, "H_A": "H", "Use_Not_Use": 1}'], ... ]]]
    :param size:
    :param element_to_sort: 0 / -1 (score / score divided by fixtures)
    :param min_max: sort on minimum or maximum values ("min" or "max")
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


def create_two_dim_list(row, col):
    """
    Create two dimensional list of size row x col
    :param row: number of rows in two dim list
    :param col: number of columns in two dim list
    :return: empty two dimensional list of size row x col
    """
    two_dim_list = []
    for i in range(0, row):
        new = []
        for j in range(0, col):
            new.append(0)
        two_dim_list.append(new)
    return two_dim_list


def fixture_score_one_team(df, team_idx, gw_start, gw_end):
    """
    return fixture score for one team with team_id from GW_start to GW_end.
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
    return np.array([round(score, 2), team, upcoming_fixtures, upcoming_fixtures_score, gw_start, gw_end, blanks,
                     round(score / number_of_fixtures, 3), home_away], dtype=object)


def calc_score(fdr_dict, gw_start, gw_end):
    """
    Calculate fdr score for one team between gw_start and gw_end.
    :param fdr_dict: dict where keys are gw number and values are list of opponent name, home/away and fdr score.
     {0: [], 1: [['LEI', 'A', 3]], 2: [['TOT', 'H', 3]], 3: [['MUN', 'H', 4]], 4: [['WAT', 'A', 2], ['LIV', 'H', 4]], ... }
    :param gw_start: first gameweek (1-38)
    :param gw_end: last gameweek (1-38)
    :return: FDR score for a team between gw_start and gw_end (12)
    """
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


def calc_score_from_list(fdr_dict, gw_list):
    """
    Calculate fdr score for one team between gw_start and gw_end.
    :param fdr_dict: dict where keys are gw number and values are list of opponent name, home/away and fdr score.
     {0: [], 1: [['LEI', 'A', 3]], 2: [['TOT', 'H', 3]], 3: [['MUN', 'H', 4]], 4: [['WAT', 'A', 2], ['LIV', 'H', 4]], ... }
    :param gw_start: first gameweek (1-38)
    :param gw_end: last gameweek (1-38)
    :return: FDR score for a team between gw_start and gw_end (12)
    """
    score = 0
    for gw in gw_list:
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

