import { KickOffTime } from '../../../components/features/fixtures/types/kickoff-times.types';
import { getApiUrl } from '../../api';
import { API_ENDPOINTS } from '../../api-endpoints';

export async function getKickoffTimesFPL(): Promise<KickOffTime[]> {
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

    const rawData: { gameweek: number; kickoff_time: string; day_month: string }[] = await res.json();

    return rawData.map(item => ({
      gameweek: item.gameweek,
      dateTime: item.kickoff_time,
      dayMonth: item.day_month
    }));
  } catch (err) {
    console.error("Error fetching kickoff times:", err);
    return [];
  }
}

export async function getKickoffTimesESF(): Promise<KickOffTime[]> {
  try {
    const url = getApiUrl(API_ENDPOINTS.GET_KICKOFF_TIMES_ESF);
    
    const res = await fetch(url, {
      method: 'GET',
      cache: 'no-cache',
    });

    if (!res.ok) {
      console.error("Failed to fetch kickoff times:", res.status);
      return [];
    }

    const rawData: { gameweek: number; kickoff_time: string; day_month: string }[] = await res.json();

    return rawData.map(item => ({
      gameweek: item.gameweek,
      dateTime: item.kickoff_time,
      dayMonth: item.day_month
    }));
  } catch (err) {
    console.error("Error fetching kickoff times:", err);
    return [];
  }
}