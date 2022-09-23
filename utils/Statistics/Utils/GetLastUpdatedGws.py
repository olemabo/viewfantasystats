from player_statistics.db_models.eliteserien.ownership_statistics_model_eliteserien import EliteserienGwsChecked
from player_statistics.db_models.premier_league.ownership_statistics_model import PremierLeagueGwsChecked


def get_last_updated_gw_and_all_gws_eliteserien():
    checkedGws = EliteserienGwsChecked.objects.all()
    if (len(checkedGws) > 0):
        gws_checked_1000 = checkedGws[0].gws_updated_1000
        if len(gws_checked_1000) > 0:
            return max(gws_checked_1000), gws_checked_1000
    return 0, []


def get_last_updated_gw_and_all_gws_premier_league():
    checkedGws = PremierLeagueGwsChecked.objects.all()
    if (len(checkedGws) > 0):
        gws_checked_10000 = checkedGws[0].gws_updated_10000
        if len(gws_checked_10000) > 0:
            return max(gws_checked_10000), gws_checked_10000
    return 0, []