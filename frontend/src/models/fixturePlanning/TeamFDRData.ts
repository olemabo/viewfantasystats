export interface TeamFDRDataModel {
    team_name: string;
    background_color: string;
    font_color: string;
    checked: boolean;
    FDR: FDR_GW_i [];
}

export interface FDR_GW_i {
    fdr_gw_i: FDRData[];
}

export interface FDRData {
    opponent_team_name: string;
    difficulty_score: string;
    H_A: string;
    Use_Not_Use: boolean;
}