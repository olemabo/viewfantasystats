import math
import pandas as pd


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
                    home_matches.at[home_matches.iloc[j].name, 'gameweek'] = 0

                if math.isnan(away):
                    #away_matches.at[away_matches.iloc[j].name, ['gameweek', 'difficulty']] = min(
                    #    away_matches.iloc[j + 1]['gameweek'], home) - 1, 0
                    away_matches.at[away_matches.iloc[j].name, 'gameweek'] = 0

            temp = temp.append(home_matches[final_features])
            temp = temp.append(away_matches[final_features])
            temp = temp.sort_values('gameweek', ascending=True)
            self.list_teams.append(temp)