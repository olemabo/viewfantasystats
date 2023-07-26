from player_statistics.utility_functions.utility_functions_player_statistics import get_player_statistics_from_db
from utils.utility_functions import convert_list_with_strings_to_floats
from utils.dictionaries import dict_sort_on_short_name_to_sort_on_name

from constants import total_number_of_gameweeks, esf

from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import JsonResponse
from rest_framework import status
import numpy as np

from player_statistics.db_models.eliteserien.ownership_statistics_model_eliteserien import *
from player_statistics.db_models.premier_league.ownership_statistics_model import *
from fixture_planner_eliteserien.models import EliteserienTeamInfo
from fixture_planner.models import PremierLeagueTeamInfo

from player_statistics.db_models.premier_league.player_statistics_model import PremierLeaguePlayers

from models.statistics.apiResponse.PlayerStatisticsApiResponse import PlayerStatisticsApiResponse

from models.statistics.models.PlayerStatisticsModel import PlayerStatisticsModel
from models.statistics.models.TeamAndIdModel import TeamAndIdModel


class PlayerStatisticsAPIView(APIView):

    def get(self, request):
        total_number_of_gws = len(PremierLeaguePlayers.objects.all()[0].round_list) - 1
        categories = dict_sort_on_short_name_to_sort_on_name.keys()
        list_of_categories = [i for i in categories]
        list_of_categories = list(map(lambda x: x.replace('Total points', 'Points'), list_of_categories))

        response = PlayerStatisticsApiResponse(3, [], list_of_categories, [], total_number_of_gws) 

        return JsonResponse(response.toJson(), safe=False)

    def post(self, request, format=None):
        try:
            league_name = str(request.data.get('league_name')).lower()
            last_x_gw = int(request.data.get("last_x_gw"))
            
            sort_on = "Total points"
            sort_index = dict_sort_on_short_name_to_sort_on_name[sort_on]
            list_of_fpl_players_with_info = get_player_statistics_from_db("All", sort_index, "-")
          
            player_info, max_gws = [], 0
            last_x_rounds = total_number_of_gameweeks if last_x_gw == 0 else int(last_x_gw)

            for fpl_player_i in list_of_fpl_players_with_info:
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
                    minutes = round(float(fpl_player_i.minutes_list[0]), 0)
                    xG = 0 if fpl_player_i.expected_goals_list == None else round(float(fpl_player_i.expected_goals_list[0]), 2)
                    xA = 0 if fpl_player_i.expected_assists_list == None else round(float(fpl_player_i.expected_assists_list[0]), 2)
                    xGI = 0 if fpl_player_i.expected_goal_involvements_list == None else round(float(fpl_player_i.expected_goal_involvements_list[0]), 2)
                    xGC = 0 if fpl_player_i.expected_goals_conceded_list == None else round(float(fpl_player_i.expected_goals_conceded_list[0]), 2)
                    model = PlayerStatisticsModel(name, points, bps, ict_index, influence, creativity, 
                                                  threat, player_team_id, player_position_id, xG, xA, xGI, xGC, minutes)

                else:
                    points = round(np.mean(fpl_player_i.total_points_list[-num_rounds:]), 2)
                    bps = round(np.mean(fpl_player_i.bps_list[-num_rounds:]), 2)
                    ict_index = round(np.mean(convert_list_with_strings_to_floats(fpl_player_i.ict_index_list[-num_rounds:])), 2)
                    influence = round(np.mean(convert_list_with_strings_to_floats(fpl_player_i.influence_list[-num_rounds:])), 2)
                    creativity = round(np.mean(convert_list_with_strings_to_floats(fpl_player_i.creativity_list[-num_rounds:])), 2)
                    threat = round(np.mean(convert_list_with_strings_to_floats(fpl_player_i.threat_list[-num_rounds:])), 2)
                    xG = 0 if fpl_player_i.expected_goals_list == None else round(np.mean(convert_list_with_strings_to_floats(fpl_player_i.expected_goals_list[-num_rounds:])), 2)    
                    xA = 0 if fpl_player_i.expected_assists_list == None else round(np.mean(convert_list_with_strings_to_floats(fpl_player_i.expected_assists_list[-num_rounds:])), 2)    
                    xGI = 0 if fpl_player_i.expected_goal_involvements_list == None else round(np.mean(convert_list_with_strings_to_floats(fpl_player_i.expected_goal_involvements_list[-num_rounds:])), 2)    
                    xGC = 0 if fpl_player_i.expected_goals_conceded_list == None else round(np.mean(convert_list_with_strings_to_floats(fpl_player_i.expected_goals_conceded_list[-num_rounds:])), 2)    
                    minutes = 0 if fpl_player_i.minutes_list == None else round(np.mean(convert_list_with_strings_to_floats(fpl_player_i.minutes_list[-num_rounds:])), 0)    
                    
                    model = PlayerStatisticsModel(name, points, bps, ict_index, influence, creativity, 
                                                  threat, player_team_id, player_position_id, xG, xA, xGI, xGC, minutes)

                player_info.append(model)

            player_info = sorted(player_info, key=lambda x: x.Points, reverse=True)
            categories = dict_sort_on_short_name_to_sort_on_name.keys()
           
            list_of_categories = list(map(lambda x: x.replace('Total points', 'Points'), [i for i in categories]))
            
            team_names_and_ids = EliteserienTeamInfo.objects.all() if league_name == esf else PremierLeagueTeamInfo.objects.all()
            
            team_names_and_ids_list = [TeamAndIdModel(team.team_name, team.team_id).toJson() for team in team_names_and_ids]

            response = PlayerStatisticsApiResponse(last_x_gw, player_info, list_of_categories, team_names_and_ids_list, -1) 

            return JsonResponse(response.toJson(), safe=False)

        except:
            return Response({'Bad Request': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)


dict_sort_on_short_name_to_sort_on_name = {
    "Name": "player_name", 
    "Total points": "total_points_list", 
    "Mins": "Mins", 
    "xG": "expected_goals_list", "xA": "expected_assists_list", "xGI": "expected_goal_involvements_list", 
    "Bps": "bonus_list", 
    "ICT": "ict_index_list", "I": "influence_list", "C": "creativity_list", "T": "threat_list", 
    "xGC": "expected_goals_conceded_list"
}