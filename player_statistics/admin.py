from player_statistics.db_models.ownership_statistics_model import ExtraInfoStatistics, GlobalOwnershipStats100, \
    GlobalOwnershipStats1000, GlobalOwnershipStats10000, GwsChecked
from player_statistics.db_models.nationality_statistics_model import NationalityStatistics
from player_statistics.db_models.player_statistics_model import FPLPlayersModel
from django.contrib import admin


admin.site.register(FPLPlayersModel)
admin.site.register(GlobalOwnershipStats100)
admin.site.register(GlobalOwnershipStats1000)
admin.site.register(GlobalOwnershipStats10000)
admin.site.register(ExtraInfoStatistics)
admin.site.register(NationalityStatistics)
admin.site.register(GwsChecked)
