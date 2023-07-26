from constants import esf

from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import JsonResponse
from rest_framework import status

from player_statistics.db_models.eliteserien.ownership_statistics_model_eliteserien import *
from player_statistics.db_models.premier_league.ownership_statistics_model import *
from fixture_planner_eliteserien.models import EliteserienTeamInfo
from fixture_planner.models import PremierLeagueTeamInfo

from models.statistics.utils.GetLastUpdatedGws import get_last_updated_gw_and_all_gws_eliteserien, get_last_updated_gw_and_all_gws_premier_league

from models.statistics.apiResponse.PlayerOwnershipApiResponse import PlayerOwnershipApiResponse

from models.statistics.models.TeamAndIdModel import TeamAndIdModel
from models.statistics.models.ChipModel import ChipModel


class PlayerOwnershipAPIView(APIView):

    def get(self, request):
        league_name = str(request.GET.get('league_name')).lower()

        empty_response = []

        newest_updated_gw, all_gws = get_last_updated_gw_and_all_gws_eliteserien() if league_name == esf else get_last_updated_gw_and_all_gws_premier_league()

        if (newest_updated_gw == 0): 
            return JsonResponse(empty_response, safe=False)

        player_ownership_db = EliteserienGlobalOwnershipStats1000.objects.all() if league_name == esf else PremierLeagueGlobalOwnershipStats10000.objects.all()

        if len(player_ownership_db) == 0:
            return JsonResponse(empty_response, safe=False)

        for i in player_ownership_db:
            empty_response.append(i.toJson())
        
        team_names_and_ids_list = []

        team_names_and_ids = EliteserienTeamInfo.objects.all() if league_name == esf else PremierLeagueTeamInfo.objects.all()

        for team in team_names_and_ids:
            team_names_and_ids_list.append(TeamAndIdModel(team.team_name, team.team_id).toJson())
        
        chip_data = []

        chips_db_data = EliteserienChipsAndUserInfo.objects.all() if league_name == esf else PremierLeagueChipsAndUserInfo.objects.all()

        for i in chips_db_data:
            chip_model = ChipModel(i.gw, i.extra_info_top_1000, i.total_chip_usage_1000) if league_name == esf else ChipModel(i.gw, i.extra_info_top_10000, i.total_chip_usage_10000)
            chip_data.append(chip_model)
        
        top_x_managers_list_pl = [100, 1000, 10000]
        top_x_managers_list_eliteserien = [100, 1000, 5000]
        
        top_x_managers_list = top_x_managers_list_eliteserien if league_name == esf else top_x_managers_list_pl

        response = PlayerOwnershipApiResponse(empty_response, newest_updated_gw, all_gws, team_names_and_ids_list, chip_data, top_x_managers_list) 

        return JsonResponse(response.toJson(), safe=False)

    def post(self, request, format=None):
        try:
            top_x_players = int(request.data.get("top_x_players"))
            current_gw = int(request.data.get("current_gw"))
            league_name = str(request.data.get("league_name")).lower()
            chips_db_data = EliteserienChipsAndUserInfo.objects.all() if league_name == esf else PremierLeagueChipsAndUserInfo.objects.all()
            player_ownership_db = []
            chip_data = []
            
            if (top_x_players == 100):
                player_ownership_db = EliteserienGlobalOwnershipStats100.objects.all() if league_name == esf else PremierLeagueGlobalOwnershipStats100.objects.all()
                for i in chips_db_data:
                    chip_data.append(ChipModel(i.gw, i.extra_info_top_100, i.total_chip_usage_100))
                
            elif (top_x_players == 1000):
                player_ownership_db = EliteserienGlobalOwnershipStats1000.objects.all() if league_name == esf else PremierLeagueGlobalOwnershipStats1000.objects.all()
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
            team_names_and_ids = EliteserienTeamInfo.objects.all() if league_name == esf else PremierLeagueTeamInfo.objects.all()
            
            for team in team_names_and_ids:
                team_names_and_ids_list.append(TeamAndIdModel(team.team_name, team.team_id).toJson())

            top_x_managers_list_pl = [100, 1000, 10000]
            top_x_managers_list_eliteserien = [100, 1000, 5000]
            
            top_x_managers_list = top_x_managers_list_eliteserien if league_name == esf else top_x_managers_list_pl

            response = PlayerOwnershipApiResponse(empty_response, current_gw, [], team_names_and_ids_list, chip_data, top_x_managers_list) 
            return JsonResponse(response.toJson(), safe=False)

        except:
            return Response({'Bad Request': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)
