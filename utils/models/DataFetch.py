"""Class used to read data from 'fantasy.premierleague.com', and return or save it """
import json
import requests
import os


# https://medium.com/@bram.vanherle1/fantasy-premier-league-api-authentication-guide-2f7aeb2382e4

class DataFetch:
    def __init__(self) -> None:
        self.web_page = 'https://fantasy.premierleague.com/api/bootstrap-static/'
        self.web_page_fixtures = 'https://fantasy.premierleague.com/api/fixtures/'
        self.web_page_gameweek = 'https://fantasy.premierleague.com/api/event/X/live/'
        self.web_page_individual_player = 'https://fantasy.premierleague.com/api/element-summary/X/'
        self.web_page_league = 'https://fantasy.premierleague.com/api/leagues-classic/X/standings/'
        self.web_page_member_rank = 'https://fantasy.premierleague.com/api/entry/X/history/'
        self.web_page_invidual_team = 'https://fantasy.premierleague.com/api/entry/X/event/Y/picks/'
        self.web_page_cup = 'https://fantasy.premierleague.com/api/entry/X/cup/'
        self.web_page_fpl_player = "https://fantasy.premierleague.com/api/entry/X/"
        self.web_page_latest_transfers = "https://fantasy.premierleague.com/api/entry/X/transfers/"
        self.local_path = 'fpl.json'
        self.global_path = ''
        self.investigate_path()

    def investigate_path(self):
        path = os.path.dirname(os.path.abspath(__file__))
        if not path.split('\\')[-1] == "models":
            print('cannot determine path')
            exit(1)

        self.global_path = path + '/' + self.local_path

    def save_fpl_info(self) -> None:
        r = requests.get(self.web_page)
        jsonResponse = r.json()
        with open(self.global_path, 'w') as outfile:
            json.dump(jsonResponse, outfile)

    def get_saved_fpl_info(self) -> dict:
        with open(self.global_path) as json_data:
            fpl_data = json.load(json_data)
        return fpl_data

    def get_current_fpl_info(self) -> dict:
        r = requests.get(self.web_page)
        # try:
        jsonResponse = r.json()
        return jsonResponse
        # except simplejson.errors.JSONDecodeError:

    def get_current_fixtures(self) -> dict:
        r = requests.get(self.web_page_fixtures)
        jsonResponse = r.json()
        return jsonResponse

    def get_gameweek_info(self, gameweek_number) -> dict:
        r = requests.get(self.web_page_gameweek.replace('X', str(gameweek_number)))
        jsonResponse = r.json()
        return jsonResponse

    def get_current_individual_players(self, player_id) -> dict:
        r = requests.get(self.web_page_individual_player.replace('X', str(player_id)))
        jsonResponse = r.json()
        return jsonResponse

    def get_current_league(self, league_id) -> dict:
        r = requests.get(self.web_page_league.replace('X', str(league_id)))
        jsonResponse = r.json()
        return jsonResponse

    def get_current_member(self, member_id) -> dict:
        r = requests.get(self.web_page_member_rank.replace('X', str(member_id)))
        jsonResponse = r.json()
        return jsonResponse

    def get_current_ind_team(self, member_id, gameweek) -> dict:
        r = requests.get(self.web_page_invidual_team.replace('X', str(member_id)).replace('Y', str(gameweek)))
        jsonResponse = r.json()
        return jsonResponse

    def get_current_cup(self, player_id) -> dict:
        r = requests.get(self.web_page_cup.replace('X', str(player_id)))
        jsonResponse = r.json()
        return jsonResponse

    def get_current_fpl_player(self, player_id) -> dict:
        r = requests.get(self.web_page_fpl_player.replace('X', str(player_id)))
        jsonResponse = r.json()
        return jsonResponse

    def get_current_fpl_transfers(self, member_id) -> dict:
        r = requests.get(self.web_page_latest_transfers.replace('X', str(member_id)))
        jsonResponse = r.json()
        return jsonResponse