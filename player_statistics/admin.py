from player_statistics.db_models.premier_league.ownership_statistics_model import PremierLeagueChipsAndUserInfo, PremierLeagueGlobalOwnershipStats100, \
    PremierLeagueGlobalOwnershipStats1000, PremierLeagueGlobalOwnershipStats10000, PremierLeagueGwsChecked
from player_statistics.db_models.premier_league.nationality_statistics_model import PremierLeagueNationalityStatistics
from player_statistics.db_models.eliteserien.nationality_statistics_model_eliteserien import EliteserienNationalityStatistics
from player_statistics.db_models.premier_league.player_statistics_model import PremierLeaguePlayers
from player_statistics.db_models.eliteserien.ownership_statistics_model_eliteserien import EliteserienGwsChecked, EliteserienGlobalOwnershipStats5000, EliteserienGlobalOwnershipStats1000, EliteserienGlobalOwnershipStats100, EliteserienChipsAndUserInfo
from player_statistics.db_models.eliteserien.user_statistics_model_eliteserien import EliteserienUserInfoStatistics
from player_statistics.db_models.eliteserien.player_statistics_model import EliteserienPlayerStatistic
from player_statistics.db_models.eliteserien.rank_and_points_eliteserien import EliteserienRankAndPoints
from player_statistics.db_models.eliteserien.cup_statistics_model_eliteserien import EliteserienCupStatistics
from django.contrib import admin


class CupAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'round_lost', 'qualification_rank')


class NationalityAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'number_of_managers_from_this_country') 

class OwnershipAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'player_team_id', 'player_position_id', 'player_id') 

class PlayerAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'player_team_id', 'player_position_id', 'player_id')

class GWCheckedAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'date_modified')

class UserAdmin(admin.ModelAdmin):
    list_display = ('user_first_name', 'user_last_name', 'user_team_name', 'user_id')

admin.site.register(PremierLeagueNationalityStatistics, NationalityAdmin)
admin.site.register(PremierLeagueGlobalOwnershipStats10000, OwnershipAdmin)
admin.site.register(PremierLeagueGlobalOwnershipStats1000, OwnershipAdmin)
admin.site.register(PremierLeagueGlobalOwnershipStats100, OwnershipAdmin)
admin.site.register(PremierLeagueGwsChecked, GWCheckedAdmin)
admin.site.register(PremierLeaguePlayers, PlayerAdmin)
admin.site.register(PremierLeagueChipsAndUserInfo)

admin.site.register(EliteserienNationalityStatistics, NationalityAdmin)
admin.site.register(EliteserienGlobalOwnershipStats5000, OwnershipAdmin)
admin.site.register(EliteserienGlobalOwnershipStats1000, OwnershipAdmin)
admin.site.register(EliteserienGlobalOwnershipStats100, OwnershipAdmin)
admin.site.register(EliteserienUserInfoStatistics, UserAdmin)
admin.site.register(EliteserienPlayerStatistic, PlayerAdmin)
admin.site.register(EliteserienGwsChecked, GWCheckedAdmin)
admin.site.register(EliteserienCupStatistics, CupAdmin)
admin.site.register(EliteserienChipsAndUserInfo)
admin.site.register(EliteserienRankAndPoints)
