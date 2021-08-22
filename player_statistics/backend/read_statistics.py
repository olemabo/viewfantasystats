import json
import matplotlib.pyplot as plt
from player_statistics.models import FPLPlayersModel
import requests
import time


def read_data_from_json(name="Salah"):
    with open('JSON_DATA/Element_Summary/' + str(name) + '.json') as json_static:
        player_info = json.load(json_static)
    return player_info


def read_data_from_fpl_api(player_id):
    web_page_individual_player = 'https://fantasy.premierleague.com/api/element-summary/X/'
    r = requests.get(web_page_individual_player.replace('X', str(player_id)))
    return r.json()


def read_data_static_fpl_api():
    web_page_static = 'https://fantasy.premierleague.com/api/bootstrap-static/'
    r = requests.get(web_page_static)
    return r.json()


def get_ids(api_local):
    if api_local == "local":
        with open('JSON_DATA/static.json', encoding='utf-8') as json_static:
            static_info = json.load(json_static)
    if api_local == "api":
        static_info = read_data_static_fpl_api()
    static_info = static_info['elements']
    ids = []
    for info in static_info:
        ids.append(info['id'])

    return ids


def static_json(api_local="local"):
    if api_local == "local":
        with open('JSON_DATA/static.json', encoding='utf-8') as json_static:
            static_info = json.load(json_static)
    if api_local == "api":
        static_info = read_data_static_fpl_api()

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
                                     player['bps'],
                                     player['influence'],
                                     player['creativity'],
                                     player['threat'],
                                     player['ict_index'],
                                     player['influence_rank'],
                                     player['influence_rank_type'],
                                     player['creativity_rank'],
                                     player['creativity_rank_type'],
                                     player['threat_rank'],
                                     player['threat_rank_type'],
                                     player['ict_index_rank'],
                                     player['ict_index_rank_type'],
                                     player['transfers_in'],
                                     player['transfers_out'],
                                     player['team']
                                     ]
    return player_dict


def fill_database_all_players():
    static_data = static_json("api")
    ids = get_ids("api")
    for id in ids:
        player_data = read_data_from_fpl_api(id)
        Name = static_data[id][0] + " & " + static_data[id][1]
        print("Filling db for player: ", Name, " with id: ", player_data['history'][0]['element'], "(", id, ")")
        fill_database_for_one_player(player_data, static_data)
        time.sleep(1)
    #salah_data = read_data_from_json()
    #static_data = static_json()
    #fill_database_for_one_player(salah_data, static_data)

    #digne_data = read_data_from_json("Digne")
    #fill_database_for_one_player(digne_data, static_data)

    #kane_data = read_data_from_json("Kane")
    #fill_database_for_one_player(kane_data, static_data)


