from player_statistics.backend.fill_db_from_txt.fill_db_global_statistics import write_global_stats_to_db

from constants import premier_league_folder_name, eliteserien_folder_name, local_host_url

from django.http import HttpResponse

from player_statistics.backend.fill_db_from_txt.fill_db_global_statistics_eliteserien import write_global_stats_to_db_eliteserien
from player_statistics.db_models.eliteserien.ownership_statistics_model_eliteserien import *
from player_statistics.db_models.premier_league.ownership_statistics_model import *

from player_statistics.backend.fill_db_from_txt.fill_db_cup_statistics_eliteserien import write_cup_statistics_to_db_eliteserien
from player_statistics.backend.read_api_data_to_txt.read_cup_info_statistics import read_cup_info_statistics_eliteserien

from player_statistics.backend.read_api_data_to_txt.read_global_statistics import save_all_global_stats_for_current_gw


def read_and_fill_cup_info_to_db_eliteserien(request):
    if (request.META['HTTP_HOST'] == local_host_url):
        read_cup_info_statistics_eliteserien()
        write_cup_statistics_to_db_eliteserien()
    return HttpResponse("Read and Filled Database User Info (EliteserienUserInfoStatistics)")


# DB functions. Should not be accessible in PRODUCTION
def fill_db_global_stats(request):
    if (request.META['HTTP_HOST'] == local_host_url):
        write_global_stats_to_db_eliteserien()
    return HttpResponse("Filled Database Global Data (GlobalOwnershipStatsXXXX)")


def read_and_fill_db_global_stats(request):
    if (request.META['HTTP_HOST'] == local_host_url):
        save_all_global_stats_for_current_gw(eliteserien_folder_name)
        # write_global_stats_to_db_eliteserien()
    return HttpResponse("Read global stats from api and filled Database Global Data (GlobalOwnershipStatsXXXX)")


def fill_db_global_stats_premier_league(request):
    if (request.META['HTTP_HOST'] == local_host_url):
        write_global_stats_to_db()
    return HttpResponse("Filled Database Global Data (GlobalOwnershipStatsXXXX)")


def read_and_fill_db_global_stats_premier_league(request):
    if (request.META['HTTP_HOST'] == local_host_url):
        save_all_global_stats_for_current_gw(premier_league_folder_name)
        write_global_stats_to_db()
    return HttpResponse("Filled Database Global Data (GlobalOwnershipStatsXXXX)")
