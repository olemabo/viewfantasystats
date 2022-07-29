from utils.utility_functions import get_static_json_data
from constants import premier_league_api_url

def get_ids(use_api_or_local, api_url=premier_league_api_url):
    """
        Extract and return a list of all fpl player ids
    """
    static_info = get_static_json_data(use_api_or_local, api_url)['elements']
    ids = []
    for info in static_info:
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
        player_dict[player['id']] = [player['first_name'],
                                     player['second_name'],
                                     player['element_type'],
                                     player['chance_of_playing_this_round'],
                                     player['now_cost'],
                                     player['points_per_game'],
                                     player['selected_by_percent'],
                                     player['total_points'],
                                     player['minutes'],
                                     player['goals_scored'],
                                     player['assists'],
                                     player['clean_sheets'],
                                     player['goals_conceded'],
                                     player['own_goals'],
                                     player['penalties_saved'],
                                     player['penalties_missed'],
                                     player['yellow_cards'],
                                     player['red_cards'],
                                     player['saves'],
                                     player['bonus'],
                                     player['bps'] if api_url == premier_league_api_url else 0,
                                     player['influence'] if api_url == premier_league_api_url else 0,
                                     player['creativity'] if api_url == premier_league_api_url else 0,
                                     player['threat'] if api_url == premier_league_api_url else 0,
                                     player['ict_index'] if api_url == premier_league_api_url else 0,
                                     player['influence_rank'] if api_url == premier_league_api_url else 0,
                                     player['influence_rank_type'] if api_url == premier_league_api_url else 0,
                                     player['creativity_rank'] if api_url == premier_league_api_url else 0,
                                     player['creativity_rank_type'] if api_url == premier_league_api_url else 0,
                                     player['threat_rank'] if api_url == premier_league_api_url else 0,
                                     player['threat_rank_type'] if api_url == premier_league_api_url else 0,
                                     player['ict_index_rank'] if api_url == premier_league_api_url else 0,
                                     player['ict_index_rank_type'] if api_url == premier_league_api_url else 0,
                                     player['transfers_in'],
                                     player['transfers_out'],
                                     player['team'],
                                     player['web_name']
                                     ]
    return player_dict




