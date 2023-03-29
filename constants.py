# here all global constants and links will be stored

# local host
local_host_url = "127.0.0.1:8000"

# total number of gameweeks
total_number_of_gameweeks = 38
total_number_of_gameweeks_in_eliteserien = 30

# total number of teams
total_number_of_pl_teams = 20
total_number_of_eliteserien_teams = 16

# where to store local data
stored_data = "stored_data"
# path_to_store_local_data = "C:\\Users\\ole.borge\\source\\repos\\django\\viewfantasystats\\" + stored_data
path_to_store_local_data = "/home/olebo/viewfantasystats/" + stored_data

# link to global ranks
web_global_league_premier_league = 'https://fantasy.premierleague.com/api/leagues-classic/314/standings/?phase=1&page_new_entries=1&page_standings=X'
web_global_league_eliteserien = 'https://fantasy.tv2.no/api/leagues-classic/325/standings/?phase=1&page_new_entries=1&page_standings=X'

# folder names
premier_league_folder_name = "premier_league"
eliteserien_folder_name = "eliteserien"

global_stats_folder_name = "global_stats"
backup_data_folder_name= "backup_data"
user_stats_folder_name = "user_stats"
fixture_folder_name = "fixture_data"
cup_stats_folder_name = "cup_data"

# must change before each season
current_season_name_premier_league = "2022-2023"
current_season_name_eliteserien = "2023"

# txt file names 
country_population_txt_file_name = "country_population.txt"
total_chip_usage_txt_file_name = "chip_usage.txt"
backup_data_txt_file_name = "backup_id.txt"
top_x_players_ids_backup_file_name = "top_x_players_ids_backup.txt"
user_stats_txt_file_name = "user_stats.txt"
name_of_ownership_file = "complete_ownership.txt"
name_of_nationality_file = "country_population.txt"
name_of_extra_info_file = "extra_info.txt"
cup_all_ids_processed_file = "cup_all_processed_ids.txt"
cup_data_file = "cup_data.txt"
cup_processed_rounds = "cup_processed_rounds.txt"

# delimiters
user_stats_special_delimiter = ":;:"
nationality_delimiter = ":"
ranking_delimiter = "&"
cup_delimiter = ":;:"
cup_db_delimiter = "|-|"
# wildcard due date NB: MUST BE SET MANUALLY
eliteserien_wc_due_date = "2022-07-23T13:00:00"
premier_league_wc_due_date = "2022-07-23T13:00:00"

# urls
eliteserien_api_url = "https://fantasy.tv2.no"
premier_league_api_url = "https://fantasy.premierleague.com"
fantasy_manager_eliteserien_url = "https://fantasy.tv2.no/entry/X/history"

# store data from these top_x_players. Store for first player, top 10, top 100, top 1000 and top 10000
all_top_x_players_premier_league = [1, 10, 100, 1000, 10000]
all_top_x_players_premier_league_nationality = [1]
all_top_x_players_premier_league_total_chips = [1, 10, 100, 1000]

all_top_x_players_eliteserien = [1, 10, 100, 1000, 5000]
all_top_x_players_eliteserien_nationality = [1]
all_top_x_players_eliteserien_total_chips = [1, 10, 100, 1000]

how_often_do_back_up_of_global_data = 250
time_to_sleep_for_each_iteration = 0.3

# https://fantasy.tv2.no/entry/417/history fra 2017, update this manually each year
number_of_years_eliteserien_has_stored_rankings = 5

number_of_cup_rounds_eliteserien = 15
# initial extra gameweeks to add to current gameweek (if this is 5 and current gameweek is gw: 7,
# then all fixture planning will go from gw: 7 to gw:12
initial_extra_gameweeks = 5

# fdr score for a blank gameweek fixture
blank_gw_fdr_score = 10

# pythonanywhere
python_anywhere_path = "/home/olebo/viewfantasystats/"
# python_anywhere_path = ""
