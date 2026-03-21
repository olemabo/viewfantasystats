import { getApiUrl } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/api-endpoints";

type TeamCheckedModel = {
  team_name: string;
  checked: boolean;
  checked_must_be_in_solution: boolean;
};

export async function getTeamDataFPL(): Promise<TeamCheckedModel[]> {

    const url = getApiUrl(API_ENDPOINTS.FIXTURE_TEAM_DATA_FPL, {});
  
    const res = await fetch(url, {
        cache: 'no-store', // disable caching if needed
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch ESF fixture data: ${res.statusText}`);
    }

    const data = await res.json();


    if (!data || data.length === 0) {
        return [];
    }

    return data.map((team: any) => ({
        team_name: team.team_name,
        checked: true,
        checked_must_be_in_solution: false,
    }));
}

export async function getTeamDataESF(): Promise<TeamCheckedModel[]> {

    const url = getApiUrl(API_ENDPOINTS.FIXTURE_TEAM_DATA_FPL, {});
  
    const res = await fetch(url, {
        cache: 'no-store', // disable caching if needed
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch ESF fixture data: ${res.statusText}`);
    }

    const data = await res.json();


    if (!data || data.length === 0) {
        return [];
    }

    return data.map((team: any) => ({
        team_name: team.team_name,
        checked: true,
        checked_must_be_in_solution: false,
    }));
}