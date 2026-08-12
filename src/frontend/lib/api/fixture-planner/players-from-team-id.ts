import { getApiUrl } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { TeamNamePlayerName } from "@/models/fixturePlanning/TeamNamePlayerName";

export async function getPlayersFromTeamIdESF(
  teamId: number,
): Promise<TeamNamePlayerName[][]> {
  const url = getApiUrl(`${API_ENDPOINTS.ESF.FIXTURE_PLANNER.FANTASY_TEAM_FDR}/${teamId}/players/`)

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch players: ${res.status}`);
  }

  const data = await res.json();

  return [
    convertToTeamNamePlayerName(data.goal_keepers),
    convertToTeamNamePlayerName(data.defenders),
    convertToTeamNamePlayerName(data.midtfielders),
    convertToTeamNamePlayerName(data.forwards),
  ];
}

const convertToTeamNamePlayerName = (data: string[]): TeamNamePlayerName[] => {
  return data.map((x: any) => {
    return {
      team_id: x.team_name_short,
      player_name: x.player_name,
    };
  });
};