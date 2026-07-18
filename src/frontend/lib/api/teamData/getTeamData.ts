import { LeagueType } from "../../../types/league";
import { TeamModel } from "./teamData";
import { getApiUrl } from "../../api";
import { API_ENDPOINTS } from "../../api-endpoints";

export async function getTeamData(leagueName: LeagueType): Promise<TeamModel[]> {
  const url = getApiUrl(API_ENDPOINTS.TEAM_DATA, {
    league_name: leagueName
  });
  console.log(url);
  
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store' // or adjust for revalidation as needed
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch team names and IDs: ${res.statusText}`);
  }

  const data: TeamModel[] = await res.json();
  return data;
}