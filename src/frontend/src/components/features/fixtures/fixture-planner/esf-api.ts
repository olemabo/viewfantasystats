import { RotationPlannerTeamModel } from '@/models/fixturePlanning/RotationPlannerTeam';
import { FDR_GW_i, FDRData, TeamFDRDataModel } from '@/models/fixturePlanning/TeamFDRData';
import { TeamCheckedModel } from '@/models/fixturePlanning/TeamChecked';
import { getApiUrl } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { FixtureDataParams } from '@/lib/api/fixturePlanner/getFixturePlannerData';

interface FixtureESFDataResult {
  fdrData: TeamFDRDataModel[];
  fdrRotationData: RotationPlannerTeamModel[];
  maxGw: number;
  teamData: TeamCheckedModel[];
  startGw: number;
  endGw: number;
}

export async function getFixtureDataESFServer(
  params: FixtureDataParams,
): Promise<FixtureESFDataResult> {
  const url = getApiUrl(API_ENDPOINTS.FIXTURE_PLANNER_ESF, {
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
    throw new Error(`Failed to fetch ESF fixture data: ${res.statusText}`);
  }

  const parsed = await res.json();

  const data = parsed;

  const maxGw = data.max_gw ?? -1;
  const gw_start = data.gw_start;
  const gw_end = data.gw_end;

  let teamData: TeamCheckedModel[] = [];

  if (params.fixturePlanningType === 'rotation') {
    const fdrRotationData: RotationPlannerTeamModel[] = data.fdr_data.map((team: string) => {
      const parsed = JSON.parse(team);
      return {
        avg_Score: parsed.avg_Score,
        id_list: parsed.id_list,
        team_name_list: parsed.team_name_list,
        extra_fixtures: parsed.extra_fixtures,
        home_games: parsed.home_games,
        fixture_list: parsed.fixture_list,
      };
    });

    if (data?.team_name_color?.length > 0) {
      teamData = data.team_name_color.map((x: string[]) => ({
        team_name: x[0],
        checked: true,
        checked_must_be_in_solution: false,
      }));
    }

    console.log(teamData, "teamData")

    return {
      fdrData: [],
      fdrRotationData,
      maxGw,
      teamData,
      startGw: gw_start,
      endGw: gw_end,
    };
  }

  const fdrData: TeamFDRDataModel[] = data.fdr_data.map((team: any[]) => {
    const team_name = JSON.parse(team[0][0][0]).team_name;
    let fdr_total_score = 0;
    const FDR: FDR_GW_i[] = [];

    team.forEach((gw: any[]) => {
      const gwData: FDRData[] = gw.map((fixture: string) => {
        const parsed = JSON.parse(fixture);
        fdr_total_score = parsed.FDR_score;
        return {
          opponent_team_name: parsed.opponent_team_name,
          difficulty_score: parsed.difficulty_score,
          H_A: parsed.H_A,
          Use_Not_Use: parsed.Use_Not_Use,
          message: parsed.message,
        };
      });

      FDR.push({ fdr_gw_i: gwData });
    });

    let font_color = 'black';
    let background_color = 'white';

    if (data?.team_name_color?.length > 0) {
      data.team_name_color.forEach((team: any[]) => {
        if (team_name === team[0]) {
          background_color = team[1];
          font_color = team[2];
        }
      });
    }

    return {
      team_name,
      FDR,
      fdr_total_score,
      font_color,
      background_color,
      checked: true,
    };
  });

  return {
    fdrData,
    fdrRotationData: [],
    maxGw,
    teamData,
    startGw: gw_start,
    endGw: gw_end,
  };
}