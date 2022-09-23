import requests
import json
# Create your tests here.
# from constants import name_of_extra_info_file, name_of_nationality_file, path_to_store_local_data, all_top_x_players_premier_league, name_of_ownership_file, total_number_of_gameweeks
import numpy as np


# def read_data_from_fpl_api(player_id):
#     web_page_individual_player = 'https://fantasy.premierleague.com/api/element-summary/X/'
#     r = requests.get(web_page_individual_player.replace('X', str(player_id)))
#     return r.json()

# def get_ids():
#     with open('stored_data/static_json/static.json', encoding='utf-8') as json_static:
#         static_info = json.load(json_static)

#     static_info = static_info['elements']
#     ids = []
#     for info in static_info:
#         ids.append(info['id'])

#     return ids


# def fill_Extra_Info_Statistics():
#     gws = [gw + 1 for gw in range(total_number_of_gameweeks)]
#     for gw in gws:
#         file_path = path_to_store_local_data + "/global_stats/" + str(gw)
#         top_x_players = all_top_x_players_premier_league
#         for top_x in top_x_players:
#             try:
#                 current_path = file_path + "/top_" + str(top_x) + "/" + name_of_extra_info_file
#                 current_file = open(current_path, "r", encoding="utf-8")
#                 chips_data = np.loadtxt(current_path, dtype="str", delimiter=",", skiprows=1, max_rows=1)
#                 avg_data = np.loadtxt(current_path, dtype="str", delimiter=",", skiprows=4)
#                 avg_team_value = int(np.mean(np.array(avg_data[:, 1], dtype=float)))
#                 avg_gw_transfer = int(np.mean(np.array(avg_data[:, 2], dtype=float))*10)
#                 avg_transfer_cost = int(np.mean(np.array(avg_data[:, 3], dtype=float))*10)
#                 print(chips_data, avg_gw_transfer, avg_transfer_cost)
#                 #if top_x == 100:

#                 #if top_x == 1000:

#                 #if top_x == 10000:

#             except:
#                 a = 0
#                 #print("Didn't find file: ", current_path)

import pandas as pd
import matplotlib.pyplot as plt


def plot_top_ownerships(what_to_check="starting and captain", check_top_players=10, top_x_last=5000, GW=-1):
    """

    :param what_to_check:
    :param check_top_players:
    :param top_x_last:
    :param GW:
    :return:

    TODO: create color on the bars equal to their team logo color
    """
    GW = 21
    ownership_data_np = np.loadtxt(
        "C:\\Users\\ole.borge\\PycharmProjects\\FPL-webpage-azure-devops\\FPL-webpage\\stored_data" + "/eliteserien/2022/global_stats/" + str(GW) + "/top_" + str(top_x_last) + "/complete_ownership.txt", skiprows=1,
        dtype=str, delimiter=",", encoding="utf-8")

    dict_to_index = {"non_captain": 1, "starting and captain": 5, "vice_captain": 3, "benched": 5}
    dict_to_label = {"starting": "players starting", "non_captain": "players (without captain) owned",
                     "starting and captain": "players captained", "vice_captain": "players vice captained", "benched": "players benched"}
    if what_to_check == "starting":
        starting = []
        for start, captain in zip(ownership_data_np[:, 1], ownership_data_np[:, 2]):
            starting.append(int(start) + int(captain))
        data = starting
    else:
        data = ownership_data_np[:, dict_to_index[what_to_check]]
    ownership_data = pd.DataFrame(data, dtype=float, index=ownership_data_np[:, 0], columns=["starting and captain"]).div(top_x_last).nlargest(check_top_players, "starting and captain")
    for i in ownership_data.index:
        print(i, ownership_data_np[int(i) - 1])
        new_index = ownership_data_np[int(i) - 1][3]
        ownership_data = ownership_data.rename(index={i: new_index})
    ownership_data = ownership_data[::-1]
    if len(ownership_data) > 10:
        ax = ownership_data.plot(kind="barh",y="starting and captain", title="Top " + str(check_top_players) + " " + dict_to_label[what_to_check]  +" among " + str(top_x_last) + " fpl managers", stacked=True,
                                  color=plt.cm.tab20(np.arange(len(ownership_data)))[::-1], legend=False, figsize=(17,8), fontsize=12)
    else:
        ax = ownership_data.plot(kind="barh", y="starting and captain", title="Top " + str(check_top_players) + " " + dict_to_label[
            what_to_check] + " among " + str(top_x_last) + " fpl managers", stacked=True,
                                 color=plt.cm.Paired(np.arange(len(ownership_data)))[::-1], legend=False, figsize=(17, 8),
                                 fontsize=12)

    ax.set_xlabel("Percentage ownership", fontsize=12)
    vals = ax.get_xticks()
    ax.set_xticklabels(['{:.0%}'.format(x) for x in vals])

    [ax.text(v+0.002, i-0.05, '{:.2f}%'.format(100 * v)) for i, v in enumerate(ownership_data["starting and captain"])]
    plt.show()


plot_top_ownerships()


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