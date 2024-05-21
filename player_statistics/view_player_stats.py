from player_statistics.utility_functions.utility_functions_player_statistics import get_sort_index_and_categories_eliteserien, list_eliteserien_info_from_db, get_sort_index_and_categories_premier_league, get_team_names_and_ids_to_list, list_premier_league_info_from_db
from constants import esf

from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import JsonResponse
from rest_framework import status

from player_statistics.db_models.eliteserien.ownership_statistics_model_eliteserien import *
from player_statistics.db_models.premier_league.ownership_statistics_model import *

from player_statistics.db_models.eliteserien.player_statistics_model import EliteserienPlayerStatistic
from player_statistics.db_models.premier_league.player_statistics_model import PremierLeaguePlayers

from models.statistics.apiResponse.PlayerStatisticsApiResponse import PlayerStatisticsApiResponse


class PlayerStatisticsAPIView(APIView):

    def get(self, request, format=None):
        try:
            league_name = str(request.GET.get('league_name')).lower()
            last_x_gw = int(request.GET.get("last_x_gw"))
            sort_index, list_of_categories, player_info = [], [], []

            if league_name == esf:
                sort_index, list_of_categories = get_sort_index_and_categories_eliteserien(sort_on="Total points") 
                player_info = list_eliteserien_info_from_db(sort_index, last_x_gw)

            else:
                sort_index, list_of_categories = get_sort_index_and_categories_premier_league(sort_on="Total points")
                player_info = list_premier_league_info_from_db(sort_index, last_x_gw)
            
            team_names_and_ids_list = get_team_names_and_ids_to_list(league_name)

            max_object = max(EliteserienPlayerStatistic.objects.all() if league_name == esf else PremierLeaguePlayers.objects.all(), key=lambda obj: len(obj.round_list))
            total_number_of_gws = len(max_object.round_list) - 2
            
            response = PlayerStatisticsApiResponse(last_x_gw, player_info, list_of_categories, team_names_and_ids_list, total_number_of_gws) 

            return JsonResponse(response.toJson(), safe=False)

        except:
            return Response({'Bad Request': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)