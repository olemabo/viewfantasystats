from constants import (
    esf, 
    premier_league_api_url, 
    eliteserien_api_url
)
from models.statistics.models.TransferModel import TransferModel
from player_statistics.db_models.eliteserien.player_statistics_model import EliteserienPlayerStatistic
from player_statistics.db_models.premier_league.player_statistics_model import PremierLeaguePlayers
from utils.dataFetch.DataFetch import DataFetch
from constants import esf

def GetTransferData(league_name = esf, useJson = True, gw = -1):
    api_url = eliteserien_api_url if league_name == esf else premier_league_api_url

    DFObject = DataFetch(api_url)
    
    current_gameweek = get_current_gw(DFObject)
    transferList = []
    if gw > 0 and gw <= current_gameweek:
        players = EliteserienPlayerStatistic.objects.all() if league_name == esf else PremierLeaguePlayers.objects.all()
        for player in players:
            if gw in player.round_list:
                round_index = player.round_list.index(gw)
            else:
                round_index = 0

            if round_index != 0:
                if round_index == 1:
                    cost_change_event = 0
                else:
                    cost_change_event = player.value_list[round_index] - player.value_list[round_index-1]

                transfers_in_event = -1
                transfers_out_event = -1
                selected_by_percent = player.selected_list[round_index]
                web_name = player.player_web_name
                team_code = player.player_team_id
                element_type = player.player_position_id
                status = player.player_status
                now_cost = player.value_list[round_index]
                net_transfers = player.transfers_balance_list[round_index]
                net_transfer_prev_gws = -1

                transferModel = TransferModel(
                    cost_change_event=cost_change_event,
                    transfers_in_event=transfers_in_event,
                    transfers_out_event=transfers_out_event,
                    web_name=web_name,
                    team_code=team_code,
                    element_type=element_type,
                    status=status,
                    now_cost=now_cost,
                    selected_by_percent=selected_by_percent,
                    net_transfers = net_transfers,
                    net_transfer_prev_gws=net_transfer_prev_gws,
                )

                transferList.append(transferModel.toJson() if useJson else transferModel)

    else:
        static_bootstrap = DFObject.get_current_fpl_info()

        elements = static_bootstrap["elements"]
        total_number_of_players = static_bootstrap["total_players"]

        for player in elements:
            cost_change_event = player["cost_change_event"]
            transfers_in_event = player["transfers_in_event"]
            transfers_out_event = player["transfers_out_event"]
            selected_by_percent = int(float(player["selected_by_percent"]) * int(total_number_of_players) / 100)
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
                cost_change_event=cost_change_event,
                transfers_in_event=transfers_in_event,
                transfers_out_event=transfers_out_event,
                web_name=web_name,
                team_code=team_code,
                element_type=element_type,
                status=status,
                now_cost=now_cost,
                selected_by_percent=selected_by_percent,
                net_transfers=transfers_in_event-transfers_out_event,
                net_transfer_prev_gws=net_transfer_prev_gws,
            )

            transferList.append(transferModel.toJson() if useJson else transferModel)

    return transferList, current_gameweek

def get_current_gw(DFObject: DataFetch):
    events = DFObject.get_current_fpl_info()['events']
    for event in events:
        if event['is_current']:
            return int(event['id'])
    return 1


def calculate_net_transfer_prev_gws(id, now_cost, cost_change_event, current_gw):
    # Check if cost_change_event_status is 0
    if cost_change_event != 0:
        return 0
    
    try:
        # Fetch the player data from the database
        player = EliteserienPlayerStatistic.objects.get(player_id=id)
    except EliteserienPlayerStatistic.DoesNotExist:
        # If the player does not exist, return 0
        return 0
    
    # Find the current_gw index in the round_list
    try:
        # current_gw = current_gw - 1
        max_gw = max(player.round_list)
        if (current_gw < max_gw):
            round_index = player.round_list.index(current_gw)
        else:
            round_index = player.round_list.index(max_gw)
        # round_index = round_index
    except ValueError:
        # If current_gw is not in round_list, return 0
        return 0
    
    # this means that the price last gw was changed, and old transfer should not be included in new gw
    if int(player.value_list[round_index]) != int(now_cost):
        return 0

    # Compare now_cost with the value in value_list at the found index
    # if (id == 4):
    #     print(player.value_list, player.value_list[round_index],round_index, now_cost, id, now_cost, cost_change_event, current_gw)
    # Initialize net_transfer_prev_gws
    net_transfer_prev_gws = player.transfers_balance_list[round_index]
    # if (id == 57 or id == 329):
    #     print(net_transfer_prev_gws, id, now_cost, player.value_list[round_index], player.player_name, cost_change_event, current_gw, player.round_list.index(current_gw))
    last_sum = net_transfer_prev_gws
    # if (id != 329):
    while True:
        old_current_now_cost = player.value_list[round_index]
        old_current_gw = player.round_list[round_index]
        round_index -= 1
        new_current_now_cost = player.value_list[round_index]
        new_current_gw = player.round_list[round_index]
        if old_current_now_cost != new_current_now_cost or new_current_gw == 0:
            break
        # if the check above is true, then we dont want to add transfers
        if (new_current_gw != old_current_gw):
            net_transfer_prev_gws += player.transfers_balance_list[round_index]
            last_sum = player.transfers_balance_list[round_index]
        # else:
        #     a = 10
            # print(f"Double gw for id {id}. GW: {old_current_gw} (transfers: {old_current_now_cost}) and gw: {new_current_gw} (transfers: {new_current_now_cost})")
        # print(net_transfer_prev_gws, current_gw)
        # print(1/0)
    
    last = net_transfer_prev_gws - last_sum
    # return net_transfer_prev_gws = last_sum
    return last