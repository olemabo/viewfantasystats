import json
import pandas as pd
import math
import requests

class Team:
    """
        Class of a team
    """

    def __init__(self, team_id, players_df, fixtures_df):
        """
            Initialize object
        :param team_number: Based on alphabetical order -> Arsenal = 1, ..., Wolves = 20
        :param players_df: DataFrame containing information about the players on the team
        :param fixtures_df: DataFrame providing information about gameweeks, opponents, difficulty and H/A.
        """
        self.team_id = team_id
        self.team = team_id
        self.players_df = players_df
        self.fixtures_df = fixtures_df


class Fixtures:
    """
        Class of Fixtures
    """

    def __init__(self, fixtures_information):
        """
            Initialize object
        :param fixtures_information: list of dictionaries with fixture information
        """
        df = pd.DataFrame(fixtures_information)
        features = ['event', 'team_h', 'team_h_difficulty', 'team_a', 'team_a_difficulty']
        final_features = ['gameweek', 'opponent_team', 'difficulty', 'H/A']
        new_name = {'event': 'gameweek'}
        df = df[features]
        df = df.rename(columns=new_name)
        self.list_teams = []
        # loop through each team and get fixture information
        for i in range(df['team_h'].min(), df['team_h'].max() + 1):
            temp = pd.DataFrame()
            home_matches = df[df['team_h'] == i].copy()
            home_matches.loc[:, 'difficulty'] = home_matches['team_h_difficulty']
            home_matches.loc[:, 'opponent_team'] = home_matches['team_a']
            home_matches.loc[:, 'H/A'] = ['H'] * 19
            away_matches = df[df['team_a'] == i].copy()
            away_matches.loc[:, 'difficulty'] = away_matches['team_a_difficulty']
            away_matches.loc[:, 'opponent_team'] = away_matches['team_h']
            away_matches.loc[:, 'H/A'] = ['A'] * 19
            # this is for postponed matches. Set postponed match difficulty to 0
            for j in range(len(home_matches)):
                home, away = home_matches.iloc[j]['gameweek'], away_matches.iloc[j]['gameweek']
                if math.isnan(home):
                    #home_matches.at[home_matches.iloc[j].name, ['gameweek', 'difficulty']] = min(
                    #    home_matches.iloc[j + 1]['gameweek'], away) - 1, 0
                    home_matches.at[home_matches.iloc[j].name, ['gameweek']] = 0

                if math.isnan(away):
                    #away_matches.at[away_matches.iloc[j].name, ['gameweek', 'difficulty']] = min(
                    #    away_matches.iloc[j + 1]['gameweek'], home) - 1, 0
                    away_matches.at[away_matches.iloc[j].name, ['gameweek']] = 0

            temp = temp.append(home_matches[final_features])
            temp = temp.append(away_matches[final_features])
            temp = temp.sort_values('gameweek', ascending=True)
            self.list_teams.append(temp)

class Players:
    """
        Class of FPL players.
    """

    def __init__(self, information_players, fixtures_information):
        """
            Initialize object
        :param information_players: list of dictionaries with information about players
        :param fixtures_information: list of dictionaries with fixture information
        """
        df = pd.DataFrame(information_players)
        float_columns = ['form', 'points_per_game', 'selected_by_percent']  # ensure float from strings
        df[float_columns] = df[float_columns].astype(float)
        length_news = df['news'].str.len()
        df.loc[:, 'fitness'] = length_news.values == 0  # create boolean for fitness/available players
        new_names = {'web_name': 'name', 'now_cost': 'price', 'selected_by_percent': 'selection',
                     'element_type': 'position'}  # new and better names for columns
        df = df.rename(columns=new_names)
        # decide attributes to keep
        attributes_to_use = ['name', 'price', 'team', 'total_points', 'points_per_game', 'minutes', 'form',
                             'clean_sheets', 'assists', 'goals_scored', 'selection', 'position', 'fitness', 'id']
        self.df = df[attributes_to_use]
        self.fixtures = Fixtures(fixtures_information)

    def get_attribute_from_all_players(self, attribute):
        if attribute not in self.df.keys():
            print(f'Attribute {attribute} does not exist for a player!')
            exit(1)
        return self.df[attribute]

    def create_all_teams(self):
        list_of_teams_df = [x for _, x in self.df.groupby('team')]
        team_list = []
        for i in range(len(list_of_teams_df)):
            team = Team(list_of_teams_df[i]['team'].values[0], list_of_teams_df[i], self.fixtures.list_teams[i])
            team_list.append(team)
        return team_list

    def create_squad(self, list_of_player_names, list_of_player_teams):
        if len(list_of_player_names) != 15:
            print('Not enough players..')
            exit(1)
        df = pd.DataFrame()
        for i in range(len(list_of_player_names)):
            player_name, team_number = list_of_player_names[i], list_of_player_teams[i]
            player_df = self.df.loc[(self.df['name'] == player_name) & (self.df['team'] == team_number)].copy()
            df = df.append(player_df)
        return df


