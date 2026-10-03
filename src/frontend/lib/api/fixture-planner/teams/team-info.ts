import { API_ENDPOINTS } from "@/lib/api/shared/api-endpoints";
import { getApiJson } from "@/lib/api/shared/api-client";
import { LeagueType, LeagueTypes } from "@/types/league";

type TeamDto = {
  teamName: string;
  teamId: number;
  teamShortName: string;
};

export type TeamFilterOption = {
  teamId: number;
  teamName: string;
  checked: boolean;
  mustBeInSolution: boolean;
};

export async function getFixturePlannerTeams(
  league: LeagueType,
): Promise<TeamFilterOption[]> {
  const endpoint =
    league === LeagueTypes.FPL
      ? API_ENDPOINTS.FPL.GET_TEAM_DATA
      : API_ENDPOINTS.ESF.FIXTURE_PLANNER.FIXTURE_TEAMS;

  const teams = await getApiJson<TeamDto[]>(endpoint, {
    init: { cache: "no-store" },
  });

  return teams.map((team) => ({
    teamId: team.teamId,
    teamName: team.teamName,
    checked: true,
    mustBeInSolution: false,
  }));
}