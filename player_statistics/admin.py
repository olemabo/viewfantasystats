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


admin.site.register(PremierLeagueGlobalOwnershipStats10000)
admin.site.register(PremierLeagueGlobalOwnershipStats1000)
admin.site.register(PremierLeagueGlobalOwnershipStats100)
admin.site.register(PremierLeagueNationalityStatistics)
admin.site.register(PremierLeagueChipsAndUserInfo)
admin.site.register(PremierLeagueGwsChecked)
admin.site.register(PremierLeaguePlayers)

admin.site.register(EliteserienGlobalOwnershipStats5000)
admin.site.register(EliteserienGlobalOwnershipStats1000)
admin.site.register(EliteserienGlobalOwnershipStats100)
admin.site.register(EliteserienNationalityStatistics)
admin.site.register(EliteserienUserInfoStatistics)
admin.site.register(EliteserienChipsAndUserInfo)
admin.site.register(EliteserienPlayerStatistic)
admin.site.register(EliteserienRankAndPoints)
admin.site.register(EliteserienCupStatistics)
admin.site.register(EliteserienGwsChecked)
