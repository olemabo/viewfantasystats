from .models import PremierLeagueTeamInfo, KickOffTime
from rest_framework import serializers

class GetKickOffTimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = KickOffTime
        fields = ('gameweek', 'kickoff_time', 'day_month')

class PremierLeagueTeamInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PremierLeagueTeamInfo
        fields = ("team_name", "team_id", "team_short_name", "date", "oppTeamNameList",
        "oppTeamHomeAwayList", "oppTeamDifficultyScore", "gw")