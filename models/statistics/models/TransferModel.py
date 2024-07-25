import json 


class TransferModel:
    def __init__(self, cost_change_event, cost_change_start, transfers_in, transfers_in_event, transfers_out, transfers_out_event, web_name, team_code, element_type, status, now_cost, selected_by_percent, net_transfer_prev_gws):
        ...
        self.cost_change_event = cost_change_event
        self.cost_change_start = cost_change_start
        self.transfers_in = transfers_in
        self.transfers_in_event = transfers_in_event
        self.transfers_out = transfers_out
        self.transfers_out_event = transfers_out_event
        self.web_name = web_name
        self.team_code = team_code
        self.element_type = element_type
        self.status = status
        self.now_cost = now_cost
        self.selected_by_percent = selected_by_percent
        self.net_transfer_prev_gws = net_transfer_prev_gws
    
    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)