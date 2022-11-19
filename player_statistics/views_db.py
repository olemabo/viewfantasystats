from player_statistics.backend.fill_db_from_txt.fill_db_player_statistics import fill_database_all_players
from player_statistics.backend.fill_db_from_txt.fill_db_global_statistics import write_global_stats_to_db

from constants import premier_league_folder_name, eliteserien_folder_name

from django.http import HttpResponse

from player_statistics.backend.fill_db_from_txt.fill_db_global_statistics_eliteserien import write_global_stats_to_db_eliteserien
from player_statistics.db_models.eliteserien.ownership_statistics_model_eliteserien import *
from player_statistics.db_models.premier_league.ownership_statistics_model import *


from player_statistics.backend.fill_db_from_txt.fill_db_user_info_statistics_eliteserien import write_user_info_to_db_eliteserien
from player_statistics.backend.fill_db_from_txt.fill_db_cup_statistics_eliteserien import write_cup_statistics_to_db_eliteserien
from player_statistics.backend.read_api_data_to_txt.read_user_info_statistics import read_user_info_statistics_eliteserien
from player_statistics.backend.read_api_data_to_txt.read_cup_info_statistics import read_cup_info_statistics_eliteserien


# Comment out when deploying to PROD
# from player_statistics.backend.read_api_data_to_txt.read_global_statistics import save_all_global_stats_for_current_gw



def fill_player_statistics_eliteserien(request):
    if (request.META['HTTP_HOST'] == "127.0.0.1:8000"):
        fill_database_all_players(eliteserien_folder_name)
    return HttpResponse("Filled Database Eliteserien Player Statistics Info (EliteserienPlayerStatistic)")


def fill_player_statistics_premier_league(request):
    if (request.META['HTTP_HOST'] == "127.0.0.1:8000"):
        fill_database_all_players(premier_league_folder_name)
    return HttpResponse("Filled Database Premier League Player Statistics Info (EliteserienPlayerStatistic)")


def read_and_fill_cup_info_to_db_eliteserien(request):
    if (request.META['HTTP_HOST'] == "127.0.0.1:8000"):
        read_cup_info_statistics_eliteserien()
        write_cup_statistics_to_db_eliteserien()
    return HttpResponse("Read and Filled Database User Info (EliteserienUserInfoStatistics)")


def read_and_fill_user_info_to_db_eliteserien(request):
    if (request.META['HTTP_HOST'] == "127.0.0.1:8000"):
        read_user_info_statistics_eliteserien()
        write_user_info_to_db_eliteserien()
    return HttpResponse("Read and Filled Database User Info (EliteserienUserInfoStatistics)")


def fill_user_info_to_db_eliteserien(request):
    if (request.META['HTTP_HOST'] == "127.0.0.1:8000"):
        write_user_info_to_db_eliteserien()
    return HttpResponse("Filled Database User Info (EliteserienUserInfoStatistics)")


# DB functions. Should not be accessible in PRODUCTION
def fill_db_global_stats(request):
    if (request.META['HTTP_HOST'] == "127.0.0.1:8000"):
        write_global_stats_to_db_eliteserien()
    return HttpResponse("Filled Database Global Data (GlobalOwnershipStatsXXXX)")


def read_and_fill_db_global_stats(request):
    if (request.META['HTTP_HOST'] == "127.0.0.1:8000"):
        # save_all_global_stats_for_current_gw(eliteserien_folder_name)
        write_global_stats_to_db_eliteserien()
    return HttpResponse("Read global stats from api and filled Database Global Data (GlobalOwnershipStatsXXXX)")


def fill_db_global_stats_premier_league(request):
    if (request.META['HTTP_HOST'] == "127.0.0.1:8000"):
        write_global_stats_to_db()
    return HttpResponse("Filled Database Global Data (GlobalOwnershipStatsXXXX)")


def read_and_fill_db_global_stats_premier_league(request):
    if (request.META['HTTP_HOST'] == "127.0.0.1:8000"):
        # save_all_global_stats_for_current_gw(premier_league_folder_name)
        write_global_stats_to_db()
    return HttpResponse("Filled Database Global Data (GlobalOwnershipStatsXXXX)")


def fill_txt_global_stats(request):
    #if (request.META['HTTP_HOST'] == "127.0.0.1:8000"):
        #save_all_global_stats_for_current_gw()
    return HttpResponse("Filled Txt global stats")


def fill_player_stat_db(request):
    #if (request.META['HTTP_HOST'] == "127.0.0.1:8000"):
        #save_all_global_stats_for_current_gw()
    return HttpResponse("Filled Database Player Data (PremierLeaguePlayers)")


def fill_all_statistics(request):
    #fill_database_all_players()
    #save_all_global_stats_for_current_gw()
    #write_global_stats_to_db()
    return HttpResponse("Finished all statistics")
