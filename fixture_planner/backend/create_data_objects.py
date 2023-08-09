from fixture_planner.backend.read_fixture_planner_data import get_static_and_fixture_data
from utils.dataFetch.Players import Players
import pandas as pd


def create_dict_with_team_ids_to_team_name(fixtures, name_or_short_name="name"):
    fpl_info = pd.DataFrame(fixtures)
    return dict(zip(fpl_info['id'], fpl_info[name_or_short_name]))


def create_dict_with_team_name_to_team_ids(fixtures, name_or_short_name="name"):
    fpl_info = pd.DataFrame(fixtures)
    return dict(zip(fpl_info[name_or_short_name], fpl_info['id']))


def create_list_with_team_ids_from_list_with_team_names(f, team_names_list):
    team_id_list = []
    dict = create_dict_with_team_name_to_team_ids(f, name_or_short_name="name")
    for team_name in team_names_list:
        team_id_list.append(dict[team_name])
    return team_id_list


def create_team_list(api_local="local"):
    static, fixture_info = get_static_and_fixture_data(api_local)
    player_info = static['elements']
    players = Players(player_info, fixture_info)
    team_list = players.create_all_teams()  # list teams, where Arsenal = team_list[0], ... Wolves = team_list[-1]
    dict_team_id_to_team_name = create_dict_with_team_ids_to_team_name(static['teams'], "name")
    for team_id in range(len(team_list)):
        team_list[team_id].team = dict_team_id_to_team_name[team_id + 1]
    # the list index is also the same as the team id minus 1. Arsenal = id=1 - 1, ...
    return team_list


def create_data_frame(api_local="local"):
    """
    create dataframe with fixture information.
    Rows: Team_id - 1
    Columns: Team (team name) 1 (GW number) 2 3 4 5
    :return:             Team            1            2   ...           38
            0          Arsenal  [FUL, A, 2]  [WHU, H, 2]  ...  [BHA, H, 2]
            1      Aston Villa  [MCI, A, 0]  [SHU, H, 3]  ...  [CHE, H, 3]

    """
    static, fixture = get_static_and_fixture_data(api_local)
    team_list = create_team_list(api_local)
    number_of_PL_teams = len(team_list)
    columns = [str(i) for i in range(0, len(team_list[0].fixtures_df.index) + 1)]
    columns[0] = 'Team'
    data = []
    dict_team_id_to_name = create_dict_with_team_ids_to_team_name(static['teams'], name_or_short_name="short_name")
    for gameweek in range(number_of_PL_teams):
        team_info = team_list[gameweek]
        temp_data = [team_info.team]
        for team_idx in range(len(columns) - 1):
            index_opp = team_info.fixtures_df['opponent_team'].index[team_idx]
            index_ah = team_info.fixtures_df['H/A'].index[team_idx]
            index_diff = team_info.fixtures_df['difficulty'].index[team_idx]
            index_gw = team_info.fixtures_df['gameweek'].index[team_idx]
            opp = team_info.fixtures_df['opponent_team'][index_opp]
            ah = team_info.fixtures_df['H/A'][index_ah]
            diff = team_info.fixtures_df['difficulty'][index_diff]
            gw = team_info.fixtures_df['gameweek'][index_gw]
            temp_data.append([dict_team_id_to_name[opp], ah, diff, int(gw)])
        data.append(temp_data)
    return pd.DataFrame(data=data, columns=columns)


def return_fixture_names_shortnames(api_local="local"):
    df = create_data_frame(api_local)
    static, fixture = get_static_and_fixture_data(api_local)
    names = pd.DataFrame(static['teams'])['name']
    short_names = pd.DataFrame(static['teams'])['short_name']
    ids = pd.DataFrame(static['teams'])['id']
    return df, names, short_names, ids


def create_FDR_dict(fdr_data, blank_score=10, home_away_adjustment=0):
    num_gws = len(fdr_data.gw)
    new_dict = {new_list: [] for new_list in range(num_gws + 1)}
    for gw, H_A, opponent, FDR in zip(fdr_data.gw, fdr_data.oppTeamHomeAwayList, fdr_data.oppTeamNameList, fdr_data.oppTeamDifficultyScore):
        FDR = FDR + (-1 if H_A == "H" else 1) * home_away_adjustment
        
        new_dict[gw].append([opponent, H_A, FDR])
    for i in range(1, num_gws + 1):
        if not new_dict[i]:
            new_dict[i] = [['-', ' ', blank_score]]
    return new_dict