import { RotationPlannerTeamModel } from '../../../../models/fixturePlanning/RotationPlannerTeam';
import { FDRData, FdrFixture, TeamFDRDataModel } from '../../../../models/fixturePlanning/TeamFDRData';
import { TeamCheckedModel } from '../../../../models/fixturePlanning/TeamChecked';
import { getApiUrl } from '../../../../lib/api';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { FixtureDataParams } from '@/lib/api/fixture-planner/fixture-planner';

interface FixtureESFDataResult {
  fdrData: TeamFDRDataModel[];
  fdrRotationData: RotationPlannerTeamModel[];
  maxGw: number;
  teamData: TeamCheckedModel[];
  startGw: number;
  endGw: number;
}

export async function getESFFixtureData(
  params: FixtureDataParams,
): Promise<FixtureESFDataResult> {
  const url = getApiUrl(API_ENDPOINTS.ESF.FIXTURE_PLANNER.FDR, {
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
    const fdrRotationData: RotationPlannerTeamModel[] = data.fdr_data.map(
       (team: RotationPlannerTeamModel) => ({
        avg_Score: team.avg_Score,
        id_list: team.id_list,
        team_name_list: team.team_name_list,
        extra_fixtures: team.extra_fixtures,
        home_games: team.home_games,
        fixture_list: team.fixture_list,
      }),
    );

    if (data?.team_name_color?.length > 0) {
      teamData = data.team_name_color.map((x: string[]) => ({
        team_name: x[0],
        checked: true,
        mustBeInSolution: false,
      }));
    }

    return {
      fdrData: [],
      fdrRotationData,
      maxGw,
      teamData,
      startGw: gw_start,
      endGw: gw_end,
    };
  }

  const fdrData: TeamFDRDataModel[] = data.fdr_data.map(
  (team: FDRData[][]) => {
    console.log( team[0][0], "parsing team data");
    const teamName = team[0][0].teamName;

    let fdrTotalScore = 0;
    const FDR: FdrFixture[] = [];

    team.forEach((gw) => {
      fdrTotalScore = gw[0]?.fdrScore ?? 0;

      FDR.push({
        fixtures: gw,
      });
    });

    let fontColor = "black";
    let backgroundColor = "white";

    if (data?.team_name_color?.length > 0) {
      data.team_name_color.forEach((team: any[]) => {
        if (teamName === team[0]) {
          backgroundColor = team[1];
          fontColor = team[2];
        }
      });
    }

    return {
      teamName,
      FDR,
      fdrTotalScore,
      fontColor,
      backgroundColor,
      checked: true,
    };
  },
);

  return {
    fdrData,
    fdrRotationData: [],
    maxGw,
    teamData,
    startGw: gw_start,
    endGw: gw_end,
  };
}