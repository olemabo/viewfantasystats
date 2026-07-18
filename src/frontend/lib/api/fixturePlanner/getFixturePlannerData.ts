import { API_ENDPOINTS } from '../../api-endpoints';
import { getApiUrl } from '../../api';
import { SimpleTeamFDRDataModel, FDRData, FDR_GW_i } from '../../../models/fixturePlanning/TeamFDRData';
import { RotationPlannerTeamModel } from '../../../models/fixturePlanning/RotationPlannerTeam';
import { FixturePlanningType } from '../../../types/fixturePlanningType';
import { maxGwFpl } from '../../../constants/gws';

export interface FixtureDataResult {
  fdrData: SimpleTeamFDRDataModel[];
  fdrRotationData: RotationPlannerTeamModel[];
  startGw: number;
  endGw: number;
  maxGw: number;
}

export interface FixtureDataParams {
  startGw: number;
  endGw: number;
  minNumFixtures: number;
  fdrType: string;
  fixturePlanningType: FixturePlanningType;
  teamsToCheck?: number;
  teamsToPlay?: number;
  teamsInSolution?: string[];
  fplTeams?: string[];
}

export async function getFixtureDataFPLServerFPL(
  params: FixtureDataParams
): Promise<FixtureDataResult> {
  const url = getApiUrl(API_ENDPOINTS.FIXTURE_PLANNER, {
    startGw: params.startGw,
    endGw: params.endGw,
    minNumFixtures: params.minNumFixtures,
    fdrType: params.fdrType,
    fixturePlanningType: params.fixturePlanningType,
    teamsToCheck: params.teamsToCheck ?? 0,
    teamsToPlay: params.teamsToPlay ?? 0,
    fplTeams: Array.isArray(params.fplTeams)
      ? params.fplTeams.join(",")
      : params.fplTeams ?? "",
    teamsInSolution: Array.isArray(params.teamsInSolution)
      ? params.teamsInSolution.join(",")
      : params.teamsInSolution ?? "",
  });

  const res = await fetch(url, {
    cache: 'no-store', // disable caching if needed
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch fixture data: ${res.status}`);
  }

  const parsed = await res.json();

  
  const { gw_start, gw_end, fdr_data } = parsed;

  if (params.fixturePlanningType === 'rotation') {
    const rotationData: RotationPlannerTeamModel[] = fdr_data.map((team: string) => {
      const parsedTeam = JSON.parse(team);
      return {
        avg_Score: parsedTeam.avg_Score,
        id_list: parsedTeam.id_list,
        team_name_list: parsedTeam.team_name_list,
        extra_fixtures: parsedTeam.extra_fixtures,
        home_games: parsedTeam.home_games,
        fixture_list: parsedTeam.fixture_list,
      };
    });

    return {
      fdrData: [],
      fdrRotationData: rotationData,
      startGw: gw_start,
      endGw: gw_end,
      maxGw: maxGwFpl
    };
  } else {
    const fdrTeamData: SimpleTeamFDRDataModel[] = fdr_data.map((team: any[]) => {
      const teamName = JSON.parse(team[0][0][0]).team_name;
      const FDR_gw_i: FDR_GW_i[] = [];
      let totalScore = 0;

      team.forEach((gw: any[]) => {
        const gwData: FDRData[] = gw.map((fixture: string) => {
          const parsedFixture = JSON.parse(fixture);
          totalScore = parsedFixture.FDR_score;

          return {
            opponent_team_name: parsedFixture.opponent_team_name,
            difficulty_score: parsedFixture.difficulty_score,
            H_A: parsedFixture.H_A,
            double_blank: parsedFixture.double_blank,
            Use_Not_Use: parsedFixture.Use_Not_Use,
          };
        });

        FDR_gw_i.push({ fdr_gw_i: gwData });
      });

      return {
        team_name: teamName,
        FDR: FDR_gw_i,
        checked: true,
        fdr_total_score: totalScore,
      };
    });

    return {
      fdrData: fdrTeamData,
      fdrRotationData: [],
      startGw: gw_start,
      endGw: gw_end,
      maxGw: maxGwFpl
    };
  }
}