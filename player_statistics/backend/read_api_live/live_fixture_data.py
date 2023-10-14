from player_statistics.db_models.eliteserien.ownership_statistics_model_eliteserien import EliteserienGlobalOwnershipStats1000
from player_statistics.db_models.premier_league.ownership_statistics_model import PremierLeagueGlobalOwnershipStats1000
from utils.dictinoaries.playerIdInfo import createPlayerIdToPlayerNameEliteserienDict, createPlayerIdToPlayerNamePremierLeagueDict
from utils.dictinoaries.teamIdName import createTeamIdToTeamNameEliteserienDict, createTeamIdToTeamNamePremierLeagueDict
from constants import premier_league_api_url, eliteserien_api_url, esf
from models.statistics.apiResponse.LiveFixturesApiResponse import LiveFixturesApiResponse
from models.statistics.models.LiveFixtureModel import LiveFixtureModel
from utils.utility_functions import get_current_gw_
from utils.dataFetch.DataFetch import DataFetch


def live_fixtures(league_name=esf, gw=0):
    api_url = eliteserien_api_url if league_name == esf else premier_league_api_url

    DFObject = DataFetch(api_url)

    fixture_data = DFObject.get_current_fixtures()

    current_gameweek = get_current_gw_(DFObject)
    current_gameweek = gw if gw > 0 and gw < current_gameweek else current_gameweek

    fixtures_this_round = []
    
    player_dict = createPlayerIdToPlayerNameEliteserienDict() if league_name == esf else createPlayerIdToPlayerNamePremierLeagueDict()
    team_dict = createTeamIdToTeamNameEliteserienDict() if league_name == esf else createTeamIdToTeamNamePremierLeagueDict()
    data_to_show = "opta_index" if league_name == esf else "bps"

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
    
    dict_ownership, has_ownership_data = getOwnershipData(league_name, current_gameweek)
    live_player_data = DFObject.get_gameweek_info(current_gameweek)["elements"]
    
    for player_i in live_player_data:
        stats = player_i["stats"]
        id = player_i["id"]
        total_minutes = stats["minutes"]

        
        if total_minutes > 0 and str(id) in player_dict:
            EO = dict_ownership[id] if (has_ownership_data and id in dict_ownership) else None
            player_info = player_dict[str(id)] 
            name, postition, team_id = player_info[0], player_info[1], player_info[2]
            
            total_opta_or_bps = float(stats[data_to_show])
            total_points = stats["total_points"]
            
            explain = player_i["explain"]

            if len(explain) == 1:
                # one match, use stats her
                stats = explain[0]["stats"]
                fixture_id = explain[0]["fixture"]
                fixture_id_to_player_list_dict[fixture_id].append([name, total_minutes, total_opta_or_bps, total_points, postition, team_id, stats, EO])
            
            if len(explain) > 1:
                minutes_list = player_info[3]
                opta_or_bps_list = player_info[4]
                total_points_list = player_info[5]
                fixture_id_list = player_info[6]
                
                for explain_i in explain:                   
                    fixture_id = explain_i["fixture"]
                    stats = explain_i["stats"]

                    gw_idx = 0
                    for idx_2, fixture_id_i in enumerate(fixture_id_list):
                        if fixture_id_i == fixture_id:
                            gw_idx = idx_2

                    has_played = int(minutes_list[gw_idx]) > 0
                    
                    gw_i_minutes = minutes_list[gw_idx] if (gw_idx > 0 and has_played) else total_minutes
                    gw_i_opta_or_bps = float(opta_or_bps_list[gw_idx]) if (gw_idx > 0 and has_played) else total_opta_or_bps
                    gw_i_total_points = total_points_list[gw_idx] if (gw_idx > 0 and has_played) else total_points

                    total_minutes -= gw_i_minutes
                    total_opta_or_bps -= gw_i_opta_or_bps
                    total_points -= gw_i_total_points
                    
                    fixture_id_to_player_list_dict[fixture_id].append([name, gw_i_minutes, gw_i_opta_or_bps, gw_i_total_points, postition, team_id, stats, EO])
   
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

    response = LiveFixturesApiResponse(previous_gw, next_gw, current_gameweek, fixture_json, has_ownership_data) 

    return response


def convertApiJson(data_i, team_dict, player_dict):   
    stats = data_i["stats"]
    for stat in stats:
        for away in stat["a"]:
            player_id = str(away["element"])
            away["element"] = player_dict[player_id][0] if player_id in player_dict else player_id
        for away in stat["h"]:
            player_id = str(away["element"])
            away["element"] = player_dict[player_id][0] if player_id in player_dict else player_id

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
        stats, 
        [], 
    [])


def getOwnershipData(league_name, current_gameweek):
    player_ownership_db = EliteserienGlobalOwnershipStats1000.objects.all() if league_name == esf else PremierLeagueGlobalOwnershipStats1000.objects.all()
    dict_ownership = {}
    has_ownership_data = False
    for i in player_ownership_db:
        ownership_data_i = i.extract_data_from_current_gw(current_gameweek)
        if ownership_data_i is not None:
            has_ownership_data = True
            dict_ownership[i.player_id] = round(((ownership_data_i[1] + ownership_data_i[4]) / 1000) * 100, 1)
    
    return dict_ownership, has_ownership_data