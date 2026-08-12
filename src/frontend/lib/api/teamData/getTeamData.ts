import { cacheLife } from "next/cache";
import { LeagueType } from "@/types/league";
import { TeamModel } from "./teamData";
import { getApiUrl } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/api-endpoints";

/**
 * Fetches team names and IDs for the given league.
 *
 * The result is cached per league type so the same team metadata can be reused
 * across pages without forcing a fresh request on every render.
 *
 * @param leagueName The league to fetch team data for.
 * @returns A list of teams with their names and IDs.
 * @throws If the API request fails.
 */
export async function getTeamData(
  leagueName: LeagueType,
): Promise<TeamModel[]> {
  "use cache";
  cacheLife("hours");

  const url = getApiUrl(API_ENDPOINTS.TEAM_DATA, {
    league_name: leagueName,
  });

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch team names and IDs: ${res.statusText}`);
  }

  const data: TeamModel[] = await res.json();
  return data;
}