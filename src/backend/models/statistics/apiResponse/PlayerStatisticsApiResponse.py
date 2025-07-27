from rest_framework import serializers

class PlayerStatisticsApiResponse:
    def __init__(self, last_x_gw, player_info, categories, total_number_of_gws):
        self.last_x_gw = last_x_gw
        self.categories = categories
        self.player_info = player_info
        self.total_number_of_gws = total_number_of_gws

    def to_dict(self):
        return {
            "last_x_gw": self.last_x_gw,
            "categories": self.categories,
            "player_info": self.player_info,
            "total_number_of_gws": self.total_number_of_gws,
        }
    

class PlayerStatisticsModelSerializer(serializers.Serializer):
    Name = serializers.CharField()
    player_team_id = serializers.IntegerField()
    player_position_id = serializers.IntegerField()
    player_statistics_list = serializers.ListField(child=serializers.FloatField())

class PlayerStatisticsApiResponseSerializer(serializers.Serializer):
    last_x_gw = serializers.IntegerField()
    player_info = PlayerStatisticsModelSerializer(many=True)
    categories = serializers.ListField(child=serializers.CharField())
    total_number_of_gws = serializers.IntegerField()
    # team_names_and_ids removed from constructor, add if you want

    def to_representation(self, instance):
        return {
            "last_x_gw": instance.last_x_gw,
            "player_info": PlayerStatisticsModelSerializer(instance.player_info, many=True).data,
            "categories": instance.categories,
            "total_number_of_gws": instance.total_number_of_gws,
        }
