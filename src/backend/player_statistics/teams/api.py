from constants import esf

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from fixture_planner_eliteserien.models import EliteserienTeamInfo
from fixture_planner.models import PremierLeagueTeamInfo
from player_statistics.teams.team_model import TeamModel


class TeamAPIView(APIView):
    def get(self, request, format=None):
        try:
            league_name = request.GET.get('league_name', '').lower()

            if league_name == esf:
                team_queryset = EliteserienTeamInfo.objects.all()
            else:
                team_queryset = PremierLeagueTeamInfo.objects.all()

            team_data = [TeamModel(team.team_name, team.team_id).toJson() for team in team_queryset]

            return Response(team_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': f"Could not retrieve team data: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)