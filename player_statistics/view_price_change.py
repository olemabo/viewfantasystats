from fixture_planner.models import PremierLeagueTeamInfo
from fixture_planner_eliteserien.models import EliteserienTeamInfo
from models.statistics.apiResponse.PriceChangeApiResponse import PriceChangeApiModel
from constants import esf

from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import JsonResponse
from rest_framework import status

from models.statistics.models.TeamAndIdModel import TeamAndIdModel
from player_statistics.utility_functions.utility_functions_price_change import GetTransferData


class PriceChangeAPIView(APIView):

    def get(self, request, format=None):
        try:
            league_name = request.GET.get('league_name', '').lower()
            current_gw = int(request.GET.get('gw', -1))

            player_transfers, current_gw = GetTransferData(league_name, useJson=True, gw=current_gw)

            team_names_and_ids = EliteserienTeamInfo.objects.all() if league_name == esf else PremierLeagueTeamInfo.objects.all()
            team_names_and_ids_list = [TeamAndIdModel(team.team_name, team.team_id).toJson() for team in team_names_and_ids]
            gw_list = [gw for gw in range(1, current_gw + 1)]

            response = PriceChangeApiModel(
                player_transfers,
                team_names_and_ids_list,
                gw_list
            )

            return JsonResponse(response.toJson(), safe=False)

        except ValueError as e:
            return Response({'Bad Request': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'Bad Request': 'Something went wrong: ' + str(e)}, status=status.HTTP_400_BAD_REQUEST)