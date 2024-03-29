import json 

class PlayerOwnershipApiResponse:
    def __init__(self, ownershipdata, newest_updated_gw, available_gws, team_names_and_ids, chip_data, top_x_managers_list, is_updating_precentage=0, is_updating_gw=0):
        ...
        self.ownershipdata = ownershipdata
        self.newest_updated_gw = newest_updated_gw
        self.available_gws = available_gws
        self.team_names_and_ids = team_names_and_ids
        self.chip_data = chip_data
        self.top_x_managers_list = top_x_managers_list
        self.is_updating_precentage = is_updating_precentage
        self.is_updating_gw = is_updating_gw
    
    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)