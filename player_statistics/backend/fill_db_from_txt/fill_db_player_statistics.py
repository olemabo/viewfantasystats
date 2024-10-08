from player_statistics.backend.read_api_data_to_txt.read_player_statistics import static_json, get_ids
from player_statistics.backend.verify_season.verify_season import verify_season
from player_statistics.db_models.eliteserien.player_statistics_model import EliteserienPlayerStatistic
from player_statistics.db_models.premier_league.player_statistics_model import PremierLeaguePlayers
from constants import eliteserien_api_url, premier_league_api_url, fpl, esf
from utils.dataFetch.DataFetch import DataFetch
from datetime import date
import time
from constants import player_statistics_folder_name, path_to_store_local_data, current_season_name_eliteserien, current_season_name_premier_league, esf
import os

def fill_database_all_players(league_name):
    api_url = eliteserien_api_url if league_name == esf else premier_league_api_url
    
    verify_season(league_name)
    
    static_data = static_json("api", api_url)
    ids = get_ids("api", api_url)
    
    dataFetch = DataFetch(api_url)
    print("\nStart to fill db for all ", str(len(ids)), " players. \n")

    for idx, id in enumerate(ids):
        player_data = dataFetch.get_current_individual_players(player_id=id)
        name = static_data[id][0] + " & " + static_data[id][1]
        updated_or_created = fill_database_for_one_player(player_data, static_data, id, league_name)
        print("Filling db for player: ", name, " with id: ", id, " ... (",
            idx, "/", len(ids), ") | " + updated_or_created)
        time.sleep(0.5)
    
    print("\nFilled db for all ", str(len(ids)), " players. \n")


