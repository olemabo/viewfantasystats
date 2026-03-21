from rest_framework import serializers

from .models import EliteserienTeamInfo

class ElitserienTeamInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EliteserienTeamInfo
        fields = (
            "team_name", 
            "team_id", 
            "team_short_name", 
            "date", 
            "oppTeamNameList",
            "oppTeamHomeAwayList", 
            "oppTeamDifficultyScore", 
            "gw")