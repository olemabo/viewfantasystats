from rest_framework import serializers

from .models import EliteserienTeamInfo

class ElitserienTeamInfoSerializer(serializers.ModelSerializer):
    teamId = serializers.IntegerField(source="team_id") 
    teamName = serializers.CharField(source="team_name") 
    teamShortName = serializers.CharField(source="team_short_name")

    class Meta:
        model = EliteserienTeamInfo
        fields = (
            "teamName", 
            "teamId", 
            "teamShortName", 
            "date", 
            "oppTeamNameList",
            "oppTeamHomeAwayList", 
            "oppTeamDifficultyScore", 
            "gw",
        )