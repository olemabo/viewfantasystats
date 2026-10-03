import { API_ENDPOINTS } from '@/lib/api/shared/api-endpoints';
import { PlayerModel } from '@/models/fixturePlanning/PlayerModel';
import { TeamIdFDRModel } from '@/models/fixturePlanning/TeamFDRData';
import { LeagueType } from '@/models/shared/PageProps';
import { LeagueTypes } from '@/types/page';
import { getApiJson } from "../../shared/api-client";

export interface FixturePlannerResult {
  maxGw: number;
  currentGw: number;
  gwEnd: number;
  gwStart: number;
  fdrData?: TeamIdFDRModel[];
  fdrDataDefensive?: TeamIdFDRModel[];
  fdrDataOffensive?: TeamIdFDRModel[];
  playerList: PlayerModel[];
}

const endpointByLeague: Record<LeagueType, string> = {
  [LeagueTypes.FPL]: API_ENDPOINTS.ESF.FIXTURE_PLANNER.FANTASY_TEAM_FDR, // API_ENDPOINTS.FIXTURE_PLANNER_TEAM_ID
  [LeagueTypes.ESF]: API_ENDPOINTS.ESF.FIXTURE_PLANNER.FANTASY_TEAM_FDR,
};

export async function getFixturePlannerData(leagueType: LeagueType): Promise<FixturePlannerResult | null> {
  try {
    const data =  await getApiJson<FixturePlannerResult>(
        endpointByLeague[leagueType],
        {
          init: { cache: "no-cache" },
        },
    );

    return data;
  } catch (err) {
    console.error('Error fetching fixture planner data:', err);
    return null;
  }
}