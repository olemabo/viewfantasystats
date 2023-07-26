
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import JsonResponse
from rest_framework import status

from player_statistics.db_models.eliteserien.ownership_statistics_model_eliteserien import *
from player_statistics.db_models.premier_league.ownership_statistics_model import *

from player_statistics.backend.read_api_live.live_fixture_data import live_fixtures


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