def fill_database_for_one_player(player_data_json, static_data, id, league_name):
    """
        Use extracted fpl data to fill db
    """
    updated_or_created = ""
    element_id = id
    """player_data_json['history'][0]['element']"""
    # all total values from static json
    temp_opponent_team = [0]
    temp_was_home = [0]
    temp_team_h_score = [0]
    temp_team_a_score = [0]
    temp_round = [0]
    player_name = static_data[element_id][0] + " & " + static_data[element_id][1]
    
    player_position_id = static_data[element_id][2]
    chance_of_playing = static_data[element_id][3]
    temp_value = [static_data[element_id][4]]
    temp_total_points = [static_data[element_id][7]]
    temp_minutes = [static_data[element_id][8]]
    temp_goals_scored = [static_data[element_id][9]]
    temp_assists = [static_data[element_id][10]]
    temp_clean_sheets = [static_data[element_id][11]]
    temp_goals_conceded = [static_data[element_id][12]]
    temp_own_goals = [static_data[element_id][13]]
    temp_penalties_saved = [static_data[element_id][14]]
    temp_penalties_missed = [static_data[element_id][15]]
    temp_yellow_cards = [static_data[element_id][16]]
    temp_red_cards = [static_data[element_id][17]]
    temp_saves = [static_data[element_id][18]]
    temp_bonus = [static_data[element_id][19]]
    temp_bps = [static_data[element_id][20]]
    temp_influence = [static_data[element_id][21]]
    temp_creativity = [static_data[element_id][22]]
    temp_threat = [static_data[element_id][23]]
    temp_ict_index = [static_data[element_id][24]]
    temp_transfers_balance = [0]
    temp_selected = [0]
    temp_transfers_in = [static_data[element_id][33]]
    temp_transfers_out = [static_data[element_id][34]]
    team_id = static_data[element_id][35]
    web_name = static_data[element_id][36]
    temp_fixture_ids = [static_data[element_id][48]]
    player_status = static_data[element_id][49]

    # FPL stats
    temp_expected_goals = [static_data[element_id][37]]
    temp_expected_goals_per_90 = static_data[element_id][38]
    temp_expected_assists = [static_data[element_id][39]]
    temp_expected_assists_per_90 = static_data[element_id][40]
    temp_expected_goal_involvements = [static_data[element_id][41]]
    temp_expected_goal_involvements_per_90 = static_data[element_id][42]
    temp_expected_goals_conceded = [static_data[element_id][43]]
    temp_expected_goals_conceded_per_90 = static_data[element_id][44]
    temp_goals_conceded_per_90 = static_data[element_id][45]
    temp_saves_per_90 = static_data[element_id][46]

    # ESF stats
    temp_opta_index = [static_data[element_id][47]]

    chance_of_playing = "None" if chance_of_playing is None else chance_of_playing
    
    # fill in gw data
    player_all_current_gws_data = player_data_json['history']

    for gw_i_data in player_all_current_gws_data:
        temp_opponent_team.append(gw_i_data['opponent_team'])
        temp_total_points.append(gw_i_data['total_points'])
        temp_was_home.append(gw_i_data['was_home'])
        temp_team_h_score.append(gw_i_data['team_h_score'])
        temp_team_a_score.append(gw_i_data['team_a_score'])
        temp_round.append(gw_i_data['round'])
        temp_minutes.append(gw_i_data['minutes'])
        temp_goals_scored.append(gw_i_data['goals_scored'])
        temp_assists.append(gw_i_data['assists'])
        temp_clean_sheets.append(gw_i_data['clean_sheets'])
        temp_goals_conceded.append(gw_i_data['goals_conceded'])
        temp_own_goals.append(gw_i_data['own_goals'])
        temp_penalties_saved.append(gw_i_data['penalties_saved'])
        temp_penalties_missed.append(gw_i_data['penalties_missed'])
        temp_yellow_cards.append(gw_i_data['yellow_cards'])
        temp_saves.append(gw_i_data['saves'])
        temp_bonus.append(gw_i_data['bonus'])

        if (league_name == fpl):
            temp_bps.append(gw_i_data['bps'])
            temp_influence.append(gw_i_data['influence'])
            temp_creativity.append(gw_i_data['creativity'])
            temp_threat.append(gw_i_data['threat'])
            temp_ict_index.append(gw_i_data['ict_index'])
            temp_expected_goals.append(gw_i_data['expected_goals'])
            temp_expected_assists.append(gw_i_data['expected_assists'])
            temp_expected_goal_involvements.append(gw_i_data['expected_goal_involvements'])
            temp_expected_goals_conceded.append(gw_i_data['expected_goals_conceded'])
        
        if (league_name == esf):
            temp_opta_index.append(gw_i_data["opta_index"])

        temp_transfers_balance.append(gw_i_data['transfers_balance'])
        temp_selected.append(gw_i_data['selected'])
        temp_transfers_in.append(gw_i_data['transfers_in'])
        temp_transfers_out.append(gw_i_data['transfers_out'])
        temp_value.append(gw_i_data['value'])
        temp_red_cards.append(gw_i_data['red_cards'])
        temp_fixture_ids.append(gw_i_data['fixture'])
    
    write_to_file_base_file_path = get_write_to_file_base_file_path(league_name)
    
    if league_name == fpl:
        # Define the data dictionary once
        data = {
            "player_id": element_id,
            "player_team_id": team_id,
            "player_position_id": player_position_id,
            "player_name": player_name,
            "player_web_name": web_name,
            "chance_of_playing": chance_of_playing,
            "assists_list": temp_assists,
            "bonus_list": temp_bonus,
            "bps_list": temp_bps,
            "clean_sheets_list": temp_clean_sheets,
            "creativity_list": temp_creativity,
            "goals_conceded_list": temp_goals_conceded,
            "goals_scored_list": temp_goals_scored,
            "ict_index_list": temp_ict_index,
            "influence_list": temp_influence,
            "minutes_list": temp_minutes,
            "opponent_team_list": temp_opponent_team,
            "own_goals_list": temp_own_goals,
            "penalties_missed_list": temp_penalties_missed,
            "penalties_saved_list": temp_penalties_saved,
            "red_cards_list": temp_red_cards,
            "round_list": temp_round,
            "saves_list": temp_saves,
            "selected_list": temp_selected,
            "team_a_score_list": temp_team_a_score,
            "team_h_score_list": temp_team_h_score,
            "threat_list": temp_threat,
            "total_points_list": temp_total_points,
            "transfers_balance_list": temp_transfers_balance,
            "transfers_in_list": temp_transfers_in,
            "transfers_out_list": temp_transfers_out,
            "value_list": temp_value,
            "was_home_list": temp_was_home,
            "yellow_cards_list": temp_yellow_cards,
            "expected_goals_list": temp_expected_goals,
            "expected_assists_list": temp_expected_assists,
            "expected_goal_involvements_list": temp_expected_goal_involvements,
            "expected_goals_conceded_list": temp_expected_goals_conceded,
            "expected_goals_per_90": temp_expected_goals_per_90,
            "expected_assists_per_90": temp_expected_assists_per_90,
            "expected_goal_involvements_per_90": temp_expected_goal_involvements_per_90,
            "expected_goals_conceded_per_90": temp_expected_goals_conceded_per_90,
            "goals_conceded_per_90": temp_goals_conceded_per_90,
            "saves_per_90": temp_saves_per_90,
            "fixture_id_list": temp_fixture_ids,
            "player_status": player_status,
        }

        # Check if the player exists in the database
        fill_model = PremierLeaguePlayers.objects.filter(player_id=element_id)

        if fill_model.exists():
            fill_model.update(**data)
            updated_or_created = f"Updated: {date.today()}"
        else:
            # Add creation date only when creating a new entry
            data["player_created_date"] = date.today()
            new_entry = PremierLeaguePlayers(**data)
            new_entry.save()
            updated_or_created = f"Created: {date.today()}"

        # Create the file name and write data to the file
        player_name_stripped = ''.join(letter for letter in web_name if letter.isalnum())
        file_name = f"{write_to_file_base_file_path}/{element_id}_{player_name_stripped}.txt"

        # Generate the strings for the file
        keys_str = ", ".join(data.keys())
        values_str = ", ".join(str(value) for value in data.values())

        # Write the strings to the file
        with open(file_name, "w", encoding="utf-8") as file:
            file.write(f"{keys_str}\n")
            file.write(f"{values_str}\n")
    
    elif league_name == esf:
        data = {
            "player_id": element_id,
            "player_team_id": team_id,
            "player_position_id": player_position_id,
            "player_name": player_name,
            "player_web_name": web_name,
            "chance_of_playing": chance_of_playing,
            "assists_list": temp_assists,
            "bonus_list": temp_bonus,
            "clean_sheets_list": temp_clean_sheets,
            "goals_conceded_list": temp_goals_conceded,
            "goals_scored_list": temp_goals_scored,
            "minutes_list": temp_minutes,
            "opponent_team_list": temp_opponent_team,
            "own_goals_list": temp_own_goals,
            "penalties_missed_list": temp_penalties_missed,
            "penalties_saved_list": temp_penalties_saved,
            "red_cards_list": temp_red_cards,
            "round_list": temp_round,
            "saves_list": temp_saves,
            "selected_list": temp_selected,
            "team_a_score_list": temp_team_a_score,
            "team_h_score_list": temp_team_h_score,
            "total_points_list": temp_total_points,
            "transfers_balance_list": temp_transfers_balance,
            "transfers_in_list": temp_transfers_in,
            "transfers_out_list": temp_transfers_out,
            "value_list": temp_value,
            "was_home_list": temp_was_home,
            "yellow_cards_list": temp_yellow_cards,
            "opta_index_list": temp_opta_index,
            "fixture_id_list": temp_fixture_ids,
            "player_status": player_status,
        }

        # Check if the player exists in the database
        fill_model = EliteserienPlayerStatistic.objects.filter(player_id=element_id)

        if fill_model.exists():
            fill_model.update(**data)
            updated_or_created = f"Updated: {date.today()}"
        else:
            # Add creation date only when creating a new entry
            data["player_created_date"] = date.today()
            new_entry = EliteserienPlayerStatistic(**data)
            new_entry.save()
            updated_or_created = f"Created: {date.today()}"

        # Create the file name and write data to the file
        player_name_stripped = ''.join(letter for letter in web_name if letter.isalnum())
        file_name = f"{write_to_file_base_file_path}/{element_id}_{player_name_stripped}.txt"

        # Generate the strings for the file
        keys_str = ", ".join(data.keys())
        values_str = ", ".join(str(value) for value in data.values())

        # Write the strings to the file
        with open(file_name, "w", encoding="utf-8") as file:
            file.write(f"{keys_str}\n")
            file.write(f"{values_str}\n")

    return updated_or_created



def get_write_to_file_base_file_path(league_name):
    season_name = current_season_name_eliteserien if league_name == esf else current_season_name_premier_league

    league_path = path_to_store_local_data + "/" + league_name + "/"
    if not os.path.isdir(league_path):
        print("Created path: ", league_path)
        os.mkdir(league_path)

    season_path = league_path + "/" + season_name + "/"
    if not os.path.isdir(season_path):
        print("Created path: ", season_path)
        os.mkdir(season_path)

    global_stats_path = season_path + "/" + player_statistics_folder_name + "/"
    if not os.path.isdir(global_stats_path):
        print("Created path: ", global_stats_path)
        os.mkdir(global_stats_path)

    return global_stats_path