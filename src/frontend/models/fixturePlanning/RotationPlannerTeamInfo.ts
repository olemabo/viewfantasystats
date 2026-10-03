import { FDRData } from "./TeamFDRData";

export interface RotationPlannerTeamInfoModel {
    avgScore: number;
    idList: string[];
    teamNameList: string[];
    extraFixtures: number;
    homeGames: number;
    fixtureList: FDRData[][][];
}