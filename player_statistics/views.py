from django.shortcuts import render
from django.http import HttpResponse
from fixture_planner.models import AddPlTeamsToDB
from django.views import generic
from player_statistics.backend.read_statistics import fill_database_all_players
from player_statistics.models import FPLPlayersModel
import numpy as np
from django.views.decorators.csrf import csrf_exempt


def fill_player_stat_db(request):
    fill_database_all_players()
    return HttpResponse("Filled Database Player Data (FPLPlayersModel)")


def get_player_position_id_dict():
    return {"Goalkeepers": 1, "Defenders": 2, "Midfielders": 3, "Forwards": 4}


def read_db_data(keyword, order_by, acc_dec):
    order_by = acc_dec + order_by
    position_dict = get_player_position_id_dict()
    team_dict = get_pl_teams()
    if keyword == "All":
        return FPLPlayersModel.objects.all().order_by(order_by)
    if keyword in position_dict:
        return FPLPlayersModel.objects.filter(player_position_id=position_dict[keyword]).order_by(order_by)
    if keyword in team_dict.keys():
        return FPLPlayersModel.objects.filter(player_team_id=team_dict[keyword]).order_by(order_by)


def get_pl_teams():
    pl_teams_dict = dict()
    fixture_list_db = AddPlTeamsToDB.objects.all()
    for team in fixture_list_db:
        pl_teams_dict[team.team_name] = team.team_id
    return pl_teams_dict

def get_sort_on_dict():
    return {"Name": "player_name",
            "Total points": "total_points_list",
            "Bps": "bonus_list",
            "ICT": "ict_index_list",
            "I": "influence_list",
            "C": "creativity_list",
            "T": "threat_list"}

def get_sort_on_number_dict():
    return {"Name": 0,
            "Total points": 1,
            "Bps": 2,
            "ICT": 3,
            "I": 4,
            "C": 5,
            "T": 6}


@csrf_exempt
def show_player_statistics(request, last_x_rounds=6, sorting_keyword="All", sort_on="Total points", acc_dec="-", last_x_gw="All GWs"):
    if request.method == 'POST':
        sorting_keyword = request.POST.getlist('sort_players')[0]
        sort_on = request.POST.getlist('sort_on')[0]
        last_x_gw = request.POST.getlist('last_x')[0]

    sort_index = get_sort_on_dict()[sort_on]
    fpl_players_with_info = read_db_data(sorting_keyword, sort_index, acc_dec)
    #fpl_players_with_info = FPLPlayersModel.objects.get(player_team_id=4)
    # check how many rounds each player has players (must validate
    # each player for him self. Some players have played 5 games, some 30
    player_info = []
    max_gws = 0
    if last_x_gw == "All GWs":
        last_x_rounds = 38
    else:
        last_x_rounds = int(last_x_gw)
    for fpl_player_i in fpl_players_with_info:
        player_i = []
        fpl_player_i_has_played_how_many_rounds = len(fpl_player_i.round_list) - 1
        max_gws = max(fpl_player_i_has_played_how_many_rounds, max_gws)
        num_rounds = min(fpl_player_i_has_played_how_many_rounds, last_x_rounds)
        #player_i.append(fpl_player_i.player_name.replace("&", ""))
        #print(player_i, player_i[0].split(" "), fpl_player_i.player_name.split("&"))
        name = fpl_player_i.player_name.split("&")
        player_i.append(str(name[0][0]) + ". " + str(name[-1]))
        if last_x_gw == "All GWs":
            player_i.append(round(fpl_player_i.total_points_list[0], 2))
            player_i.append(round(fpl_player_i.bps_list[0], 2))
            player_i.append(round(float(fpl_player_i.ict_index_list[0]), 2))
            player_i.append(round(float(fpl_player_i.influence_list[0]), 2))
            player_i.append(round(float(fpl_player_i.creativity_list[0]), 2))
            player_i.append(round(float(fpl_player_i.threat_list[0]), 2))

        else:
            player_i.append(round(np.mean(fpl_player_i.total_points_list[-num_rounds:]), 2))
            player_i.append(round(np.mean(fpl_player_i.bps_list[-num_rounds:]), 2))
            player_i.append(round(np.mean(convert_list_with_strings_to_ints(fpl_player_i.ict_index_list[-num_rounds:])), 2))
            player_i.append(round(np.mean(convert_list_with_strings_to_ints(fpl_player_i.influence_list[-num_rounds:])), 2))
            player_i.append(round(np.mean(convert_list_with_strings_to_ints(fpl_player_i.creativity_list[-num_rounds:])), 2))
            player_i.append(round(np.mean(convert_list_with_strings_to_ints(fpl_player_i.threat_list[-num_rounds:])), 2))

        # rounds.append(fpl_player_i.round_list[-num_rounds:])
        player_info.append(player_i)

    # sort
    idx_to_sort = get_sort_on_number_dict()[sort_on]
    player_info = sorted(player_info, key=lambda x: x[idx_to_sort], reverse=True)
    fixture_list_db = AddPlTeamsToDB.objects.all()
    team_names = [team.team_name for team in fixture_list_db]
    categories = get_sort_on_dict().keys()
    last_x_gws = ["All GWs"]
    for x in range(1, max_gws + 1):
        last_x_gws.append(str(x))

    context = {
        'last_x_rounds': last_x_rounds,
        'player_info': player_info,
        'sorting_keyword': sorting_keyword,
        'teams': team_names,
        'sort_on': sort_on,
        'categories': categories,
        'last_x_gws': last_x_gws,
        'last_x_gw': last_x_gw,
    }
    return render(request, 'player_statistics.html', context=context)


def convert_list_with_strings_to_ints(list):
    return [float(i) for i in list]
