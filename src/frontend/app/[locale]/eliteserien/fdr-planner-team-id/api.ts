import { getApiUrl } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { PlayerModel } from '@/models/fixturePlanning/PlayerModel';
import { FDRData, FdrFixture, TeamIdFDRModel } from '@/models/fixturePlanning/TeamFDRData';

export interface FixturePlannerResult {
  maxGw: number;
  currentGw: number;
  gwEnd: number;
  playerList: PlayerModel[];
  fixtureData: TeamIdFDRModel[][];
}

function convertFixtureData(fdr_data: any[]): TeamIdFDRModel[] {
  if (!fdr_data || fdr_data.length < 1) return [];

  const result: TeamIdFDRModel[] = [];

  for (const teamStr of fdr_data) {
    const team = teamStr;
    const { team_name_short, team_id } = team;

    const FDR_gw_i: FdrFixture[] = team.fdr.map((fdrForGw: any[]) => {
      const fdrList: FDRData[] = fdrForGw.map((item: string) => {
        const parsed = JSON.parse(item);
        return {
          opponent_team_name: parsed.opponent_team_name,
          difficulty_score: parsed.difficulty_score,
          H_A: parsed.H_A,
          Use_Not_Use: parsed.Use_Not_Use ?? 0,
          message: parsed.message,
        };
      });
      return { fdr_gw_i: fdrList };
    });

    result.push({
      team_name_short,
      team_id,
      FDR: FDR_gw_i,
    });
  }

  return result;
}

export async function getFixturePlannerData(leagueType: string): Promise<FixturePlannerResult | null> {
  try {
    const url =
      leagueType === 'esf'
        ? getApiUrl(API_ENDPOINTS.ESF.FIXTURE_PLANNER.FANTASY_TEAM_FDR)
        : getApiUrl(API_ENDPOINTS.FIXTURE_PLANNER_TEAM_ID);

    const res = await fetch(url, {
      method: 'GET',
      cache: 'no-cache',
    });

    if (!res.ok) {
      console.error(`Failed to fetch fixture planner data: ${res.status}`);
      return null;
    }

    const data = await res.json();

    const playerList: PlayerModel[] = data.player_list?.map((player: string) => {
      const parsed = JSON.parse(player);
      return {
        player_position_id: parsed.player_position_id,
        player_web_name: parsed.player_web_name,
        player_team_id: parsed.player_team_id,
      };
    }) || [];

    const fdrData = convertFixtureData(data.fdr_data);
    const fdrDataDef = convertFixtureData(data.fdr_data_defensive);
    const fdrDataOff = convertFixtureData(data.fdr_data_offensive);

    return {
      maxGw: data.max_gw,
      currentGw: data.current_gw,
      gwEnd: data.gw_end,
      playerList,
      fixtureData: [fdrData, fdrDataDef, fdrDataOff],
    };
  } catch (err) {
    console.error('Error fetching fixture planner data:', err);
    return null;
  }
}