from constants import premier_league_api_url, eliteserien_api_url, esf
from models.fixtures.models.PlayerIdAndPosition import PlayerIdAndPosition
from utils.dataFetch.DataFetch import DataFetch

from utils.dictinoaries.playerIdInfo import createPlayerIdToPlayerNameEliteserienDict, createPlayerIdToPlayerNamePremierLeagueDict, createTeamIdToTeamNameShortEliteserienDict, createTeamIdToTeamNameShortPremierLeagueDict
from utils.util_functions.get_upcoming_gw import get_upcoming_gw_eliteserien, get_upcoming_gw_premier_league


def read_team_players_from_team_id(user_id, gw, league_name=esf):
    api_url = eliteserien_api_url if league_name == esf else premier_league_api_url
    DFObject = DataFetch(api_url)
    playerIdToPlayerName =  createPlayerIdToPlayerNameEliteserienDict() if league_name == esf else createPlayerIdToPlayerNamePremierLeagueDict()
    teamIdToTeamNameShort =  createTeamIdToTeamNameShortEliteserienDict() if league_name == esf else createTeamIdToTeamNameShortPremierLeagueDict()

    team_info = DFObject.get_current_ind_team(user_id, gw)
    if ('detail' in team_info):
        start_gw = get_upcoming_gw_eliteserien() if league_name == esf else get_upcoming_gw_premier_league()
        if (start_gw > 1):
            team_info = DFObject.get_current_ind_team(user_id, start_gw - 1)
        else:
            return 0

    players_with_all_info = team_info['picks']
    player_list = []

    for player_row in players_with_all_info:
        player_id = player_row["element"]
        player = playerIdToPlayerName[str(player_id)] if str(player_id) in playerIdToPlayerName else ["", "", ""] 
        player_name = player[0]
        position_id = player[1]
        team_id = player[2]
        # team_name_short = teamIdToTeamNameShort[str(team_id)] if str(team_id) in teamIdToTeamNameShort else ''
        player_i = PlayerIdAndPosition(player_id, position_id, player_name, team_id)
        player_list.append(player_i)
        
    return player_list


def team_name_short_to_team_name_id(league_name=esf):
    api_url = eliteserien_api_url if league_name == esf else premier_league_api_url
    DFObject = DataFetch(api_url)

    team_info = DFObject.get_current_fpl_info()
    teams = team_info['teams']
    
    dict = {}

    for team in teams:
        dict[str(team["short_name"]).upper()] = team["id"]
           
    return dict