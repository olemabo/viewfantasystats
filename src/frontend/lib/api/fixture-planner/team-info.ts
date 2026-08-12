import { getApiUrl } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/api-endpoints";

type TeamInfo = {
  teamName: string;
  teamId: number;
  teamShortName: string;
};

export type TeamFilterState = {
  teamId: number;
  teamName: string;
  checked: boolean;
  mustBeInSolution: boolean;
};

export async function getTeamDataFPL(): Promise<TeamFilterState[]> {
  const url = getApiUrl(API_ENDPOINTS.FPL.GET_TEAM_DATA, {});

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch FPL team data: ${response.statusText}`,
    );
  }

  const teams = (await response.json()) as TeamInfo[];

  return createTeamFilterState(teams);
}

export async function getTeamDataESF(): Promise<TeamFilterState[]> {
  const url = getApiUrl(
    API_ENDPOINTS.ESF.FIXTURE_PLANNER.FIXTURE_TEAMS,
    {},
  );

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch ESF team data: ${response.statusText}`,
    );
  }

  const teams = (await response.json()) as TeamInfo[];

  return createTeamFilterState(teams);
}

function createTeamFilterState(
  teams: TeamInfo[],
): TeamFilterState[] {
  return teams.map((team) => ({
    teamId: team.teamId,
    teamName: team.teamName,
    checked: true,
    mustBeInSolution: false,
  }));
}