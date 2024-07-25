from constants import (
    esf, 
    premier_league_api_url, 
    eliteserien_api_url
)
from ml.extract_data import calculate_net_transfer_prev_gws
from models.statistics.models.TransferModel import TransferModel
from utils.dataFetch.DataFetch import DataFetch
from constants import esf

def GetTransferData(league_name = esf, useJson = True):
    api_url = eliteserien_api_url if league_name == esf else premier_league_api_url

    DFObject = DataFetch(api_url)
    
    current_gameweek = get_current_gw(DFObject)
    static_bootstrap = DFObject.get_current_fpl_info()

    elements = static_bootstrap["elements"]

    transferList = []

    for player in elements:
        cost_change_event = player["cost_change_event"]
        cost_change_start = player["cost_change_start"]
        transfers_in = player["transfers_in"]
        transfers_in_event = player["transfers_in_event"]
        transfers_out = player["transfers_out"]
        transfers_out_event = player["transfers_out_event"]
        selected_by_percent = player["selected_by_percent"]
        web_name = player["web_name"]
        team_code = player["team"]
        element_type = player["element_type"]
        status = player["status"]
        now_cost = player["now_cost"]

        net_transfer_prev_gws = calculate_net_transfer_prev_gws(
            player['id'], 
            now_cost - cost_change_event, 
            0, 
            current_gameweek
        )

        transferModel = TransferModel(
            cost_change_event,
            cost_change_start,
            transfers_in,
            transfers_in_event,
            transfers_out,
            transfers_out_event,
            web_name,
            team_code,
            element_type,
            status,
            now_cost,
            selected_by_percent,
            net_transfer_prev_gws,
        )

        transferList.append(transferModel.toJson() if useJson else transferModel)

    return transferList

def get_current_gw(DFObject: DataFetch):
    events = DFObject.get_current_fpl_info()['events']
    for event in events:
        if event['is_current']:
            return int(event['id'])
    return 1