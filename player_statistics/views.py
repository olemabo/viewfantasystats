import re
from player_statistics.utility_functions.utility_functions_player_statistics import get_player_statistics_from_db, \
    get_dict_sort_on_short_name_to_sort_on_name, get_dict_sort_on_short_name_to_number
from player_statistics.utility_functions.utility_functions_ownership_statistics import get_ownership_db_data
from utils.utility_functions import convert_list_with_strings_to_floats, get_list_of_all_pl_team_names
from player_statistics.backend.fill_db_from_txt.fill_db_player_statistics import fill_database_all_players
from player_statistics.backend.fill_db_from_txt.fill_db_global_statistics import write_global_stats_to_db
from player_statistics.backend.read_api_data_to_txt.read_global_statistics import save_all_global_stats_for_current_gw
#from player_statistics.backend.read_global_statistics import save_all_global_stats_for_current_gw
from django.views.decorators.csrf import csrf_exempt
from constants import ranking_delimiter, premier_league_folder_name, total_number_of_gameweeks, eliteserien_folder_name, fantasy_manager_eliteserien_url
from django.http import HttpResponse
from django.shortcuts import render
import numpy as np
from django.http import JsonResponse
from player_statistics.backend.fill_db_from_txt.fill_db_global_statistics_eliteserien import write_global_stats_to_db_eliteserien
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.views import APIView
from player_statistics.db_models.eliteserien.ownership_statistics_model_eliteserien import *
from player_statistics.db_models.premier_league.ownership_statistics_model import *
from fixture_planner_eliteserien.models import EliteserienTeamInfo
from fixture_planner.models import PremierLeagueTeamInfo
from player_statistics.backend.fill_db_from_txt.fill_db_user_info_statistics_eliteserien import write_user_info_to_db_eliteserien
from player_statistics.backend.read_api_data_to_txt.read_user_info_statistics import read_user_info_statistics_eliteserien
from player_statistics.db_models.eliteserien.user_statistics_model_eliteserien import EliteserienUserInfoStatistics
from django.db.models import Q # new


def fill_player_statistics_eliteserien(request):
    fill_database_all_players(eliteserien_folder_name)
    return HttpResponse("Filled Database Eliteserien Player Statistics Info (EliteserienPlayerStatistic)")


def fill_player_statistics_premier_league(request):
    fill_database_all_players(premier_league_folder_name)
    return HttpResponse("Filled Database Premier League Player Statistics Info (EliteserienPlayerStatistic)")


def read_and_fill_user_info_to_db_eliteserien(request):
    read_user_info_statistics_eliteserien()
    write_user_info_to_db_eliteserien()
    return HttpResponse("Read and Filled Database User Info (EliteserienUserInfoStatistics)")


def fill_user_info_to_db_eliteserien(request):
    write_user_info_to_db_eliteserien()
    return HttpResponse("Filled Database User Info (EliteserienUserInfoStatistics)")


class PlayerOwnershipResponse:
    def __init__(self, ownershipdata, newest_updated_gw, available_gws, team_names_and_ids, chip_data, top_x_managers_list):
        ...
        self.ownershipdata = ownershipdata
        self.newest_updated_gw = newest_updated_gw
        self.available_gws = available_gws
        self.team_names_and_ids = team_names_and_ids
        self.chip_data = chip_data
        self.top_x_managers_list = top_x_managers_list
    
    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)

class Team_And_Id_Model:
    def __init__(self, team_name, id):
        ...
        self.team_name = team_name
        self.id = id
    
    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)

class Chip_Model:
    def __init__(self, gw, chip_data, total_chip_usage):
        ...
        self.gw = gw
        self.chip_data = chip_data
        self.total_chip_usage = total_chip_usage
    
    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)

