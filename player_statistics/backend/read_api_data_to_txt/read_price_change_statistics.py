import os
from datetime import datetime
from constants import (
    current_season_name_premier_league, 
    current_season_name_eliteserien, 
    path_to_store_local_data,
    esf, 
    price_change_folder_name, 
    premier_league_api_url, 
    eliteserien_api_url
)
from utils.dataFetch.DataFetch import DataFetch

# Define properties to store
props_to_store = [
    "id", "web_name", 
    "cost_change_event", 
    "status", 
    "now_cost",
    "transfers_out_event",
    "transfers_in_event",
    "transfers_in",
    "transfers_out",
    "selected_by_percent", 
    "total_players",
    "current_gw"
]

def get_current_gw(DFObject: DataFetch):
    events = DFObject.get_current_fpl_info()['events']
    for event in events:
        if event['is_current']:
            return int(event['id'])
    return 1

def read_price_change_statistics(league_name, props_to_store=props_to_store):
     # Choose API URL based on league
    api_url = eliteserien_api_url if league_name == esf else premier_league_api_url
    
    DFObject = DataFetch(api_url)

    current_gw = get_current_gw(DFObject)

    # Check and get the path for storing data
    path = check_if_txt_file_exist(league_name, current_gw)

    print("\n\nRead data from API | Price Change Statistics\n")

    # Get FPL data
    static_bootstrap = DFObject.get_current_fpl_info()
    number_of_fantasy_players = static_bootstrap['total_players']
    player_data = static_bootstrap["elements"]

    player_data_to_store = []
    for player_i in player_data:
        player_i_data_to_store = []
        for prop in props_to_store:
            if prop == "total_players":
                player_i_data_to_store.append(str(number_of_fantasy_players))
            elif prop == "current_gw":
                player_i_data_to_store.append(str(current_gw))
            else:
                prop_i = player_i.get(prop, "PROP_NOT_FOUND_" + prop)
                player_i_data_to_store.append(str(prop_i))
        player_data_to_store.append(",".join(player_i_data_to_store))

    # Write player_data_to_store to file
    with open(path, 'w', encoding="utf-8") as file:
        # Write header with property names
        price_change_props = ",".join(props_to_store)
        if price_change_props:
            price_change_props = price_change_props[:-1] + "\n"
        file.write(price_change_props)

        # Write player data
        for line in player_data_to_store:
            file.write(line + "\n")


def check_if_txt_file_exist(league_name, current_gw):    
    # Construct paths
    league_path = os.path.join(path_to_store_local_data, league_name)
    season_name = current_season_name_eliteserien if league_name == esf else current_season_name_premier_league
    season_path = os.path.join(league_path, season_name)
    price_change_path = os.path.join(season_path, price_change_folder_name)
    
    current_datetime = datetime.now().strftime("%Y-%m-%d-%H")
    txt_file_path = os.path.join(price_change_path, f"{price_change_folder_name}_{current_gw}_{current_datetime}.txt")

    # Create directories if they don't exist
    for directory in [league_path, season_path, price_change_path]:
        if not os.path.isdir(directory):
            print("Create folder: ", directory)
            os.makedirs(directory)

    if os.path.exists(txt_file_path):
        print("File already exists, overwriting:", txt_file_path)

    return txt_file_path