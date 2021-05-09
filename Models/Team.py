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