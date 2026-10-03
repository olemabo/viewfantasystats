import { API_ENDPOINTS } from '@/lib/api/shared/api-endpoints';
import { FixtureDataParams } from '@/lib/api/fixture-planner/fixture-planner';
import { RotationPlannerTeamModel } from '@/models/fixturePlanning/RotationPlannerTeam';
import { FDRData, TeamFDRDataModel } from '@/models/fixturePlanning/TeamFDRData';
import { TeamCheckedModel } from '@/models/fixturePlanning/TeamChecked';
import { getApiJson } from '../../shared/api-client';

export interface FixtureDataResult {
  fdrData: RotationPlannerTeamModel[] | FDRData[][][];
  fdrRotationData: RotationPlannerTeamModel[];
  teamData: TeamCheckedModel[];
  startGw: number;
  endGw: number;
  maxGw: number;
}

interface FixtureESFDataResult {
  fdrData: TeamFDRDataModel[];
  fdrRotationData: RotationPlannerTeamModel[];
  teamData: TeamCheckedModel[];
  startGw: number;
  endGw: number;
  maxGw: number;
}

export async function getFixturePlannerESF(
  params: FixtureDataParams,
): Promise<FixtureESFDataResult> {
  const data = await getApiJson<FixtureESFDataResult>(
    API_ENDPOINTS.ESF.FIXTURE_PLANNER.FDR,
    {
      params: {
        startGw: params.startGw,
        endGw: params.endGw,
        minNumFixtures: params.minNumFixtures,
        fdrType: params.fdrType,
        fixturePlanningType: params.fixturePlanningType,
        teamsToCheck: params.teamsToCheck ?? 0,
        teamsToPlay: params.teamsToPlay ?? 0,
        fplTeams: Array.isArray(params.fplTeams)
        ? params.fplTeams?.join(",")
        : params.fplTeams ?? "",
        teamsInSolution: Array.isArray(params.teamsInSolution)
        ? params.teamsInSolution.join(",")
        : params.teamsInSolution ?? "",
      },
      init: {
        cache: "no-store",
      },
    },
  );

  const maxGw = data.maxGw ?? -1;
  const gw_start = data.startGw;
  const gw_end = data.endGw;


  if (params.fixturePlanningType === 'rotation') {
    return {
      fdrData: [],
      fdrRotationData: data.fdrData as unknown as RotationPlannerTeamModel[],
      maxGw,
      teamData: [],
      startGw: gw_start,
      endGw: gw_end,
    };
  }

    const fdrData: TeamFDRDataModel[] = (data.fdrData as unknown as FDRData[][][]).map(
      (team) => {
          const teamName = team[0][0].teamName;

          let fdrTotalScore = 0;
          const FDR: TeamFDRDataModel["FDR"] = [];

          team.forEach((gw) => {
            fdrTotalScore = gw[0]?.fdrScore ?? 0;

            FDR.push({
                fixtures: gw,
            });
          });


          return {
              teamName,
              FDR,
              fdrTotalScore,
              checked: true,
              };
          },
      );
    
    return {
        fdrData,
        fdrRotationData: [],
        maxGw,
        teamData: [],
        startGw: gw_start,
        endGw: gw_end,
    };
}