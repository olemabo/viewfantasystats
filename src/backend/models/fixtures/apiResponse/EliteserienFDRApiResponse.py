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
            "fdrData": self.fdr_data,
            "fdrToColorsDict": self.fdr_to_colors_dict,
            "teamNameColor": self.team_name_color,
            "startGw": self.gw_start,
            "endGw": self.gw_end,
            "maxGw": self.max_gw
        }