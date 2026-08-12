export interface TeamFDRDataModel {
    teamName: string;
    background_color: string;
    font_color: string;
    checked: boolean;
    FDR: FdrFixture[];
    fdr_total_score: number;
}

export interface TeamIdFDRModel {
    team_name_short: string;
    team_id: number;
    FDR: FdrFixture[];
}

export interface SimpleTeamFDRDataModel {
    teamName: string;
    checked: boolean;
    FDR: FdrFixture[];
    fdr_total_score: number;
}

export interface FdrFixture {
    fixtures: FDRData[];
}

export interface FDRData {
  teamName: string;
  opponentTeamName: string;
  difficultyScore: string;
  homeAway: string;
  useNotUse: boolean;
  fdrScore: number;
  doubleBlank?: string;
  message?: string;
}