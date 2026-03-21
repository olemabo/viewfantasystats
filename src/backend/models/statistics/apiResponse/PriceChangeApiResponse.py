
class PriceChangeApiModel:
    def __init__(self, player_transfers, gw_list):
        ...
        self.player_transfers = player_transfers
        self.gw_list = gw_list
    
    def to_dict(self):
        return {
            "player_transfers": self.player_transfers,
            "gw_list": self.gw_list
        }