from rest_framework import serializers
from .models import AddPlTeamsToDB, KickOffTime

class GetKickOffTimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = KickOffTime
        fields = ('gameweek', 'kickoff_time', 'day_month')

class AddPlTeamsToDBSerializer(serializers.ModelSerializer):
    class Meta:
        model = AddPlTeamsToDB
        fields = ("team_name", "team_id", "team_short_name", "date", "oppTeamNameList",
        "oppTeamHomeAwayList", "oppTeamDifficultyScore", "gw")