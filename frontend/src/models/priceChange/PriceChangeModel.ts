export interface PriceChangeModel {
    cost_change_event: number;
    cost_change_start: number;
    transfers_in: number;
    transfers_in_event: number;
    transfers_out: number;
    transfers_out_event: number;
    web_name: string;
    team_code: string;
    element_type: number;
    status: string;
    now_cost: number;
    selected_by_percent: string;
    net_transfer_prev_gws: number;
}