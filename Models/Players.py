from Models.Fixtures import Fixtures
from Models.Team import Team

import pandas as pd


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