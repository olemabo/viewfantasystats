class EliteserienFDRApiResponse:
    def __init__(self, fdr_data, fdr_to_colors_dict, team_name_color, gw_start, gw_end, max_gw):
        self.fdr_data = fdr_data
        self.fdr_to_colors_dict = fdr_to_colors_dict
        self.team_name_color = team_name_color
        self.gw_start = gw_start
        self.gw_end = gw_end
        self.max_gw = max_gw

    def to_dict(self):
        return {
            "fdr_data": self.fdr_data,
            "fdr_to_colors_dict": self.fdr_to_colors_dict,
            "team_name_color": self.team_name_color,
            "gw_start": self.gw_start,
            "gw_end": self.gw_end,
            "max_gw": self.max_gw
        }