def fill_database_for_one_player(player_data_json, static_data):
    element_id = player_data_json['history'][0]['element']
    # all total values from static json
    temp_opponent_team = [0]
    temp_was_home = [0]
    temp_team_h_score = [0]
    temp_team_a_score = [0]
    temp_round = [0]
    temp_value = [static_data[element_id][4]]
    temp_total_points = [static_data[element_id][7]]
    temp_minutes = [static_data[element_id][8]]
    temp_goals_scored = [static_data[element_id][9]]
    temp_assists = [static_data[element_id][10]]
    temp_clean_sheets = [static_data[element_id][11]]
    temp_goals_conceded = [static_data[element_id][12]]
    temp_own_goals = [static_data[element_id][13]]
    temp_penalties_saved = [static_data[element_id][14]]
    temp_penalties_missed = [static_data[element_id][15]]
    temp_yellow_cards = [static_data[element_id][16]]
    temp_red_cards = [static_data[element_id][17]]
    temp_saves = [static_data[element_id][18]]
    temp_bonus = [static_data[element_id][19]]
    temp_bps = [static_data[element_id][20]]
    temp_influence = [static_data[element_id][21]]
    temp_creativity = [static_data[element_id][22]]
    temp_threat = [static_data[element_id][23]]
    temp_ict_index = [static_data[element_id][24]]
    temp_transfers_balance = [0]
    temp_selected = [0]
    temp_transfers_in = [static_data[element_id][33]]
    temp_transfers_out = [static_data[element_id][34]]

    team_id = static_data[element_id][35]
    player_name = static_data[element_id][0] + " & " + static_data[element_id][1]
    player_position_id = static_data[element_id][2]
    chance_of_playing = static_data[element_id][3]
    if chance_of_playing == None:
        chance_of_playing = "None"

    # fill in gw data
    player_all_current_gws_data = player_data_json['history']
    for gw_i_data in player_all_current_gws_data:
        temp_opponent_team.append(gw_i_data['opponent_team'])
        temp_total_points.append(gw_i_data['total_points'])
        temp_was_home.append(gw_i_data['was_home'])
        temp_team_h_score.append(gw_i_data['team_h_score'])
        temp_team_a_score.append(gw_i_data['team_a_score'])
        temp_round.append(gw_i_data['round'])
        temp_minutes.append(gw_i_data['minutes'])
        temp_goals_scored.append(gw_i_data['goals_scored'])
        temp_assists.append(gw_i_data['assists'])
        temp_clean_sheets.append(gw_i_data['clean_sheets'])
        temp_goals_conceded.append(gw_i_data['goals_conceded'])
        temp_own_goals.append(gw_i_data['own_goals'])
        temp_penalties_saved.append(gw_i_data['penalties_saved'])
        temp_penalties_missed.append(gw_i_data['penalties_missed'])
        temp_yellow_cards.append(gw_i_data['yellow_cards'])
        temp_saves.append(gw_i_data['saves'])
        temp_bonus.append(gw_i_data['bonus'])
        temp_bps.append(gw_i_data['bps'])
        temp_influence.append(gw_i_data['influence'])
        temp_creativity.append(gw_i_data['creativity'])
        temp_threat.append(gw_i_data['threat'])
        temp_transfers_balance.append(gw_i_data['transfers_balance'])
        temp_ict_index.append(gw_i_data['ict_index'])
        temp_selected.append(gw_i_data['selected'])
        temp_transfers_in.append(gw_i_data['transfers_in'])
        temp_transfers_out.append(gw_i_data['transfers_out'])
        temp_value.append(gw_i_data['value'])
        temp_red_cards.append(gw_i_data['red_cards'])

    fill_model = FPLPlayersModel(player_id = element_id,
                                 player_team_id = team_id,
                                 player_position_id = player_position_id,
                                 player_name = player_name,
                                 chance_of_playing = chance_of_playing,
                                 assists_list = temp_assists,
                                 bonus_list = temp_bonus,
                                 bps_list = temp_bps,
                                 clean_sheets_list = temp_clean_sheets,
                                 creativity_list = temp_creativity,
                                 goals_conceded_list = temp_goals_conceded,
                                 goals_scored_list = temp_goals_scored,
                                 ict_index_list = temp_ict_index,
                                 influence_list = temp_influence,
                                 minutes_list = temp_minutes,
                                 opponent_team_list = temp_opponent_team,
                                 own_goals_list = temp_own_goals,
                                 penalties_missed_list = temp_penalties_missed,
                                 penalties_saved_list = temp_penalties_saved,
                                 red_cards_list = temp_red_cards,
                                 round_list = temp_round,
                                 saves_list = temp_saves,
                                 selected_list = temp_selected,
                                 team_a_score_list = temp_team_a_score,
                                 team_h_score_list = temp_team_h_score,
                                 threat_list = temp_threat,
                                 total_points_list = temp_total_points,
                                 transfers_balance_list = temp_transfers_balance,
                                 transfers_in_list = temp_transfers_in,
                                 transfers_out_list = temp_transfers_out,
                                 value_list = temp_value,
                                 was_home_list = temp_was_home,
                                 yellow_cards_list = temp_yellow_cards
                             )
    fill_model.save()

    return 0

"""
with open('../JSON_DATA/Element_Summary/Salah.json') as player_info:
    static = json.load(player_info)

data = static_json()

print(json.dumps(static, indent=4, sort_keys=True))
print(json.dumps(data, indent=4, sort_keys=True))
print(data)
fill_database_all_players()



print(1/0)
with open('../JSON_DATA/static.json') as json_fixture:
    static = json.load(json_fixture)

players = static['elements']
#print(json.dumps(players, indent=4, sort_keys=True))
print(players[0].keys())
bps_list = []
bonus_list = []
name_list = []
colors = ['red', 'blue', 'green', 'yellow']

for idx, i in enumerate(players):
    if i['bonus'] > 5:
        element_type = i['element_type']
        bps = i['bps']
        bonus = i['bonus']
        bps_list.append(bps)
        bonus_list.append(bonus)
        name = str(i['first_name']) + str(i['second_name'])
        name_list.append(name)
        #plt.scatter(idx, bonus / bps, c=colors[element_type - 1])
        plt.scatter(idx, bonus, c=colors[element_type - 1])
        #plt.text(idx, bonus / bps, name, fontsize=9)
        plt.text(idx, bonus, name, fontsize=9)
plt.xlabel("bps")
plt.ylabel("bonus")
plt.show()
"""