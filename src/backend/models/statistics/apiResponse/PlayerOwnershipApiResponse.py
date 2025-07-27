from rest_framework import serializers

class PlayerOwnershipApiResponse:
    def __init__(
        self,
        ownershipdata,
        newest_updated_gw,
        available_gws,
        team_names_and_ids,
        chip_data,
        top_x_managers_list,
        is_updating_precentage=0,
        is_updating_gw=0,
    ):
        self.ownershipdata = ownershipdata
        self.newest_updated_gw = newest_updated_gw
        self.available_gws = available_gws
        self.team_names_and_ids = team_names_and_ids
        self.chip_data = chip_data
        self.top_x_managers_list = top_x_managers_list
        self.is_updating_precentage = is_updating_precentage
        self.is_updating_gw = is_updating_gw


class PlayerOwnershipApiResponseSerializer(serializers.Serializer):
    ownershipdata = serializers.DictField()
    newest_updated_gw = serializers.IntegerField()
    available_gws = serializers.ListField(child=serializers.IntegerField())
    team_names_and_ids = serializers.DictField()
    chip_data = serializers.DictField()
    top_x_managers_list = serializers.ListField(child=serializers.DictField())
    is_updating_precentage = serializers.FloatField(default=0)
    is_updating_gw = serializers.IntegerField(default=0)

    def to_representation(self, instance):
        return {
            "ownershipdata": instance.ownershipdata,
            "newest_updated_gw": instance.newest_updated_gw,
            "available_gws": instance.available_gws,
            "team_names_and_ids": instance.team_names_and_ids,
            "chip_data": instance.chip_data,
            "top_x_managers_list": instance.top_x_managers_list,
            "is_updating_precentage": instance.is_updating_precentage,
            "is_updating_gw": instance.is_updating_gw,
        }