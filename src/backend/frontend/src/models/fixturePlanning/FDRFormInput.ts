import { FixturePlanningType } from "../shared/FixturePlanningType";

export interface FDRFormInput {
    startGw: number;
    endGw: number;
    fdrType: string;
    excludeGws?: number[];
    minNumFixtures?: number;
    teamsToCheck?: number;
    teamsToPlay?: number;
    fplTeams?: number[];
    teamsInSolution?: number[];
    fixturePlanningType: FixturePlanningType;
}