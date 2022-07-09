import json


class EliteserienFDRResponse:
    def __init__(self, fdr_data, gws_and_dates, fdr_to_colors_dict, team_name_color):
        ...
        self.fdr_data = fdr_data
        self.gws_and_dates = gws_and_dates
        self.fdr_to_colors_dict = fdr_to_colors_dict
        self.team_name_color = team_name_color

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)