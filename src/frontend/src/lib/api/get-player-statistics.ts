import { TeamNameAndIdModel } from '@/models/playerOwnership/TeamNameAndIdModel';
import { PlayerStatisticsModel } from '@/models/playerStatistics/PlayerStatisticsModel';
import { API_ENDPOINTS } from '../api-endpoints';
import { getApiUrl } from '../api';
import { LeagueType } from '@/types/league';

export interface GetPlayerStatsOptions {
  leagueType: LeagueType;
  lastXGws: number;
}

export async function getPlayerStatistics({
  leagueType,
  lastXGws,
}: GetPlayerStatsOptions): Promise<{
  categories: string[];
//   teamNameAndIds: TeamNameAndIdModel[];
  playerStatistics: PlayerStatisticsModel[];
  totalNumberOfGws: number;
}> {
  try {
    const url = getApiUrl(API_ENDPOINTS.PLAYER_STATISTICS, {
      league_name: leagueType,
      last_x_gw: lastXGws.toString(),
    });

    const response = await fetch(url, {
      method: 'GET',
    //   next: { revalidate: 60 }, // Optional ISR caching
    });

    
    if (!response.ok) {
        throw new Error(`Failed to fetch player statistics: ${response.statusText}`);
    }
    
    const parsed = JSON.parse(await response.text());
    console.log(parsed.total_number_of_gws, "parsed", url)

    return {
      categories: parsed.categories ?? [],
    //   teamNameAndIds: (parsed.team_names_and_ids ?? []).map((team: string) => {
    //     const parsedTeam = JSON.parse(team);
    //     return {
    //       team_name: parsedTeam.team_name,
    //       team_id: parsedTeam.id,
    //     };
    //   }),
      playerStatistics: parsed.player_info ?? [],
      totalNumberOfGws: parsed.total_number_of_gws ?? 0,
    };
  } catch (err) {
    console.error('[getPlayerStatisticsServer] Error:', err);
    throw new Error('Unable to load player statistics from server.');
  }
}