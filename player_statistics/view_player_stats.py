from player_statistics.utility_functions.utility_functions_player_statistics import (
    get_sort_index_and_categories_eliteserien,
    list_eliteserien_info_from_db,
    get_sort_index_and_categories_premier_league,
    get_team_names_and_ids_to_list,
    list_premier_league_info_from_db
)
from constants import esf

from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import JsonResponse
from rest_framework import status

from player_statistics.db_models.eliteserien.player_statistics_model import EliteserienPlayerStatistic
from player_statistics.db_models.premier_league.player_statistics_model import PremierLeaguePlayers
from models.statistics.apiResponse.PlayerStatisticsApiResponse import PlayerStatisticsApiResponse


class PlayerStatisticsAPIView(APIView):

    def get(self, request, format=None):
        try:
            league_name = request.GET.get('league_name', '').lower()
            last_x_gw = int(request.GET.get("last_x_gw", 0))

            if league_name == esf:
                sort_index, categories = get_sort_index_and_categories_eliteserien(sort_on="Total points")
                player_info = list_eliteserien_info_from_db(sort_index, last_x_gw)
                max_object = max(EliteserienPlayerStatistic.objects.all(), key=lambda obj: len(obj.round_list))
            else:
                sort_index, categories = get_sort_index_and_categories_premier_league(sort_on="Total points")
                player_info = list_premier_league_info_from_db(sort_index, last_x_gw)
                max_object = max(PremierLeaguePlayers.objects.all(), key=lambda obj: len(obj.round_list))

            team_names_and_ids_list = get_team_names_and_ids_to_list(league_name)
            total_number_of_gws = len(max_object.round_list) - 2

            response = PlayerStatisticsApiResponse(
                last_x_gw,
                player_info,
                categories,
                team_names_and_ids_list,
                total_number_of_gws
            )

            return JsonResponse(response.toJson(), safe=False)

        except ValueError as e:
            return Response({'Bad Request': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'Bad Request': 'Something went wrong: ' + str(e)}, status=status.HTTP_400_BAD_REQUEST)