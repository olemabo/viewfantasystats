from fixture_planner_eliteserien.backend.read_team_players_from_team_id import read_team_players_from_team_id
from utils.util_functions.convertFDRdata_to_FDR_Model import convertFDRToModel
from utils.util_functions.get_request_data import get_request_body
from utils.util_functions.get_kickoff_data import getKickOffData

from models.fixtures.apiResponse.FDRTeamIDApiResponse import FDRApiResponse, FDRTeamIDApiResponse
from models.fixtures.models.TeamNameShortPlayerNameModel import TeamNameShortPlayerNameModel
import fixture_planner.backend.create_data_objects as create_data_objects
from models.fixtures.models.FDRTeamIdModel import FDRTeamIDModel
from fixture_planner.models import PremierLeagueTeamInfo
from django.http import JsonResponse
from constants import fpl

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response


class PostFDRFromTeamIDView(APIView):
    
    def get(self, request):
        fixture_list_db = PremierLeagueTeamInfo.objects.all()
        
        temp_kick_off_time, first_upcoming_game = getKickOffData(fpl)

        number_of_gws = len(temp_kick_off_time)
        
        fdr_data_list = []
        for fdr_data in fixture_list_db:
            team_name_short = fdr_data.team_short_name

            fdr_dict = create_data_objects.create_FDR_dict(fdr_data)
            gw_i_list = [ convertFDRToModel(fdr_dict[gw_i]) for gw_i in range(1, number_of_gws + 1) ]
            
            fdr_data_list.append(FDRTeamIDModel(
                team_name_short,
                gw_i_list
            ).toJson())

        current_gws = [gw for gw in range(0, number_of_gws + 1)]
                                            
        gw_end = first_upcoming_game + 6 if len(current_gws) > 7 else current_gws[-1]
        gw_start = current_gws[0]
        max_gw = current_gws[-1]
        
        fdr_and_gws = FDRApiResponse(fdr_data_list, [], [], temp_kick_off_time, gw_start, gw_end, first_upcoming_game, max_gw) 

        return JsonResponse(fdr_and_gws.toJson(), safe=False)


    def post(self, request):
        try:
            goal_keepers, defenders, midtfielders, forwards = [], [], [], []

            fdr_and_gws = FDRTeamIDApiResponse(goal_keepers, defenders, midtfielders, forwards) 

            current_gw = get_request_body(request, "current_gw", int)

            team_id = get_request_body(request, "team_id", int)

            if team_id < 1:
                return JsonResponse(fdr_and_gws.toJson(), safe=False)

            player_info = read_team_players_from_team_id(team_id, current_gw, league_name=fpl)
            
            if player_info == 0:
                return JsonResponse(fdr_and_gws.toJson(), safe=False)
                                                
            for player_i in player_info:
                
                team_player_name = TeamNameShortPlayerNameModel(
                    player_name=player_i.player_name,
                    team_name_short=player_i.team_name_short
                ).toJson()
                
                if (player_i.position_id == 1):
                    goal_keepers.append(team_player_name) 
                if (player_i.position_id == 2):
                    defenders.append(team_player_name) 
                if (player_i.position_id == 3):
                    midtfielders.append(team_player_name) 
                if (player_i.position_id == 4):
                    forwards.append(team_player_name)

            fdr_and_gws.goal_keepers = goal_keepers
            fdr_and_gws.defenders = defenders
            fdr_and_gws.midtfielders = midtfielders
            fdr_and_gws.forwards = forwards
            
            return JsonResponse(fdr_and_gws.toJson(), safe=False)

        except:
            return Response({'Bad Request': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)