class PlayerOwnershipAPIView(APIView):

    def get(self, request):
        league_name = str(request.GET.get('league_name')).lower()
        
        empty_response = []

        newest_updated_gw, all_gws = get_last_updated_gw_and_all_gws_eliteserien() if league_name == eliteserien_folder_name else get_last_updated_gw_and_all_gws_premier_league()

        if (newest_updated_gw == 0): 
            return JsonResponse(empty_response, safe=False)

        player_ownership_db = EliteserienGlobalOwnershipStats1000.objects.all() if league_name == eliteserien_folder_name else PremierLeagueGlobalOwnershipStats10000.objects.all()

        if len(player_ownership_db) == 0:
            return JsonResponse(empty_response, safe=False)

        for i in player_ownership_db:
            empty_response.append(i.toJson())
        
        team_names_and_ids_list = []

        team_names_and_ids = EliteserienTeamInfo.objects.all() if league_name == eliteserien_folder_name else PremierLeagueTeamInfo.objects.all()

        for team in team_names_and_ids:
            team_names_and_ids_list.append(Team_And_Id_Model(team.team_name, team.team_id).toJson())
        
        chip_data = []

        chips_db_data = EliteserienChipsAndUserInfo.objects.all() if league_name == eliteserien_folder_name else PremierLeagueChipsAndUserInfo.objects.all()

        for i in chips_db_data:
            chip_model = Chip_Model(i.gw, i.extra_info_top_1000, i.total_chip_usage_1000) if league_name == eliteserien_folder_name else Chip_Model(i.gw, i.extra_info_top_10000, i.total_chip_usage_10000)
            chip_data.append(chip_model)
        
        top_x_managers_list_pl = [100, 1000, 10000]
        top_x_managers_list_eliteserien = [100, 1000, 5000]
        
        top_x_managers_list = top_x_managers_list_eliteserien if league_name == eliteserien_folder_name else top_x_managers_list_pl

        response = PlayerOwnershipResponse(empty_response, newest_updated_gw, all_gws, team_names_and_ids_list, chip_data, top_x_managers_list) 

        return JsonResponse(response.toJson(), safe=False)

    def post(self, request, format=None):
        try:
            top_x_players = int(request.data.get("top_x_players"))
            current_gw = int(request.data.get("current_gw"))
            league_name = str(request.data.get("league_name"))
            chips_db_data = EliteserienChipsAndUserInfo.objects.all() if league_name == eliteserien_folder_name else PremierLeagueChipsAndUserInfo.objects.all()
            player_ownership_db = []
            chip_data = []
            
            if (top_x_players == 100):
                player_ownership_db = EliteserienGlobalOwnershipStats100.objects.all() if league_name == eliteserien_folder_name else PremierLeagueGlobalOwnershipStats100.objects.all()
                for i in chips_db_data:
                    chip_data.append(Chip_Model(i.gw, i.extra_info_top_100, i.total_chip_usage_100))
                
            elif (top_x_players == 1000):
                player_ownership_db = EliteserienGlobalOwnershipStats1000.objects.all() if league_name == eliteserien_folder_name else PremierLeagueGlobalOwnershipStats1000.objects.all()
                for i in chips_db_data:
                    chip_data.append(Chip_Model(i.gw, i.extra_info_top_1000, i.total_chip_usage_1000))
            
            elif (top_x_players == 5000):
                player_ownership_db = EliteserienGlobalOwnershipStats5000.objects.all()
                for i in chips_db_data:
                    chip_data.append(Chip_Model(i.gw, i.extra_info_top_5000, i.total_chip_usage_5000))
            
            elif (top_x_players == 10000):
                player_ownership_db = PremierLeagueGlobalOwnershipStats10000.objects.all()
                for i in chips_db_data:
                    chip_data.append(Chip_Model(i.gw, i.extra_info_top_10000, i.total_chip_usage_10000))
            
            empty_response = []
            if len(player_ownership_db) == 0:
                return JsonResponse(empty_response, safe=False)

            for i in player_ownership_db:
                empty_response.append(i.toJson())
            
            team_names_and_ids_list = []
            team_names_and_ids = EliteserienTeamInfo.objects.all() if league_name == eliteserien_folder_name else PremierLeagueTeamInfo.objects.all()
            
            for team in team_names_and_ids:
                team_names_and_ids_list.append(Team_And_Id_Model(team.team_name, team.team_id).toJson())

            top_x_managers_list_pl = [100, 1000, 10000]
            top_x_managers_list_eliteserien = [100, 1000, 5000]
            
            top_x_managers_list = top_x_managers_list_eliteserien if league_name == eliteserien_folder_name else top_x_managers_list_pl

            response = PlayerOwnershipResponse(empty_response, current_gw, [], team_names_and_ids_list, chip_data, top_x_managers_list) 
            return JsonResponse(response.toJson(), safe=False)

        except:
            return Response({'Bad Request': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)


class SearchHitModel:
    def __init__(self, hit_text, user_team_name, user_first_name, user_last_name, user_id):
        ...
        self.hit_text = hit_text
        self.user_team_name = user_team_name
        self.user_first_name = user_first_name
        self.user_last_name = user_last_name
        self.user_id = user_id
    
    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)
 

