class PlayerModel:
    def __init__(self, player_team_id, player_position_id, player_web_name):
        ...
        self.player_team_id = player_team_id
        self.player_position_id = player_position_id
        self.player_web_name = player_web_name

    def to_dict(self):
        return {
            "playerTeamId": self.player_team_id,
            "playerPositionId": self.player_position_id,
            "playerWebName": self.player_web_name,
        }