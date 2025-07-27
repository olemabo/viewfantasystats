export interface PlayerOwnershipModel {
    player_name: string;
    player_position_id: string;
    player_team_id: string;
    ownership: number[];
    filter_out: boolean;
}