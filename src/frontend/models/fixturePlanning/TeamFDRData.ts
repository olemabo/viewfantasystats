export interface TeamFDRDataModel {
    teamName: string;
    checked: boolean;
    FDR: FdrFixture[];
    fdrTotalScore: number;
}

export type FDRModel = {
    H_A?: string;
    UseNotUse?: string;
    difficultyScore?: string;
    message?: string;
    opponentTeamName?: string;
    doubleBlank?: string;
}

export interface TeamIdFDRModel {
    teamNameShort: string;
    teamId: number;
    fdr: FDRModel[][];
}

export interface SimpleTeamFDRDataModel {
    teamName: string;
    checked: boolean;
    FDR: FdrFixture[];
    fdrTotalScore: number;
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