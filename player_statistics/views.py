from player_statistics.utility_functions.utility_functions_player_statistics import get_player_statistics_from_db, \
    get_dict_sort_on_short_name_to_sort_on_name, get_dict_sort_on_short_name_to_number
from player_statistics.utility_functions.utility_functions_ownership_statistics import get_ownership_db_data
from utils.utility_functions import convert_list_with_strings_to_floats, get_list_of_all_pl_team_names
#from player_statistics.backend.fill_db_player_statistics import fill_database_all_players
#from player_statistics.backend.fill_db_global_statistics import write_global_stats_to_db
#from player_statistics.backend.read_global_statistics import save_all_fpl_teams_stats
from django.views.decorators.csrf import csrf_exempt
from constants import total_number_of_gameweeks
from django.http import HttpResponse
from django.shortcuts import render
import numpy as np
from django.http import JsonResponse


# DB functions. Should not be accessible in PRODUCTION
def fill_db_global_stats(request):
    #write_global_stats_to_db()
    return HttpResponse("Filled Database Global Data (GlobalOwnershipStatsXXXX)")


def fill_txt_global_stats(request):
    #save_all_fpl_teams_stats()
    return HttpResponse("Filled Txt global stats")


def fill_player_stat_db(request):
    #fill_database_all_players()
    return HttpResponse("Filled Database Player Data (FPLPlayersModel)")


def fill_all_statistics(request):
    #fill_database_all_players()
    #save_all_fpl_teams_stats()
    #write_global_stats_to_db()
    return HttpResponse("Finished all statistics")

@csrf_exempt
def show_player_statistics(request, sorting_keyword="All", sort_on="Total points", acs_dec="-", last_x_gw="All GWs"):
    if request.method == 'POST':
        sorting_keyword = request.POST.getlist('sort_players')[0]
        sort_on = request.POST.getlist('sort_on')[0]
        last_x_gw = request.POST.getlist('last_x')[0]

    sort_index = get_dict_sort_on_short_name_to_sort_on_name()[sort_on]
    fpl_players_with_info = get_player_statistics_from_db(sorting_keyword, sort_index, acs_dec)

    # check how many rounds each player has players (must validate
    # each player for him self. Some players have played 5 games, some 30
    player_info = []
    max_gws = 0
    if last_x_gw == "All GWs":
        last_x_rounds = total_number_of_gameweeks
    else:
        last_x_rounds = int(last_x_gw)

    for fpl_player_i in fpl_players_with_info:
        player_i = []
        fpl_player_i_has_played_how_many_rounds = len(fpl_player_i.round_list) - 1
        max_gws = max(fpl_player_i_has_played_how_many_rounds, max_gws)
        num_rounds = min(fpl_player_i_has_played_how_many_rounds, last_x_rounds)
        name = fpl_player_i.player_web_name
        player_i.append(name)
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
            player_i.append(round(np.mean(convert_list_with_strings_to_floats(fpl_player_i.ict_index_list[-num_rounds:])), 2))
            player_i.append(round(np.mean(convert_list_with_strings_to_floats(fpl_player_i.influence_list[-num_rounds:])), 2))
            player_i.append(round(np.mean(convert_list_with_strings_to_floats(fpl_player_i.creativity_list[-num_rounds:])), 2))
            player_i.append(round(np.mean(convert_list_with_strings_to_floats(fpl_player_i.threat_list[-num_rounds:])), 2))

        # rounds.append(fpl_player_i.round_list[-num_rounds:])
        player_info.append(player_i)

    # sort
    idx_to_sort = get_dict_sort_on_short_name_to_number()[sort_on]
    player_info = sorted(player_info, key=lambda x: x[idx_to_sort], reverse=True)
    list_of_pl_team_names = get_list_of_all_pl_team_names()
    categories = get_dict_sort_on_short_name_to_sort_on_name().keys()

    last_x_gws = ["All GWs"]
    for x in range(1, max_gws + 1):
        last_x_gws.append(str(x))

    context = {
        'last_x_rounds': last_x_rounds,
        'player_info': player_info,
        'sorting_keyword': sorting_keyword,
        'teams': list_of_pl_team_names,
        'sort_on': sort_on,
        'categories': categories,
        'last_x_gws': last_x_gws,
        'last_x_gw': last_x_gw,
    }
    return render(request, 'player_statistics.html', context=context)


@csrf_exempt
def show_ownership_statistics(request, top_x=10000, gw=7):
    """
    NOT FINISHED YET
    :param request:
    :param top_x:
    :param gw:
    :return:
    """
    player_team_ids = [2, 3]
    player_position_ids = [1, 2]
    gw_name = "gw_" + str(gw)
    top_x = top_x

    # extract data from db
    db_player_names = get_ownership_db_data(top_x=top_x,
                                            field_name="player_name",
                                            player_team_ids=player_team_ids,
                                            player_position_ids=player_position_ids)

    db_gw_ownership = get_ownership_db_data(top_x=top_x,
                                            field_name=gw_name,
                                            player_team_ids=player_team_ids,
                                            player_position_ids=player_position_ids)

    list_name_ownership = []
    for name_i, ownership_i in zip(db_player_names, db_gw_ownership):
        list_name_ownership.append([name_i["player_name"], np.array(ownership_i[gw_name]) / top_x * 100])
    # player_name, starting and not captain, starting and captain, starting and vice captain, owners, benched
    print(list_name_ownership)

    context = {
        'list_name_ownership': list_name_ownership,
        'gw': gw,
    }
    return render(request, 'ownership_statistics.html', context=context)


@csrf_exempt
def show_nationality_statistics(request):
    """
    NOT FINISHED YET.
    :param request:
    :return:
    """

    context = {
        'test': 1,
    }

    return render(request, 'nationality_statistics.html', context=context)