def read_fixture_data_from_fpl_api():
    web_page_fixture_data = 'https://fantasy.premierleague.com/api/fixtures/'
    r = requests.get(web_page_fixture_data)
    return r.json()


def read_static_data_from_fpl_api():
    web_page_static = 'https://fantasy.premierleague.com/api/bootstrap-static/'
    r = requests.get(web_page_static)
    return r.json()


def get_json(api_local="api"):
    if api_local == "local":
        with open('stored_data/static.json', encoding='UTF-8') as json_static:
            static_info = json.load(json_static)
        with open('stored_data/fixture.json', encoding='UTF-8') as json_fixture:
            fixture_info = json.load(json_fixture)
        return static_info, fixture_info

    if api_local == "api":
        static_info = read_static_data_from_fpl_api()
        fixture_info = read_fixture_data_from_fpl_api()

    return static_info, fixture_info

"""
def get_json():
    with open('stored_data/static.json', encoding='UTF-8') as json_static:
        static = json.load(json_static)
    with open('stored_data/fixture.json', encoding='UTF-8') as json_fixture:
        fixture = json.load(json_fixture)
    return static, fixture
"""

def create_dict_with_team_ids_to_team_name(fixtures, name_or_short_name="name"):
    # fpl_info = pd.DataFrame(DataFetch().get_current_fpl_info()['teams'])
    fpl_info = pd.DataFrame(fixtures)
    return dict(zip(fpl_info['id'], fpl_info[name_or_short_name]))


def create_dict_with_team_ids_to_team_name(static_teams, name_or_short_name="name"):
    fpl_info = pd.DataFrame(static_teams)
    return dict(zip(fpl_info['id'], fpl_info[name_or_short_name]))


def create_team_list():
    static, fixture = get_json()
    # a = DataFetch()
    # b = a.get_current_fpl_info()
    b = static
    player_info = b['elements']
    # fixture_info = a.get_current_fixtures()
    fixture_info = fixture
    players = Players(player_info, fixture_info)
    team_list = players.create_all_teams()  # list teams, where Arsenal = team_list[0], ... Wolves = team_list[-1]
    dict_team_id_to_team_name = create_dict_with_team_ids_to_team_name(static['teams'], "name")
    for team_id in range(len(team_list)):
        team_list[team_id].team = dict_team_id_to_team_name[team_id + 1]
    # the list index is also the same as the team id minus 1. Arsenal = id=1 - 1, ...
    return team_list


def create_data_frame():
    """
    create dataframe with fixture information.
    Rows: Team_id - 1
    Columns: Team (team name) 1 (GW number) 2 3 4 5
    :return:             Team            1            2   ...           38
            0          Arsenal  [FUL, A, 2]  [WHU, H, 2]  ...  [BHA, H, 2]
            1      Aston Villa  [MCI, A, 0]  [SHU, H, 3]  ...  [CHE, H, 3]

    """
    static, fixture = get_json()
    team_list = create_team_list()
    number_of_PL_teams = len(team_list)
    columns = [str(i) for i in range(0, len(team_list[0].fixtures_df.index) + 1)]
    columns[0] = 'Team'
    data = []
    temp_team = []
    dict_team_id_to_name = create_dict_with_team_ids_to_team_name(static['teams'], name_or_short_name="short_name")
    for team in range(number_of_PL_teams):
        temp_team.append(team_list[team].team)
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


def return_fixture_names_shortnames():
    df = create_data_frame()
    static, fixture = get_json()
    names = pd.DataFrame(static['teams'])['name']
    short_names = pd.DataFrame(static['teams'])['short_name']
    ids = pd.DataFrame(static['teams'])['id']
    return df, names, short_names, ids


def return_kickofftime():
    with open('stored_data/static.json', encoding="UTF-8") as json_fixture:
        static = json.load(json_fixture)
    kickofftime_info = []
    number_of_gameweeks = len(static['events'])
    month_dict = {'1': 'Jan', '2': "Feb", '3': 'Mar', '4': 'Apr', '5': 'May', '6': 'Jun', '7': 'Jul',
                  '8': 'Aug', '9': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'}
    for gw in range(number_of_gameweeks):
        gw_info = static['events'][gw]
        kickofftime = gw_info['deadline_time']
        month = int(kickofftime.split("-")[1])
        day = str(kickofftime.split("T")[0].split("-")[2])
        kickofftime_short = day + " " + month_dict[str(month)]
        kickofftime_info.append([gw + 1, kickofftime, kickofftime_short])

    return kickofftime_info


