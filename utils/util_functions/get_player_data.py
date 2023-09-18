from player_statistics.db_models.premier_league.player_statistics_model import PremierLeaguePlayers
from player_statistics.db_models.eliteserien.player_statistics_model import EliteserienPlayerStatistic
from models.fixtures.models.PlayerModel import PlayerModel
from constants import esf


def getPlayerData(league_type = esf):
    temp_player_list = []
        
    players_db = EliteserienPlayerStatistic.objects.all() if league_type == esf else  PremierLeaguePlayers.objects.all() 
    for player in players_db:
        player_team_id = player.player_team_id
        player_position_id = player.player_position_id
        player_web_name = player.player_web_name
        
        temp_player_list.append(PlayerModel(
            player_team_id=player_team_id,
            player_position_id=player_position_id,
            player_web_name=player_web_name,
        ).toJson())

    return temp_player_list