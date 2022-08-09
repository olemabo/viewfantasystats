from fixture_planner.backend.create_data_objects import create_FDR_dict
from fixture_planner.backend.utility_functions import insertion_sort, create_two_dim_list
from utils.models.fixtures.FixtureDifficultyModel import FixtureDifficultyModel
from fixture_planner.models import PremierLeagueTeamInfo
from constants import blank_gw_fdr_score
from itertools import combinations
import numpy as np
import json

from utils.models.RotationPlannerTeamInfo import RotationPlannerTeamInfo

from fixture_planner.models import KickOffTime
from constants import total_number_of_gameweeks
from utils.models.DataFetch import DataFetch
from datetime import date
import pandas as pd

def convert_list_with_strings_to_floats(list_of_strings):
    """
    Convert list of strings to list of floats
    :param list_of_strings: List of numbers of strings (["1", "12"])
    :return: list of floats ([1.0, 12.0])
    """
    return [float(str_i) for str_i in list_of_strings]


def get_list_of_all_pl_team_names():
    """
    Extract all pl team names from PremierLeagueTeamInfo db
    :return: a list of all pl team names
    """
    fixture_list_db = PremierLeagueTeamInfo.objects.all()
    return [team.team_name for team in fixture_list_db]


def get_static_json_data(use_api_or_local):
    """
        Use either local extract json data or fpl api to load data from https://fantasy.premierleague.com/api/bootstrap-static/
    """
    if use_api_or_local == "api":
        return DataFetch().get_current_fpl_info()
    else:
        with open('stored_data/static_json/static.json', encoding='utf-8') as json_static:
            return json.load(json_static)


def get_current_gw():
    """
    Find out which is the current gw. Extract kick off times from KickOffTime and compares with current date
    :return: current gameweek (int: 1)
    """
    # find current gw
    today_date = date.today()
    kick_off_time_db = KickOffTime.objects.filter(gameweek__range=(0, 38))
    for i in range(len(kick_off_time_db)):
        current_gw = i + 1
        dates = kick_off_time_db[i].kickoff_time.split("T")[0].split("-")
        gw_i_date = date(int(dates[0]), int(dates[1]), int(dates[2]))
        if gw_i_date > today_date:
            return current_gw
    return 1


def create_dict_with_team_ids_to_team_name_and_team_name_to_ids_from_db(fixture_list_db):
    team_names = [team_model.team_name for team_model in fixture_list_db]
    team_ids = [team_model.team_id for team_model in fixture_list_db]
    return dict(zip(team_ids, team_names)), dict(zip(team_names, team_ids))


def create_list_with_team_ids_from_list_with_team_names(fixture_list_db, team_names_list):
    team_names = [team_model.team_name for team_model in fixture_list_db]
    team_ids = [team_model.team_id for team_model in fixture_list_db]
    team_name_to_team_ids_dict = dict(zip(team_names, team_ids))
    team_id_list = []
    for team_name in team_names_list:
        team_id_list.append(team_name_to_team_ids_dict[team_name])
    return team_id_list


def return_fixture_names_shortnames(fixture_list_db):
    team_names = [team_model.team_name for team_model in fixture_list_db]
    team_short_names = [team_model.team_short_name for team_model in fixture_list_db]
    team_ids = [team_model.team_id for team_model in fixture_list_db]

    columns = [str(i) for i in range(0, total_number_of_gameweeks + 1)]
    columns[0] = 'Team'

    data = []
    for team_i_info in fixture_list_db:
        temp_data = [team_i_info.team_name]
        for gw_i, team_i_name_short, team_i_h_a, team_i_difficulty in zip(team_i_info.gw, team_i_info.oppTeamNameList, team_i_info.oppTeamHomeAwayList, team_i_info.oppTeamDifficultyScore):

            temp_data.append([team_i_name_short, team_i_h_a, team_i_difficulty, int(gw_i)])
        data.append(temp_data)

    return pd.DataFrame(data=data, columns=columns), pd.DataFrame(team_names), pd.DataFrame(team_short_names), pd.DataFrame(team_ids)


