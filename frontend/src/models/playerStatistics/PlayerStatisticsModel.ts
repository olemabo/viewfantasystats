export type CategoryTypes = 'Name' | 'Points' | 'Bps' | 'ICT' | 'I' | 'C' | 'T' | 'xG' | 'xA' | 'xGI' | 'xGC' | 'Mins';

export interface PlayerStatisticsModel {
    Name: string;
    ICT: number;
    Points: number;
    Bps: number;
    I: number;
    C: number;
    T: number;
    player_team_id: number;
    player_position_id: number;
    xG: number;
    xA: number;
    xGI: number;
    xGC: number;
    Mins: number;
}