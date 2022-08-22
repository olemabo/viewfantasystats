from constants import eliteserien_api_url, premier_league_api_url, premier_league_folder_name, eliteserien_folder_name
from player_statistics.backend.read_api_data_to_txt.read_player_statistics import static_json, get_ids
from player_statistics.db_models.eliteserien.player_statistics_model import EliteserienPlayerStatistic
from player_statistics.db_models.premier_league.player_statistics_model import PremierLeaguePlayers
from utils.models.DataFetch import DataFetch
import time


def fill_database_all_players(league_name=premier_league_folder_name):
    api_url = eliteserien_api_url if league_name == eliteserien_folder_name else premier_league_api_url
    static_data = static_json("api", api_url)
    ids = get_ids("api", api_url)
    dataFetch = DataFetch(api_url)
    print("\nStart to fill db for all ", str(len(ids)), " players. \n")

    for idx, id in enumerate(ids):
        player_data = dataFetch.get_current_individual_players(player_id=id)
        name = static_data[id][0] + " & " + static_data[id][1]
        print("Filling db for player: ", name, " with id: ", id, " ... (",
              idx, "/", len(ids), ")")
        fill_database_for_one_player(player_data, static_data, id, league_name)
        time.sleep(0.7)
    print("Filled db for all ", str(len(ids)), " players. \n")


def fill_database_for_one_player(player_data_json, static_data, id, league_name):
    """
        Use extracted fpl data to fill db
    """
    element_id = id
    """player_data_json['history'][0]['element']"""
    # all total values from static json
    temp_opponent_team = [0]
    temp_was_home = [0]
    temp_team_h_score = [0]
    temp_team_a_score = [0]
    temp_round = [0]
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
    player_name = static_data[element_id][0] + " & " + static_data[element_id][1]
    web_name = static_data[element_id][36]
    player_position_id = static_data[element_id][2]
    chance_of_playing = static_data[element_id][3]

    if chance_of_playing is None:
        chance_of_playing = "None"

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
        if (league_name == premier_league_folder_name):
            temp_bps.append(gw_i_data['bps'])
            temp_influence.append(gw_i_data['influence'])
            temp_creativity.append(gw_i_data['creativity'])
            temp_threat.append(gw_i_data['threat'])
            temp_ict_index.append(gw_i_data['ict_index'])
        temp_transfers_balance.append(gw_i_data['transfers_balance'])
        temp_selected.append(gw_i_data['selected'])
        temp_transfers_in.append(gw_i_data['transfers_in'])
        temp_transfers_out.append(gw_i_data['transfers_out'])
        temp_value.append(gw_i_data['value'])
        temp_red_cards.append(gw_i_data['red_cards'])

    if league_name == premier_league_folder_name:
        fill_model = PremierLeaguePlayers(
            player_id=element_id,
            player_team_id=team_id,
            player_position_id=player_position_id,
            player_name=player_name,
            player_web_name=web_name,
            chance_of_playing=chance_of_playing,
            assists_list=temp_assists,
            bonus_list=temp_bonus,
            bps_list=temp_bps,
            clean_sheets_list=temp_clean_sheets,
            creativity_list=temp_creativity,
            goals_conceded_list=temp_goals_conceded,
            goals_scored_list=temp_goals_scored,
            ict_index_list=temp_ict_index,
            influence_list=temp_influence,
            minutes_list=temp_minutes,
            opponent_team_list=temp_opponent_team,
            own_goals_list=temp_own_goals,
            penalties_missed_list=temp_penalties_missed,
            penalties_saved_list=temp_penalties_saved,
            red_cards_list=temp_red_cards,
            round_list=temp_round,
            saves_list=temp_saves,
            selected_list=temp_selected,
            team_a_score_list=temp_team_a_score,
            team_h_score_list=temp_team_h_score,
            threat_list=temp_threat,
            total_points_list=temp_total_points,
            transfers_balance_list=temp_transfers_balance,
            transfers_in_list=temp_transfers_in,
            transfers_out_list=temp_transfers_out,
            value_list=temp_value,
            was_home_list=temp_was_home,
            yellow_cards_list=temp_yellow_cards)
        fill_model.save()
    
    if league_name == eliteserien_folder_name:
        fill_model = EliteserienPlayerStatistic(
            player_id=element_id,
            player_team_id=team_id,
            player_position_id=player_position_id,
            player_name=player_name,
            player_web_name=web_name,
            chance_of_playing=chance_of_playing,
            assists_list=temp_assists,
            bonus_list=temp_bonus,
            clean_sheets_list=temp_clean_sheets,
            goals_conceded_list=temp_goals_conceded,
            goals_scored_list=temp_goals_scored,
            minutes_list=temp_minutes,
            opponent_team_list=temp_opponent_team,
            own_goals_list=temp_own_goals,
            penalties_missed_list=temp_penalties_missed,
            penalties_saved_list=temp_penalties_saved,
            red_cards_list=temp_red_cards,
            round_list=temp_round,
            saves_list=temp_saves,
            selected_list=temp_selected,
            team_a_score_list=temp_team_a_score,
            team_h_score_list=temp_team_h_score,
            total_points_list=temp_total_points,
            transfers_balance_list=temp_transfers_balance,
            transfers_in_list=temp_transfers_in,
            transfers_out_list=temp_transfers_out,
            value_list=temp_value,
            was_home_list=temp_was_home,
            yellow_cards_list=temp_yellow_cards)
        fill_model.save()