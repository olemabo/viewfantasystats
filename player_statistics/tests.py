from django.test import TestCase
import requests
import json
# Create your tests here.
from constants import name_of_extra_info_file, name_of_nationality_file, path_to_store_local_data, all_top_x_players_premier_league, name_of_ownership_file, total_number_of_gameweeks
import numpy as np


def read_data_from_fpl_api(player_id):
    web_page_individual_player = 'https://fantasy.premierleague.com/api/element-summary/X/'
    r = requests.get(web_page_individual_player.replace('X', str(player_id)))
    return r.json()

def get_ids():
    with open('stored_data/static_json/static.json', encoding='utf-8') as json_static:
        static_info = json.load(json_static)

    static_info = static_info['elements']
    ids = []
    for info in static_info:
        ids.append(info['id'])

    return ids


def fill_Extra_Info_Statistics():
    gws = [gw + 1 for gw in range(total_number_of_gameweeks)]
    for gw in gws:
        file_path = path_to_store_local_data + "/global_stats/" + str(gw)
        top_x_players = all_top_x_players_premier_league
        for top_x in top_x_players:
            try:
                current_path = file_path + "/top_" + str(top_x) + "/" + name_of_extra_info_file
                current_file = open(current_path, "r", encoding="utf-8")
                chips_data = np.loadtxt(current_path, dtype="str", delimiter=",", skiprows=1, max_rows=1)
                avg_data = np.loadtxt(current_path, dtype="str", delimiter=",", skiprows=4)
                avg_team_value = int(np.mean(np.array(avg_data[:, 1], dtype=float)))
                avg_gw_transfer = int(np.mean(np.array(avg_data[:, 2], dtype=float))*10)
                avg_transfer_cost = int(np.mean(np.array(avg_data[:, 3], dtype=float))*10)
                print(chips_data, avg_gw_transfer, avg_transfer_cost)
                #if top_x == 100:

                #if top_x == 1000:

                #if top_x == 10000:

            except:
                a = 0
                #print("Didn't find file: ", current_path)


"""
with open('../stored_data/element_summary/Salah.json') as player_info:
    static = json.load(player_info)

data = static_json()

print(json.dumps(static, indent=4, sort_keys=True))
print(json.dumps(data, indent=4, sort_keys=True))
print(data)
fill_database_all_players()



print(1/0)
with open('../stored_data/static_json/static.json') as json_fixture:
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