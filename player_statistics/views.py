from player_statistics.utility_functions.utility_functions_player_statistics import get_player_statistics_from_db, get_dict_sort_on_short_name_to_sort_on_name
from utils.utility_functions import convert_list_with_strings_to_floats
from django.db.models import Max, Min

from constants import ranking_delimiter, cup_db_delimiter, total_number_of_gameweeks, eliteserien_folder_name, fantasy_manager_eliteserien_url

from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import JsonResponse
from rest_framework import status
from django.db.models import Q
import numpy as np

from player_statistics.db_models.eliteserien.ownership_statistics_model_eliteserien import *
from player_statistics.db_models.premier_league.ownership_statistics_model import *
from fixture_planner_eliteserien.models import EliteserienTeamInfo
from fixture_planner.models import PremierLeagueTeamInfo

from utils.Statistics.Utils.GetLastUpdatedGws import get_last_updated_gw_and_all_gws_eliteserien, get_last_updated_gw_and_all_gws_premier_league

from player_statistics.backend.read_api_live.live_fixture_data import live_fixtures

from player_statistics.db_models.eliteserien.rank_and_points_eliteserien import EliteserienRankAndPoints
from player_statistics.db_models.eliteserien.user_statistics_model_eliteserien import EliteserienUserInfoStatistics
from player_statistics.db_models.eliteserien.cup_statistics_model_eliteserien import EliteserienCupStatistics
from player_statistics.db_models.premier_league.player_statistics_model import PremierLeaguePlayers

from utils.Statistics.ApiResponse.PlayerStatisticsApiResponse import PlayerStatisticsApiResponse
from utils.Statistics.ApiResponse.PlayerOwnershipApiResponse import PlayerOwnershipApiResponse
from utils.Statistics.ApiResponse.SearchUserNameApiResponse import SearchUserNameApiResponse
from utils.Statistics.ApiResponse.RankStatisticsApiResponse import RankStatisticsApiResponse
from utils.Statistics.ApiResponse.RankAndPointsApiResponse import RankAndPointsApiResponse
from utils.Statistics.ApiResponse.MostOwnedPlayersApiResponse import MostOwnedPlayersApiResponse

from utils.Statistics.Models.PlayerStatisticsModel import PlayerStatisticsModel
from utils.Statistics.Models.RankStatisticsModel import RankStatisticsModel
from utils.Statistics.Models.TeamAndIdModel import TeamAndIdModel
from utils.Statistics.Models.SearchHitModel import SearchHitModel
from utils.Statistics.Models.TeamAndIdModel import TeamAndIdModel
from utils.Statistics.Models.ChipModel import ChipModel


class CupStatisticsApiResponse:
    def __init__(self, cup_start, cup_last_gw, cup_data):
        ...
        self.cup_start = cup_start
        self.cup_last_gw = cup_last_gw
        self.cup_data = cup_data
    
    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)

class CupSearchHitModel:
    def __init__(self, user_id, name, team_name, round_lost, cup_round_data, hit_number):
        ...
        self.user_id = user_id
        self.name = name
        self.team_name = team_name
        self.round_lost = round_lost
        self.cup_round_data = cup_round_data
        self.hit_number = hit_number
    
    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)

class CupRoundHitModel:
    def __init__(self, opponent_entry_id, opponent_name, opponent_player_name, opponent_points, current_points, winner, current_cup_round):
        ...
        self.opponent_entry_id = opponent_entry_id
        self.opponent_name = opponent_name
        self.opponent_player_name = opponent_player_name
        self.opponent_points = opponent_points
        self.current_points = current_points
        self.winner = winner
        self.current_cup_round = current_cup_round
    
    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)