class SearchUserNameModel:
    def __init__(self, fantasy_manager_url, list_of_hits):
        ...
        self.fantasy_manager_url = fantasy_manager_url
        self.list_of_hits = list_of_hits
    
    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)



class SearchUserNameAPIView(APIView):

    def post(self, request, format=None):
        try:
            querys = request.data.get("query").lower().split(" ")

            # q_object = Q(user_team_name__icontains=querys[0]) | Q(user_first_name__icontains=querys[0]) | Q(user_last_name__icontains=querys[0])

            # for item in querys[1:]:
            #         q_object.add((Q(user_team_name__icontains=item) | Q(user_first_name__icontains=item) | Q(user_last_name__icontains=item)), q_object.connector)

            # hits = EliteserienUserInfoStatistics.objects.filter(q_object).order_by().distinct()

            # # hits = EliteserienUserInfoStatistics.objects.filter(
            # #     Q(user_team_name__icontains=qs) | Q(user_first_name__icontains=qs) | Q(user_last_name__icontains=qs)
            # # )
            # list_of_hits = [] 
            # for hit in hits:
            #     list_of_hits.append(
            #         SearchHitModel(
            #             querys[0], 
            #             hit.user_team_name, 
            #             hit.user_first_name, 
            #             hit.user_last_name,
            #             hit.user_id,
            #             )
            #         .toJson()
            #     )

            list_of_hits = [] 
            hits = EliteserienUserInfoStatistics.objects.all()
            for hit in hits:
                hit_number = 0
                for query in querys:
                    if (query in hit.user_team_name.lower() or query in hit.user_first_name.lower() or query in hit.user_last_name.lower()):
                        hit_number += 1
                if hit_number > 0:
                    list_of_hits.append(
                    SearchHitModel(
                        hit_number, 
                        hit.user_team_name, 
                        hit.user_first_name, 
                        hit.user_last_name,
                        hit.user_id,
                    ))
            
            # print(list_of_hits)
            newlist = sorted(list_of_hits, key=lambda x: x.hit_text, reverse=True)
            
            list_of_hits = [i.toJson() for i in newlist]

            fantasy_manager_url = fantasy_manager_eliteserien_url
            response = SearchUserNameModel(fantasy_manager_url, list_of_hits) 

            return JsonResponse(response.toJson(), safe=False)

        except:
            return Response({'Bad Request': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)



class RankModel:
    def __init__(self, user_id, name, avg_rank, avg_points, avg_rank_ranking, avg_points_ranking):
        ...
        self.user_id = user_id
        self.name = name
        self.avg_rank = avg_rank
        self.avg_points = avg_points
        self.avg_rank_ranking = avg_rank_ranking
        self.avg_points_ranking = avg_points_ranking
    
    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)

class RankStatisticsModel:
    def __init__(self, fantasy_manager_url, list_of_ranks, number_of_last_years):
        ...
        self.fantasy_manager_url = fantasy_manager_url
        self.list_of_ranks = list_of_ranks
        self.number_of_last_years = number_of_last_years
    
    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)