def find_best_rotation_combos_new(data, gw_start, gw_end, teams_to_check=5, teams_to_play=3, team_names=[-1],
                              teams_in_solution=[], teams_not_in_solution=[],
                              top_teams_adjustment=False, one_double_up=False, home_away_adjustment=True,
                              include_extra_good_games=False):
    """
    Find the best rotation combo for "teams_to_check" number of team where "team_to_play" number of them must play each gw.
    :param gw_start: start count from this gw
    :param gw_end: end counting in this gw
    :param teams_to_check: how many teams to check (1-5)
    :param teams_to_play: how many of the teams_to_check you want to play in each gw. ( team_to_play < teams_to_check)
    teams_to_check = 5 and teams_to_play = 3 will give the best 5 teams to use in your team if you must use at least 3 each round
    :param team_names: which teams to check from. ([-1]: all teams, ["Arsenal", "Spurs"]: check only some teams)
    :param teams_in_solution: ["Liverpool"]: liverpool must be in the optimal solution. []: no extra dependencies.
    :param home_away_adjustment: wheter to give home/away match score -/+ 0.1 points. Default=true
    :param num_to_print: how many of the best results to print to screen
    :return: combos_with_score [[score, [team_ids], [team_names]], ... ]   ([22.2, [1, 4, 11], ['Arsenal', 'Burnley', 'Liverpool']])
    """
    # validate input
    if validate_input(team_names, teams_to_check, teams_to_play, teams_in_solution, one_double_up) != "Ok":
        return -1

    number_of_gws = gw_end - gw_start + 1

    # adjust the fixture difficulty TODO: Implement adjust fixture difficulty

    # get all fixture data from db
    fixture_list_db = PremierLeagueTeamInfo.objects.all()

    # create fixture dataframe. Each element: ['ARS', 'H', 3]
    df, names, short_names, ids = return_fixture_names_shortnames(fixture_list_db)

    dict_with_team_ids_to_team_name, dict_with_team_name_to_team_ids = \
        create_dict_with_team_ids_to_team_name_and_team_name_to_ids_from_db(fixture_list_db)

    team_ids = []
    for team_name in team_names:
        if team_name == -1:
            number_of_teams = df.shape[0]
            team_ids = np.arange(1, number_of_teams + 1)
            break
        team_id = dict_with_team_name_to_team_ids[team_name]
        team_ids.append(team_id)

    dict_team_id_to_fixtures = {}
    dict_team_id_to_home_away = {}
    dict_team_id_to_opponent = {}

    for idx, team_id in enumerate(team_ids):
        info = fixture_score_one_team(df, team_id, gw_start, gw_end)[3]
        info[info == 0] = blank_gw_fdr_score
        dict_team_id_to_fixtures[team_id] = info
        dict_team_id_to_home_away[team_id] = fixture_score_one_team(df, team_id, gw_start, gw_end)[8]
        dict_team_id_to_opponent[team_id] = fixture_score_one_team(df, team_id, gw_start, gw_end)[2]

    ids_must_be_in_solution = create_list_with_team_ids_from_list_with_team_names(fixture_list_db, teams_in_solution)
    ids_must_not_be_in_solution = create_list_with_team_ids_from_list_with_team_names(fixture_list_db, teams_not_in_solution)

    if one_double_up:
        # allow combinations with one double up from one team
        unique_team_ids = [[*comb] for comb in combinations(team_ids, teams_to_check - 1) if
                           all(elem in [*comb] for elem in ids_must_be_in_solution)]
        temp_unique_team_ids = []
        for unique_team_id in unique_team_ids:
            for team_id in team_ids:
                temp_unique_team_ids.append(unique_team_id + [team_id])
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
        extra_fixtures = 0
        home_games = 0
        two_D_list_new = create_two_dim_list(len(team_combos), number_of_gws)
        for GW_idx, GW in enumerate(range(number_of_gws)):
            GW_home_scores_new = []
            GW_scores_new = []
            for team_idx, team_id in enumerate(team_combos):
                # team_id = 6
                team_name = dict_with_team_ids_to_team_name[team_id]
                temp_team_data_dict = create_FDR_dict(data[int(team_id - 1)], 10)
                data_gw = temp_team_data_dict[GW + gw_start]
                gws_this_round = len(data_gw)
                temp_score = 0
                team_object_new = []
                if gws_this_round > 1:
                    for i in range(gws_this_round):
                        temp_score += data_gw[i][2]

                        team_object_new.append(FixtureDifficultyModel(team_name=team_name,
                                                                     opponent_team_name=data_gw[i][0].upper(),
                                                                     this_difficulty_score=data_gw[i][2],
                                                                     H_A=data_gw[i][1],
                                                                     Use_Not_Use=0).toJson())
                else:
                    temp_score += data_gw[0][2]
                    team_object_new.append(FixtureDifficultyModel(team_name=team_name,
                                                                 opponent_team_name=data_gw[0][0].upper(),
                                                                 this_difficulty_score=data_gw[0][2],
                                                                 H_A=data_gw[0][1],
                                                                 Use_Not_Use=0).toJson())
                temp_score = temp_score / gws_this_round ** 2
                GW_scores_new.append(temp_score)
                two_D_list_new[team_idx][GW_idx] = team_object_new
                H_A = 1
                GW_home_scores_new.append([temp_score, H_A])

            Use_Not_Use_idx = np.array(GW_scores_new).argsort()[:teams_to_play]
            for k in Use_Not_Use_idx:
                load_json_temp = json.loads(two_D_list_new[k][GW_idx][0])
                load_json_temp["Use_Not_Use"] = 1
                two_D_list_new[k][GW_idx][0] = json.dumps(load_json_temp)

            sorted_scores_new = np.array(sorted(GW_home_scores_new, key=lambda l: l[0], reverse=False))
            team_total_score += np.sum(sorted_scores_new[:teams_to_play, 0])

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
            [round(team_total_score / number_of_gws / teams_to_play, 4), team_combos, combo_names,
             extra_fixtures, home_games, two_D_list_new])

    # sort all the combos by the team_total_score. Best fixture will be first element and so on.
    insertion_sort(combos_with_score_new, len(combos_with_score_new), element_to_sort=0, min_max="min")

    combos_with_score_json = []

    for team in combos_with_score_new:
        team1 = [ str(i) for i in team[1]]
        combos_with_score_json.append(RotationPlannerTeamInfo(team[0], team1, team[2], team[3], team[4], team[5]).toJson())

    return combos_with_score_json


def validate_input(team_names, teams_to_check, teams_to_play, teams_in_solution, one_double_up):
    if team_names[0] != -1:
        if teams_to_check > len(team_names):
            return "Teams to check must be >= to number of input teams"

    if teams_to_play > teams_to_check:
        return "Teams to play must be smaller than teams_to_check."

    if len(teams_in_solution) > teams_to_check:
        return "Teams_in_solution must be smaller than teams_to_play."

    if one_double_up:
        if teams_to_check < 2:
            return "Teams to check must be >= 1"

    return "Ok"


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
