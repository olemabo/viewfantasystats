import json 

class CupRoundHitModel:
    def __init__(self, opponent_entry_id, opponent_name, opponent_player_name, opponent_points, current_points, winner, current_cup_round):
        ...
        self.opponent_entry_id = opponent_entry_id
        self.opponent_name = opponent_name
        self.opponent_player_name = opponent_player_name
        self.opponent_points = opponent_points
        self.current_points = current_points
        self.winner = winner
        self.current_cup_round = current_cup_round
    
    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)