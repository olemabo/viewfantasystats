import { API_ENDPOINTS } from "@/lib/api/shared/api-endpoints";
import { getApiJson } from "../../shared/api-client";
import { LeagueType, LeagueTypes } from "@/types/league";

export type KickOffTime = {
    gameweek: number;
    dateTime: string;
    dayMonth: string;
}

const endpointByLeague: Record<LeagueType, string> = {
  [LeagueTypes.FPL]: API_ENDPOINTS.GET_KICKOFF_TIMES,
  [LeagueTypes.ESF]: API_ENDPOINTS.ESF.FIXTURE_PLANNER.KICKOFF_TIMES,
};

export async function getKickoffTimes(
  leagueType: LeagueType,
): Promise<KickOffTime[]> {
  try {
    return await getApiJson<KickOffTime[]>(
      endpointByLeague[leagueType],
      {
        init: { cache: "no-cache" },
      },
    );
  } catch (error) {
    console.error("Error fetching kickoff times:", error);
    return [];
  }
}