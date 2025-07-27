from constants import esf

from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import JsonResponse
from rest_framework import status
import traceback

from player_statistics.db_models.eliteserien.ownership_statistics_model_eliteserien import *
from player_statistics.db_models.premier_league.ownership_statistics_model import *
from fixture_planner_eliteserien.models import EliteserienTeamInfo
from fixture_planner.models import PremierLeagueTeamInfo

from models.statistics.utils.GetLastUpdatedGws import get_last_updated_gw_and_all_gws_eliteserien, get_last_updated_gw_and_all_gws_premier_league

from models.statistics.apiResponse.PlayerOwnershipApiResponse import PlayerOwnershipApiResponse, PlayerOwnershipApiResponseSerializer

from player_statistics.teams.team_model import TeamModel
from models.statistics.models.ChipModel import ChipModel
from player_statistics.utility_functions.utility_functions_ownership_statistics import checkIfLatestGwIsUpdating


class PlayerOwnershipAPIView(APIView):
    def get(self, request, format=None):
        try:
            league_name = str(request.GET.get("league_name")).lower()

            top_x_players = request.GET.get('top_x_players')
            if top_x_players is not None or top_x_players == 0:
                top_x_players = int(top_x_players)

            current_gw = request.GET.get('current_gw')
            if current_gw is not None:
                current_gw = int(current_gw)

            newest_updated_gw, all_gws = get_last_updated_gw_and_all_gws_eliteserien() if league_name == esf else get_last_updated_gw_and_all_gws_premier_league()

            if current_gw is None or current_gw == 0:
                current_gw = newest_updated_gw
            
            is_updating_precentage, is_updating_gw = checkIfLatestGwIsUpdating(league_name)

            if (newest_updated_gw == 0): 
                return JsonResponse([], safe=False)

            chips_db_data = EliteserienChipsAndUserInfo.objects.all() if league_name == esf else PremierLeagueChipsAndUserInfo.objects.all()
            player_ownership_db, chip_data = [], []
            
            if (top_x_players == 100):
                player_ownership_db = EliteserienGlobalOwnershipStats100.objects.all() if league_name == esf else PremierLeagueGlobalOwnershipStats100.objects.all()
                chip_data = [ChipModel(i.gw, i.extra_info_top_100, i.total_chip_usage_100).to_dict() for i in chips_db_data]
                
            elif (top_x_players == 1000):
                player_ownership_db = EliteserienGlobalOwnershipStats1000.objects.all() if league_name == esf else PremierLeagueGlobalOwnershipStats1000.objects.all()
                chip_data = [ChipModel(i.gw, i.extra_info_top_1000, i.total_chip_usage_1000).to_dict() for i in chips_db_data]
            
            elif (top_x_players == 5000):
                player_ownership_db = EliteserienGlobalOwnershipStats5000.objects.all()
                chip_data = [ChipModel(i.gw, i.extra_info_top_5000, i.total_chip_usage_5000).to_dict() for i in chips_db_data]

            elif (top_x_players == 10000):
                player_ownership_db = PremierLeagueGlobalOwnershipStats10000.objects.all()
                chip_data = [ChipModel(i.gw, i.extra_info_top_10000, i.total_chip_usage_10000).to_dict() for i in chips_db_data]
            else:
                chip_data = [
                    ChipModel(i.gw, i.extra_info_top_1000 if league_name == esf else i.extra_info_top_10000, i.total_chip_usage_1000 if league_name == esf else i.total_chip_usage_10000).to_dict()
                    for i in chips_db_data
                ]
                player_ownership_db = EliteserienGlobalOwnershipStats100.objects.all() if league_name == esf else PremierLeagueGlobalOwnershipStats10000.objects.all()
            
            if len(player_ownership_db) == 0:
                return JsonResponse([], safe=False)

            empty_response = [item.toJson() for item in player_ownership_db]
            
            team_names_and_ids_list = []
            team_names_and_ids = EliteserienTeamInfo.objects.all() if league_name == esf else PremierLeagueTeamInfo.objects.all()
            
            team_names_and_ids_list = [TeamModel(team.team_name, team.team_id).toJson() for team in team_names_and_ids]
            
            top_x_managers_list_pl = [100, 1000, 10000]
            top_x_managers_list_eliteserien = [100, 1000, 5000]
            
            top_x_managers_list = top_x_managers_list_eliteserien if league_name == esf else top_x_managers_list_pl

            response_data = PlayerOwnershipApiResponse(
                empty_response, 
                current_gw, 
                all_gws, 
                team_names_and_ids_list, 
                chip_data, 
                top_x_managers_list, 
                is_updating_precentage, 
                is_updating_gw
            )

            serializer = PlayerOwnershipApiResponseSerializer(response_data)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            print("Exception in PlayerOwnershipAPIView:", str(e))
            traceback.print_exc()
            return JsonResponse({'Bad Request': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)