class CupAPIView(APIView):

    def get(self, request):
        league_name = str(request.GET.get('league_name')).lower()
        
        # get cup round start and end and current gw
        player_ownership_db = EliteserienCupStatistics.objects.all()
        temp = player_ownership_db
        cup_last_gw = player_ownership_db.aggregate(Max('round_lost'))['round_lost__max'] + 1
        cup_start = temp.filter(round_lost__gte=0).aggregate(Min('round_lost'))['round_lost__min']

        response = CupStatisticsApiResponse(cup_start, cup_last_gw, [])

        return JsonResponse(response.toJson(), safe=False)

    def post(self, request, format=None):
        try:
            # want to extract cup data for one and one round (gw)
            # if round 2, then get all games from gw 2, make sure to not return duplicates id:1 agaist id:23 and id:23 against id:1
            querys = request.data.get("query").lower().split(" ")
            cup_round = int(request.data.get("cup_round"))
            player_ownership_db = EliteserienCupStatistics.objects.all()
            temp = player_ownership_db
            cup_last_gw = player_ownership_db.aggregate(Max('round_lost'))['round_lost__max']
            cup_start = temp.filter(round_lost__gte=0).aggregate(Min('round_lost'))['round_lost__min']

            criterion1 = Q(round_lost__gte=cup_round)
            criterion2 = Q(round_lost=-1)
            player_ownership_db = player_ownership_db.filter(criterion1 | criterion2)
            
            duplicate_ids = []
            list_of_hits = [] 
            for hit in player_ownership_db:
                hit_number = 0
                cup_data = hit.cup_history[cup_round-cup_start].split(cup_db_delimiter)
                for query in querys:
                    if (query.lower() in hit.name.lower() or query.lower() in hit.team_name.lower() or query.lower() in cup_data[1].lower() or query.lower() in cup_data[2].lower()):
                        hit_number += 1
                if hit.id not in duplicate_ids and (hit_number > 0 or len(querys) == 0):
                    cup_data_object = CupRoundHitModel(
                        cup_data[0],
                        cup_data[1],
                        cup_data[2],
                        cup_data[3],
                        cup_data[4],
                        cup_data[5],
                        cup_data[6])
                    list_of_hits.append(
                        CupSearchHitModel(
                            hit.id, 
                            hit.name, 
                            hit.team_name,
                            hit.round_lost,
                            cup_data_object.toJson(),
                            hit_number))

                    duplicate_ids.append(int(hit.id))
                    duplicate_ids.append(int(cup_data[0]))
            # newlist = sorted(list_of_hits, key=lambda x: x.name, reverse=True)
            
            # list_of_hits = [i.toJson() for i in newlist]
            # print(len(list_of_hits), len(player_ownership_db))
            # for i in list_of_hits:
            #     print(i.name, i.user_id, i.cup_round_data)

            response = CupStatisticsApiResponse(cup_start, cup_last_gw, list_of_hits)

            return JsonResponse(response.toJson(), safe=False)


        except:
            return Response({'Bad Request': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)


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
            team_names_and_ids_list.append(TeamAndIdModel(team.team_name, team.team_id).toJson())
        
        chip_data = []

        chips_db_data = EliteserienChipsAndUserInfo.objects.all() if league_name == eliteserien_folder_name else PremierLeagueChipsAndUserInfo.objects.all()

        for i in chips_db_data:
            chip_model = ChipModel(i.gw, i.extra_info_top_1000, i.total_chip_usage_1000) if league_name == eliteserien_folder_name else ChipModel(i.gw, i.extra_info_top_10000, i.total_chip_usage_10000)
            chip_data.append(chip_model)
        
        top_x_managers_list_pl = [100, 1000, 10000]
        top_x_managers_list_eliteserien = [100, 1000, 5000]
        
        top_x_managers_list = top_x_managers_list_eliteserien if league_name == eliteserien_folder_name else top_x_managers_list_pl

        response = PlayerOwnershipApiResponse(empty_response, newest_updated_gw, all_gws, team_names_and_ids_list, chip_data, top_x_managers_list) 

        return JsonResponse(response.toJson(), safe=False)

    def post(self, request, format=None):
        try:
            top_x_players = int(request.data.get("top_x_players"))
            current_gw = int(request.data.get("current_gw"))
            league_name = str(request.data.get("league_name")).lower()
            chips_db_data = EliteserienChipsAndUserInfo.objects.all() if league_name == eliteserien_folder_name else PremierLeagueChipsAndUserInfo.objects.all()
            player_ownership_db = []
            chip_data = []
            
            if (top_x_players == 100):
                player_ownership_db = EliteserienGlobalOwnershipStats100.objects.all() if league_name == eliteserien_folder_name else PremierLeagueGlobalOwnershipStats100.objects.all()
                for i in chips_db_data:
                    chip_data.append(ChipModel(i.gw, i.extra_info_top_100, i.total_chip_usage_100))
                
            elif (top_x_players == 1000):
                player_ownership_db = EliteserienGlobalOwnershipStats1000.objects.all() if league_name == eliteserien_folder_name else PremierLeagueGlobalOwnershipStats1000.objects.all()
                for i in chips_db_data:
                    chip_data.append(ChipModel(i.gw, i.extra_info_top_1000, i.total_chip_usage_1000))
            
            elif (top_x_players == 5000):
                player_ownership_db = EliteserienGlobalOwnershipStats5000.objects.all()
                for i in chips_db_data:
                    chip_data.append(ChipModel(i.gw, i.extra_info_top_5000, i.total_chip_usage_5000))
            
            elif (top_x_players == 10000):
                player_ownership_db = PremierLeagueGlobalOwnershipStats10000.objects.all()
                for i in chips_db_data:
                    chip_data.append(ChipModel(i.gw, i.extra_info_top_10000, i.total_chip_usage_10000))
            
            empty_response = []
            if len(player_ownership_db) == 0:
                return JsonResponse(empty_response, safe=False)

            for i in player_ownership_db:
                empty_response.append(i.toJson())
            
            team_names_and_ids_list = []
            team_names_and_ids = EliteserienTeamInfo.objects.all() if league_name == eliteserien_folder_name else PremierLeagueTeamInfo.objects.all()
            
            for team in team_names_and_ids:
                team_names_and_ids_list.append(TeamAndIdModel(team.team_name, team.team_id).toJson())

            top_x_managers_list_pl = [100, 1000, 10000]
            top_x_managers_list_eliteserien = [100, 1000, 5000]
            
            top_x_managers_list = top_x_managers_list_eliteserien if league_name == eliteserien_folder_name else top_x_managers_list_pl

            response = PlayerOwnershipApiResponse(empty_response, current_gw, [], team_names_and_ids_list, chip_data, top_x_managers_list) 
            return JsonResponse(response.toJson(), safe=False)

        except:
            return Response({'Bad Request': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)



class MostOwnedPlayersLineUpAPIView(APIView):

    def get(self, request):
        league_name = str(request.GET.get('league_name')).lower()

        empty_response = []

        newest_updated_gw, all_gws = get_last_updated_gw_and_all_gws_eliteserien() if league_name == eliteserien_folder_name else get_last_updated_gw_and_all_gws_premier_league()

        if (newest_updated_gw == 0): 
            return JsonResponse(empty_response, safe=False)

        player_ownership_db = EliteserienGlobalOwnershipStats1000.objects.all() if league_name == eliteserien_folder_name else PremierLeagueGlobalOwnershipStats10000.objects.all()


        top_x_players = 1000 if league_name == eliteserien_folder_name else 10000

        ownership_data = []
        for player_ownership in player_ownership_db:
            data = json.loads(player_ownership.toJson())
            gw_data = data['gw_' + str(newest_updated_gw)]
            temp = [data['player_id'], data['player_team_id'], data['player_position_id'], data['player_name'], (gw_data[0] + gw_data[1] * 2 + gw_data[2] * 3) / top_x_players * 100]
            ownership_data.append(temp)
        
        ownership_data = sorted(ownership_data, key=lambda x: x[4], reverse=True)
        
        goalkeeper_list, max_goalkeepers = [], 2
        defender_list, max_defenderss = [], 5
        midtfielder_list, max_midtfielders = [], 5
        forward_list, max_forwards = [], 3

        for i in ownership_data:
            if (i[2] == 1 and len(goalkeeper_list) != max_goalkeepers):
                goalkeeper_list.append(i)
            if (i[2] == 2 and len(defender_list) != max_defenderss):
                defender_list.append(i)
            if (i[2] == 3 and len(midtfielder_list) != max_midtfielders):
                midtfielder_list.append(i)
            if (i[2] == 4 and len(forward_list) != max_forwards):
                forward_list.append(i)
            if (len(goalkeeper_list) == max_goalkeepers and len(defender_list) == max_defenderss and len(midtfielder_list) == max_midtfielders and len(forward_list) == max_forwards):
                break
       
        response = MostOwnedPlayersApiResponse(newest_updated_gw, goalkeeper_list, defender_list, midtfielder_list, forward_list)

        return JsonResponse([response.toJson()], safe=False)

    def post(self, request, format=None):
        try:
            top_x_players = int(request.data.get("top_x_players"))
            current_gw = int(request.data.get("current_gw"))
            league_name = str(request.data.get("league_name")).lower()
            chips_db_data = EliteserienChipsAndUserInfo.objects.all() if league_name == eliteserien_folder_name else PremierLeagueChipsAndUserInfo.objects.all()
            player_ownership_db = []
            chip_data = []
            
            if (top_x_players == 100):
                player_ownership_db = EliteserienGlobalOwnershipStats100.objects.all() if league_name == eliteserien_folder_name else PremierLeagueGlobalOwnershipStats100.objects.all()
                for i in chips_db_data:
                    chip_data.append(ChipModel(i.gw, i.extra_info_top_100, i.total_chip_usage_100))
                
            elif (top_x_players == 1000):
                player_ownership_db = EliteserienGlobalOwnershipStats1000.objects.all() if league_name == eliteserien_folder_name else PremierLeagueGlobalOwnershipStats1000.objects.all()
                for i in chips_db_data:
                    chip_data.append(ChipModel(i.gw, i.extra_info_top_1000, i.total_chip_usage_1000))
            
            elif (top_x_players == 5000):
                player_ownership_db = EliteserienGlobalOwnershipStats5000.objects.all()
                for i in chips_db_data:
                    chip_data.append(ChipModel(i.gw, i.extra_info_top_5000, i.total_chip_usage_5000))
            
            elif (top_x_players == 10000):
                player_ownership_db = PremierLeagueGlobalOwnershipStats10000.objects.all()
                for i in chips_db_data:
                    chip_data.append(ChipModel(i.gw, i.extra_info_top_10000, i.total_chip_usage_10000))
            
            empty_response = []

            if (current_gw == 0): 
                return JsonResponse(empty_response, safe=False)

            player_ownership_db = EliteserienGlobalOwnershipStats1000.objects.all() if league_name == eliteserien_folder_name else PremierLeagueGlobalOwnershipStats10000.objects.all()

            ownership_data = []
            for player_ownership in player_ownership_db:
                data = json.loads(player_ownership.toJson())
                gw_data = data['gw_' + str(current_gw)]
                temp = [data['player_id'], data['player_team_id'], data['player_position_id'], data['player_name'], (gw_data[0] + gw_data[1] * 2 + gw_data[2] * 3) / 1000 * 100]
                ownership_data.append(temp)
            
            ownership_data = sorted(ownership_data, key=lambda x: x[4], reverse=True)
            
            goalkeeper_list, max_goalkeepers = [], 2
            defender_list, max_defenderss = [], 5
            midtfielder_list, max_midtfielders = [], 5
            forward_list, max_forwards = [], 3

            for i in ownership_data:
                if (i[2] == 1 and len(goalkeeper_list) != max_goalkeepers):
                    goalkeeper_list.append(i)
                if (i[2] == 2 and len(defender_list) != max_defenderss):
                    defender_list.append(i)
                if (i[2] == 3 and len(midtfielder_list) != max_midtfielders):
                    midtfielder_list.append(i)
                if (i[2] == 4 and len(forward_list) != max_forwards):
                    forward_list.append(i)
                if (len(goalkeeper_list) == max_goalkeepers and len(defender_list) == max_defenderss and len(midtfielder_list) == max_midtfielders and len(forward_list) == max_forwards):
                    break
        
            response = MostOwnedPlayersApiResponse(current_gw, goalkeeper_list, defender_list, midtfielder_list, forward_list)

            return JsonResponse([response.toJson()], safe=False)

        except:
            return Response({'Bad Request': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)
 

class SearchUserNameAPIView(APIView):

    def post(self, request, format=None):
        try:
            querys = request.data.get("query").lower().split(" ")

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
            
            newlist = sorted(list_of_hits, key=lambda x: x.hit_text, reverse=True)
            
            list_of_hits = [i.toJson() for i in newlist]

            fantasy_manager_url = fantasy_manager_eliteserien_url
            response = SearchUserNameApiResponse(fantasy_manager_url, list_of_hits) 

            return JsonResponse(response.toJson(), safe=False)

        except:
            return Response({'Bad Request': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)


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
                        RankStatisticsModel(
                            user_id, 
                            hit.user_first_name + " " + hit.user_last_name,
                            hit.user_team_name,
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
            response = RankStatisticsApiResponse(fantasy_manager_url, list_of_ranks[:1000], number_of_last_years) 

            return JsonResponse(response.toJson(), safe=False)

        except:
            return Response({'Bad Request': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)


class PlayerStatisticsAPIView(APIView):

    def get(self, request):
        total_number_of_gws = len(PremierLeaguePlayers.objects.all()[0].round_list) - 1
        categories = get_dict_sort_on_short_name_to_sort_on_name().keys()
        list_of_categories = [i for i in categories]
        list_of_categories = list(map(lambda x: x.replace('Total points', 'Points'), list_of_categories))

        response = PlayerStatisticsApiResponse(3, [], list_of_categories, [], total_number_of_gws) 

        return JsonResponse(response.toJson(), safe=False)

    def post(self, request, format=None):
        try:
            league_name = str(request.data.get('league_name')).lower()
            last_x_gw = int(request.data.get("last_x_gw"))
            sort_on = "Total points"
            sort_index = get_dict_sort_on_short_name_to_sort_on_name()[sort_on]
            fpl_players_with_info = get_player_statistics_from_db("All", sort_index, "-")
          
            player_info = []
            max_gws = 0
            if last_x_gw == 0:
                last_x_rounds = total_number_of_gameweeks
            else:
                last_x_rounds = int(last_x_gw)

            last_x_rounds = total_number_of_gameweeks if last_x_gw == 0 else int(last_x_gw)

            for fpl_player_i in fpl_players_with_info:
                fpl_player_i_has_played_how_many_rounds = len(fpl_player_i.round_list) - 1
                max_gws = max(fpl_player_i_has_played_how_many_rounds, max_gws)
                num_rounds = min(fpl_player_i_has_played_how_many_rounds, last_x_rounds)
                
                name = fpl_player_i.player_web_name
                player_team_id = fpl_player_i.player_team_id
                player_position_id = fpl_player_i.player_position_id
                
                if last_x_gw == 0:
                    points = round(fpl_player_i.total_points_list[0], 2)
                    bps = round(fpl_player_i.bps_list[0], 2)
                    ict_index = round(float(fpl_player_i.ict_index_list[0]), 2)
                    influence = round(float(fpl_player_i.influence_list[0]), 2)
                    creativity = round(float(fpl_player_i.creativity_list[0]), 2)
                    threat = round(float(fpl_player_i.threat_list[0]), 2)
                    model = PlayerStatisticsModel(name, points, bps, ict_index, influence, creativity, threat, player_team_id, player_position_id)

                else:
                    points = round(np.mean(fpl_player_i.total_points_list[-num_rounds:]), 2)
                    bps = round(np.mean(fpl_player_i.bps_list[-num_rounds:]), 2)
                    ict_index = round(np.mean(convert_list_with_strings_to_floats(fpl_player_i.ict_index_list[-num_rounds:])), 2)
                    influence = round(np.mean(convert_list_with_strings_to_floats(fpl_player_i.influence_list[-num_rounds:])), 2)
                    creativity = round(np.mean(convert_list_with_strings_to_floats(fpl_player_i.creativity_list[-num_rounds:])), 2)
                    threat = round(np.mean(convert_list_with_strings_to_floats(fpl_player_i.threat_list[-num_rounds:])), 2)     
                    model = PlayerStatisticsModel(name, points, bps, ict_index, influence, creativity, threat, player_team_id, player_position_id)
                
                player_info.append(model)

            player_info = sorted(player_info, key=lambda x: x.Points, reverse=True)
            categories = get_dict_sort_on_short_name_to_sort_on_name().keys()
           
            list_of_categories = [i for i in categories]
            list_of_categories = list(map(lambda x: x.replace('Total points', 'Points'), list_of_categories))
            
            team_names_and_ids_list = []
            team_names_and_ids = EliteserienTeamInfo.objects.all() if league_name == eliteserien_folder_name else PremierLeagueTeamInfo.objects.all()
            
            for team in team_names_and_ids:
                team_names_and_ids_list.append(TeamAndIdModel(team.team_name, team.team_id).toJson())

            response = PlayerStatisticsApiResponse(last_x_gw, player_info, list_of_categories, team_names_and_ids_list, -1) 

            return JsonResponse(response.toJson(), safe=False)

        except:
            return Response({'Bad Request': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)


class RankAndPointsAPIView(APIView):

    def get(self, request):
        response_list = []
        rank_and_points_db = EliteserienRankAndPoints.objects.latest('gw')
        
        for rank_and_point in rank_and_points_db.ranking_history:
            split_rank_and_point = rank_and_point.split(ranking_delimiter)
            response_list.append(split_rank_and_point)

        response = RankAndPointsApiResponse(rank_and_points_db.gw, response_list) 
        return JsonResponse(response.toJson(), safe=False)

    def post(self, request, format=None):
        try:
            response_list = []
            gw = int(request.data.get("gw"))
            rank_and_points_db = EliteserienRankAndPoints.objects.filter(gw=gw)

            if (len(rank_and_points_db) == 0):
                response = RankAndPointsApiResponse(-1, response_list) 
                return JsonResponse(response.toJson(), safe=False)

            for rank_and_point in rank_and_points_db.ranking_history:
                split_rank_and_point = rank_and_point.split(ranking_delimiter)
                response_list.append(split_rank_and_point)

            response = RankAndPointsApiResponse(rank_and_points_db.gw, response_list) 
            return JsonResponse(response.toJson(), safe=False)

        except:
            return Response({'Bad Request': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)
        

class LiveFixturesAPIView(APIView):

    def get(self, request):
        league_name = str(request.GET.get('league_name')).lower()

        return JsonResponse([], safe=False)

    def post(self, request, format=None):
        try:
            league_name = str(request.data.get("league_name")).lower()

            gw = int(request.data.get("gw"))

            response = live_fixtures(league_name, gw)

            return JsonResponse(response.toJson(), safe=False)

        except:
            return Response({'Bad Request': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)
