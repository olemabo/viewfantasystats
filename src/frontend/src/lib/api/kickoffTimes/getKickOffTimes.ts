import { getApiUrl } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { KickOffTimesModel } from '@/models/fixturePlanning/KickOffTimes';

export async function getKickoffTimesFPL(): Promise<KickOffTimesModel[]> {
  try {
    const url = getApiUrl(API_ENDPOINTS.GET_KICKOFF_TIMES);
    
    const res = await fetch(url, {
      method: 'GET',
      cache: 'no-cache',
    });

    if (!res.ok) {
      console.error("Failed to fetch kickoff times:", res.status);
      return [];
    }

    const rawData = await res.json();

    const parsedKickoffTimes: KickOffTimesModel[] = rawData.map((item: string) =>
      JSON.parse(item)
    );

    return parsedKickoffTimes;
  } catch (err) {
    console.error("Error fetching kickoff times:", err);
    return [];
  }
}