class RankStatisticsAPIView(APIView):

    def post(self, request, format=None):
        try:
            last_x_years = int(request.data.get("last_x_years"))
            list_of_ranks = [] 
            number_of_last_years = 1
            userInfo = EliteserienUserInfoStatistics.objects.all()
            for hit in userInfo:
                rank_history = hit.ranking_history
                number_of_last_years = max(number_of_last_years, len(rank_history))
                if (len(rank_history) >= last_x_years):
                    avg_rank = 0
                    avg_points = 0
                    user_id = hit.user_id
                    for rank_info in rank_history[-last_x_years:]:
                        year_points_rank = rank_info.split(ranking_delimiter)
                        avg_rank += int(year_points_rank[2])
                        avg_points += int(year_points_rank[1])
                    list_of_ranks.append(
                        RankModel(
                            user_id, 
                            hit.user_first_name + " " + hit.user_last_name,
                            round(avg_rank / last_x_years, 0), 
                            round(avg_points / last_x_years, 1),
                            -1,
                            -1
                        ))
            ranks_sorted_on_points = sorted(list_of_ranks, key=lambda x: x.avg_points, reverse=True)
            list_of_ranks = []
            for idx, i in enumerate(ranks_sorted_on_points):
                data = i
                data.avg_points_ranking = idx + 1 
                list_of_ranks.append(data)  
            
            ranks_sorted_on_rank = sorted(list_of_ranks, key=lambda x: x.avg_rank, reverse=False)
            list_of_ranks = []
            for idx, i in enumerate(ranks_sorted_on_rank):
                data = i
                data.avg_rank_ranking = idx + 1 
                list_of_ranks.append(data.toJson())  

            fantasy_manager_url = fantasy_manager_eliteserien_url
            response = RankStatisticsModel(fantasy_manager_url, list_of_ranks, number_of_last_years) 

            return JsonResponse(response.toJson(), safe=False)

        except:
            return Response({'Bad Request': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)


def get_last_updated_gw_and_all_gws_eliteserien():
    checkedGws = EliteserienGwsChecked.objects.all()
    if (len(checkedGws) > 0):
        gws_checked_1000 = checkedGws[0].gws_updated_1000
        if len(gws_checked_1000) > 0:
            return max(gws_checked_1000), gws_checked_1000
    return 0, []


def get_last_updated_gw_and_all_gws_premier_league():
    checkedGws = PremierLeagueGwsChecked.objects.all()
    if (len(checkedGws) > 0):
        gws_checked_10000 = checkedGws[0].gws_updated_10000
        if len(gws_checked_10000) > 0:
            return max(gws_checked_10000), gws_checked_10000
    return 0, []



# DB functions. Should not be accessible in PRODUCTION
def fill_db_global_stats(request):
    write_global_stats_to_db_eliteserien()
    return HttpResponse("Filled Database Global Data (GlobalOwnershipStatsXXXX)")


def read_and_fill_db_global_stats(request):
    save_all_global_stats_for_current_gw(eliteserien_folder_name)
    write_global_stats_to_db_eliteserien()
    return HttpResponse("Read global stats from api and filled Database Global Data (GlobalOwnershipStatsXXXX)")


def fill_db_global_stats_premier_league(request):
    write_global_stats_to_db()
    return HttpResponse("Filled Database Global Data (GlobalOwnershipStatsXXXX)")


def read_and_fill_db_global_stats_premier_league(request):
    save_all_global_stats_for_current_gw(premier_league_folder_name)
    write_global_stats_to_db()
    return HttpResponse("Filled Database Global Data (GlobalOwnershipStatsXXXX)")



def fill_txt_global_stats(request):
    #save_all_global_stats_for_current_gw()
    return HttpResponse("Filled Txt global stats")


def fill_player_stat_db(request):
    #save_all_global_stats_for_current_gw()
    return HttpResponse("Filled Database Player Data (PremierLeaguePlayers)")


def fill_all_statistics(request):
    #fill_database_all_players()
    #save_all_global_stats_for_current_gw()
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

