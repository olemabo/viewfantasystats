from utils.utility_functions import get_static_json_data
from constants import premier_league_api_url


def get_ids(use_api_or_local, api_url=premier_league_api_url):
    """
        Extract and return a list of all fpl player ids
    """
    static_info = get_static_json_data(use_api_or_local, api_url)['elements']
    ids = []
    for info in static_info:
        status = info['status']
        if status != "u":
            ids.append(info['id'])

    return ids


def static_json(use_api_or_local="local", api_url=premier_league_api_url):
    """
        return all relevant player stats in a dict (key = player_id)
    """
    static_info = get_static_json_data(use_api_or_local, api_url)
    elements = static_info['elements']
    player_dict = dict()

    for player in elements:
        player_dict[player['id']] = [
            player['first_name'], # 0
            player['second_name'], # 1
            player['element_type'], # 2
            player['chance_of_playing_this_round'], # 3
            player['now_cost'], # 4
            player['points_per_game'], # 5
            player['selected_by_percent'], # 6
            player['total_points'], # 7
            player['minutes'], # 8
            player['goals_scored'], # 9
            player['assists'], # 10
            player['clean_sheets'], # 11
            player['goals_conceded'], # 12
            player['own_goals'], # 13
            player['penalties_saved'], # 14
            player['penalties_missed'], # 15
            player['yellow_cards'], # 16
            player['red_cards'], # 17
            player['saves'], # 18
            player['bonus'], # 19
            player['bps'] if api_url == premier_league_api_url else 0, # 20
            player['influence'] if api_url == premier_league_api_url else 0, # 21
            player['creativity'] if api_url == premier_league_api_url else 0, # 22
            player['threat'] if api_url == premier_league_api_url else 0, # 23
            player['ict_index'] if api_url == premier_league_api_url else 0, # 24
            player['influence_rank'] if api_url == premier_league_api_url else 0, # 25
            player['influence_rank_type'] if api_url == premier_league_api_url else 0, # 26
            player['creativity_rank'] if api_url == premier_league_api_url else 0, # 27
            player['creativity_rank_type'] if api_url == premier_league_api_url else 0, # 28
            player['threat_rank'] if api_url == premier_league_api_url else 0, # 29
            player['threat_rank_type'] if api_url == premier_league_api_url else 0, # 30
            player['ict_index_rank'] if api_url == premier_league_api_url else 0, # 31
            player['ict_index_rank_type'] if api_url == premier_league_api_url else 0, # 32
            player['transfers_in'], # 33
            player['transfers_out'], # 34
            player['team'], # 35
            player['web_name'], # 36 
            player['expected_goals'] if api_url == premier_league_api_url else 0, # 37
            player['expected_goals_per_90'] if api_url == premier_league_api_url else 0, # 38
            player['expected_assists'] if api_url == premier_league_api_url else 0, # 39
            player['expected_assists_per_90'] if api_url == premier_league_api_url else 0, # 40
            player['expected_goal_involvements'] if api_url == premier_league_api_url else 0, # 41
            player['expected_goal_involvements_per_90'] if api_url == premier_league_api_url else 0, # 42
            player['expected_goals_conceded'] if api_url == premier_league_api_url else 0, # 43
            player['expected_goals_conceded_per_90'] if api_url == premier_league_api_url else 0, # 44
            player['goals_conceded_per_90'] if api_url == premier_league_api_url else 0, # 45
            player['saves_per_90'] if api_url == premier_league_api_url else 0, # 46
        ]

    return player_dict