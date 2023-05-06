from player_statistics.db_models.eliteserien.player_statistics_model import EliteserienPlayerStatistic
from constants import premier_league_api_url, eliteserien_api_url, eliteserien_folder_name
from utils.Statistics.ApiResponse.LiveFixturesApiResponse import LiveFixturesApiResponse
from utils.Statistics.Models.LiveFixtureModel import LiveFixtureModel
from fixture_planner_eliteserien.models import EliteserienTeamInfo
from utils.utility_functions import get_current_gw_
from utils.dataFetch.DataFetch import DataFetch


def live_fixtures(league_name=eliteserien_folder_name, gw=0):
    api_url = eliteserien_api_url if league_name == eliteserien_folder_name else premier_league_api_url
    DFObject = DataFetch(api_url)

    fixture_data = DFObject.get_current_fixtures()
    
    current_gameweek = get_current_gw_(DFObject)

    if (gw > 0 and gw < current_gameweek):
        current_gameweek = gw
    fixtures_this_round = []
    
    player_dict = createPlayerIdToPlayerNameDict()
    team_dict = createTeamIdToTeamNameDict()
    
    fixture_id_to_player_list_dict = {}
    min_gw, max_gw = 100, -1

    for fixture_i in fixture_data:
        gw = fixture_i["event"]
        fixture_id = fixture_i["id"]
        if gw == current_gameweek:
            fixtures_this_round.append(convertApiJson(fixture_i, team_dict, player_dict))
            fixture_id_to_player_list_dict[fixture_id] = []
        
        if fixture_i["started"]:
            min_gw = min(min_gw, gw)
            max_gw = max(max_gw, gw)

    live_player_data = DFObject.get_gameweek_info(current_gameweek)["elements"]

    for player_i in live_player_data:
        stats = player_i["stats"]
        total_minutes = stats["minutes"]
        
        if total_minutes > 0:
            id = player_i["id"]
            player_info = player_dict[str(id)] 
            name, postition, team_id = player_info[0], player_info[1], player_info[2]
            
            total_opta_index = float(stats["opta_index"])
            total_points = stats["total_points"]
            
            explain = player_i["explain"]
            
            if len(explain) == 1:
                # one match, use stats her
                stats = explain[0]["stats"]
                fixture_id = explain[0]["fixture"]
                fixture_id_to_player_list_dict[fixture_id].append([name, total_minutes, total_opta_index, total_points, postition, team_id, stats])
            
            if len(explain) > 1:
                minutes_list = player_info[3]
                opta_index_list = player_info[4]
                total_points_list = player_info[5]
                fixture_id_list = player_info[6]
                
                for idx, explain_i in enumerate(explain):
                    is_last = True if (idx + 1) == len(explain) else False
                    
                    fixture_id = explain_i["fixture"]
                    stats = explain_i["stats"]
                    
                    if is_last:
                        if total_minutes > 0:
                            fixture_id_to_player_list_dict[fixture_id].append([name, total_minutes, total_opta_index, total_points, postition, team_id, stats])
                    else:
                        gw_idx = 0
                        for idx_2, fixture_id_i in enumerate(fixture_id_list):
                            if fixture_id_i == fixture_id:
                                gw_idx = idx_2

                        has_played = int(minutes_list[gw_idx]) > 0
                        gw_i_minutes = minutes_list[gw_idx] if (gw_idx > 0 and has_played) else 0
                        gw_i_opta_index = float(opta_index_list[gw_idx]) if (gw_idx > 0 and has_played) else 0
                        gw_i_total_points = total_points_list[gw_idx] if (gw_idx > 0 and has_played) else 0
                        
                        total_minutes -= gw_i_minutes
                        total_opta_index -= gw_i_opta_index
                        total_points -= gw_i_total_points
                        
                        if minutes_list[gw_idx] > 0:
                            fixture_id_to_player_list_dict[fixture_id].append([name, gw_i_minutes, gw_i_opta_index, gw_i_total_points, postition, team_id, stats])
    

    previous_gw = current_gameweek - 1 if min_gw < current_gameweek else -1
    next_gw = current_gameweek + 1 if max_gw > current_gameweek else -1

    fixture_json = []
    fixture: LiveFixtureModel
    for fixture in fixtures_this_round:
        players_a, players_h = [], []
        all_players = fixture_id_to_player_list_dict[fixture.id]
        for player in all_players:
            if player[5] == fixture.team_h:
                 players_h.append(player)
            if player[5] == fixture.team_a:
                 players_a.append(player)
        
        fixture.players_h = players_h
        fixture.players_a = players_a
        
        num3 = [x for n in (players_h, players_a) for x in n]
        num3.sort(key = lambda x: x[2], reverse=True)

        fixture_json.append(fixture.toJson())

    response = LiveFixturesApiResponse(previous_gw, next_gw, current_gameweek, fixture_json) 

    return response


def createPlayerIdToPlayerNameDict():
    player_dict = {}
    players = EliteserienPlayerStatistic.objects.all()
    player: EliteserienPlayerStatistic
    for player in players:
        player_dict[str(player.player_id)] = [player.player_web_name, player.player_position_id, player.player_team_id, 
                                              player.minutes_list, player.opta_index_list, player.total_points_list, player.fixture_id_list]

    return player_dict


def createTeamIdToTeamNameDict():
    team_dict = {}
    for team in EliteserienTeamInfo.objects.all():
        team_dict[str(team.team_id)] = team.team_name   

    return team_dict


def convertApiJson(data_i, team_dict, player_dict):        
    stats = data_i["stats"]
    for stat in stats:
        for away in stat["a"]:
            away["element"] = player_dict[str(away["element"])][0]
        for away in stat["h"]:
            away["element"] = player_dict[str(away["element"])][0]
    
    return LiveFixtureModel(
        data_i["finished"],
        data_i["finished_provisional"],
        data_i["id"],
        data_i["kickoff_time"],
        data_i["minutes"],
        data_i["started"],
        data_i["team_a"],
        team_dict[str(data_i["team_a"])],
        data_i["team_a_score"],
        data_i["team_h"],
        team_dict[str(data_i["team_h"])],
        data_i["team_h_score"],
        stats, [], [])