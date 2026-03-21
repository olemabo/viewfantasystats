class FDRApiResponse:
    def __init__(self, fdr_data, fdr_data_defensive, fdr_data_offensive, 
                 gws_and_dates, gw_start, gw_end, 
                 current_gw, max_gw, player_list=[]):
        self.fdr_data = fdr_data
        self.fdr_data_defensive = fdr_data_defensive
        self.fdr_data_offensive = fdr_data_offensive
        self.gws_and_dates = gws_and_dates
        self.gw_start = gw_start
        self.gw_end = gw_end
        self.current_gw = current_gw
        self.max_gw = max_gw
        self.player_list = player_list

    def to_dict(self):
        return {
            "fdr_data": self.fdr_data,
            "fdr_data_defensive": self.fdr_data_defensive,
            "fdr_data_offensive": self.fdr_data_offensive,
            "gws_and_dates": self.gws_and_dates,
            "gw_start": self.gw_start,
            "gw_end": self.gw_end,
            "current_gw": self.current_gw,
            "max_gw": self.max_gw,
            "player_list": self.player_list,
        }


class FDRTeamIDApiResponse:
    def __init__(self, goal_keepers, defenders, midtfielders, forwards):
        self.goal_keepers = goal_keepers
        self.defenders = defenders
        self.midtfielders = midtfielders
        self.forwards = forwards

    def to_dict(self):
        return {
            "goal_keepers": self.goal_keepers,
            "defenders": self.defenders,
            "midtfielders": self.midtfielders,
            "forwards": self.forwards,
        }