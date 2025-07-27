export interface StatsModel {
    identifier: string;
    points: number;
    value: number;
}

export interface BonusModel {
    home_player_name: string;
    home_opta: number;
    away_player_name: string;
    away_opta: number;
}

export interface PlayerModel {
    name: string;
    minutes: number;
    opta_index: number;
    total_points: number;
    position_id: number;
    team_id: number;
    EO: number;
    stats: StatsModel[];
}

export interface FixtureModel {
    team_a_name: string;
    team_h_name: string;
    team_a_score: number;
    team_h_score: number;
    is_live: boolean;
    id: string;
    started: boolean;
    finished: boolean;
    kickoff_time: string;
    stats: any;
    players_h: PlayerModel[];
    players_a: PlayerModel[];
    bonus_list: BonusModel[];
}