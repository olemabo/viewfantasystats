export type CategoryTypes = 'Name' | 'Points' | 'Bps' | 'ICT' | 'I' | 'C' | 'T' | 'xG' | 'xA' | 'xGI' | 'xGC' | 'Mins';

export interface PlayerStatisticsModel {
    Name: string;
    player_team_id: number;
    player_position_id: number;
    player_statistics_list: number[];
}