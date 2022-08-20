# # here all global constants and links will be stored

# ############# GLOBAL STATS ########################

# # total number of gameweeks
# total_number_of_gameweeks = 38
# total_number_of_pl_teams = 20

# # where to store local data
# path_to_store_local_data = "C:\\Users\\ole.borge\\PycharmProjects\\FPL-webpage-azure-devops\\FPL-webpage\\stored_data"

# # link to global ranks
# web_global_league = 'https://fantasy.premierleague.com/api/leagues-classic/314/standings/?phase=1&page_new_entries=1&page_standings=X'

# # store data from these top_x_players. Store for first player, top 10, top 100, top 1000 and top 10000
# all_top_x_players = [1, 10, 100, 1000, 10000]
# time_to_sleep_for_each_iteration = 0.35
# name_of_ownership_file = "complete_ownership.txt"
# name_of_nationality_file = "country_population.txt"
# name_of_extra_info_file = "extra_info.txt"

# ############# PLAYER STATS ########################


# ############# FIXTURE PLANNER ########################

# # initial extra gameweeks to add to current gameweek (if this is 5 and current gameweek is gw: 7,
# # then all fixture planning will go from gw: 7 to gw:12
# initial_extra_gameweeks = 5


# ############# FIXTURE PLANNER ELITESERIEN ########################

# # total number of Eliteserien teams
# total_number_of_eliteserien_teams = 16

# # total number of gameweeks in Eliteserien
# total_number_of_gameweeks_in_eliteserien = 30







# here all global constants and links will be stored

############# GLOBAL STATS ########################

# total number of gameweeks
total_number_of_gameweeks = 38
total_number_of_pl_teams = 20

# where to store local data
path_to_store_local_data = "C:\\Users\\ole.borge\\PycharmProjects\\FPL-webpage-azure-devops\\FPL-webpage\\stored_data"

# link to global ranks
web_global_league = 'https://fantasy.premierleague.com/api/leagues-classic/314/standings/?phase=1&page_new_entries=1&page_standings=X'
web_global_league_eliteserien = 'https://fantasy.tv2.no/api/leagues-classic/325/standings/?phase=1&page_new_entries=1&page_standings=X'

# folder names
eliteserien_folder_name = "eliteserien"
fixture_folder_name = "fixture_data"
premier_league_folder_name = "premier_league"
global_stats_folder_name = "global_stats"
user_stats_folder_name = "user_stats"
backup_data_folder_name= "backup_data"

# must change before each season
current_season_name_eliteserien = "2022"
current_season_name_premier_league = "2022-2023"

# txt file names 
country_population_txt_file_name = "country_population.txt"
total_chip_usage_txt_file_name = "chip_usage.txt"
backup_data_txt_file_name = "backup_id.txt"
top_x_players_ids_backup_file_name = "top_x_players_ids_backup.txt"
user_stats_txt_file_name = "user_stats.txt"
# wildcard due date NB: MUST BE SET MANUALLY
eliteserien_wc_due_date = "2022-07-23T13:00:00"
premier_league_wc_due_date = "2022-07-23T13:00:00"


user_stats_special_delimiter = ":;:"
eliteserien_api_url = "https://fantasy.tv2.no"
premier_league_api_url = "https://fantasy.premierleague.com"
total_number_of_gameweeks_in_eliteserien = 30
fantasy_manager_eliteserien_url = "https://fantasy.tv2.no/entry/X/history"
# store data from these top_x_players. Store for first player, top 10, top 100, top 1000 and top 10000
all_top_x_players_premier_league = [1, 10, 100, 1000, 10000]
all_top_x_players_premier_league_nationality = [1]
all_top_x_players_premier_league_total_chips = [1, 10, 100]


all_top_x_players_eliteserien = [1, 10, 100, 1000, 5000]
all_top_x_players_eliteserien_nationality = [1]
all_top_x_players_eliteserien_total_chips = [1, 10, 100, 1000]

how_often_do_back_up_of_global_data = 250
time_to_sleep_for_each_iteration = 0.3
name_of_ownership_file = "complete_ownership.txt"
name_of_nationality_file = "country_population.txt"
nationality_delimiter = ":"
name_of_extra_info_file = "extra_info.txt"
ranking_delimiter = "&"
# https://fantasy.tv2.no/entry/417/history fra 2017, update this manually each year
number_of_years_eliteserien_has_stored_rankings = 5
############# PLAYER STATS ########################


############# FIXTURE PLANNER ########################

# initial extra gameweeks to add to current gameweek (if this is 5 and current gameweek is gw: 7,
# then all fixture planning will go from gw: 7 to gw:12
initial_extra_gameweeks = 5

# fdr score for a blank gameweek fixture
blank_gw_fdr_score = 10


############# FIXTURE PLANNER ELITESERIEN ########################

# total number of Eliteserien teams
total_number_of_eliteserien_teams = 16

# total number of gameweeks in Eliteserien
total_number_of_gameweeks_in_eliteserien = 30