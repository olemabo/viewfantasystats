import { LeagueType } from "@/types/league";
import { FixtureModel, PlayerModel, BonusModel, StatsModel } from "@/models/liveFixtures/FixtureModel";
import { getApiUrl } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/api-endpoints";

export interface GetLiveFixtureDataOptions {
  leagueType: LeagueType;
  gameweek: number;
}

export interface LiveFixturePageData {
  currentGameweek: number;
  previousGameweek: number;
  nextGameweek: number;
  hasOwnershipData: boolean;
  liveMatchId: number;
  fixtureData: [string, FixtureModel[]][];
}

export interface LiveFixtureApiResponse {
  current_gameweek: number;
  previous_gw: number;
  next_gw: number;
  has_ownership_data: boolean;
  fixture_data: string[];
}

export async function getLiveFixtureData({
  leagueType,
  gameweek,
}: GetLiveFixtureDataOptions): Promise<LiveFixturePageData> {
  try {
    const url = getApiUrl(API_ENDPOINTS.LIVE_FIXTURES, {
      league_name: leagueType,
      gw: gameweek.toString(),
    });

    const response = await fetch(url, { method: "GET" });

    if (!response.ok) {
      throw new Error(`Failed to fetch live fixture data: ${response.statusText}`);
    }

    const parsed: LiveFixtureApiResponse = JSON.parse(await response.text());

    let liveMatchId = 0;

    const fixtureDataList: FixtureModel[] = parsed.fixture_data.map((fixtureStr: any) => {
        const fixtureParsed = fixtureStr;

        if (fixtureParsed?.is_live && !liveMatchId) { 
            liveMatchId = fixtureParsed?.id;
        }

        return {
            id: fixtureParsed.id,
            finished: fixtureParsed.finished,
            started: fixtureParsed.started,
            is_live: fixtureParsed.is_live,
            kickoff_time: fixtureParsed.kickoff_time,
            team_a_name: fixtureParsed.team_a_name,
            team_h_name: fixtureParsed.team_h_name,
            team_a_score: fixtureParsed.team_a_score,
            team_h_score: fixtureParsed.team_h_score,
            stats: fixtureParsed.stats,
            players_h: extractPlayerData(fixtureParsed.players_h),
            players_a: extractPlayerData(fixtureParsed.players_a),
            bonus_list: [],
        };
    });

    // Group fixtures by date
    const elementsByDate: Record<string, FixtureModel[]> = {};

    fixtureDataList.forEach((fixModel) => {
      const date = fixModel.kickoff_time.split("T")[0];
      if (!elementsByDate[date]) elementsByDate[date] = [];
      elementsByDate[date].push(fixModel);

      // Sort players by position_id ascending
      fixModel.players_a.sort((p1, p2) => p1.position_id - p2.position_id);
      fixModel.players_h.sort((p1, p2) => p1.position_id - p2.position_id);

      // Compute bonus list if both sides have more than 4 players
      if (fixModel.players_a.length > 4 && fixModel.players_h.length > 4) {
        const sortedAway = [...fixModel.players_a].sort((p1, p2) => p2.opta_index - p1.opta_index);
        const sortedHome = [...fixModel.players_h].sort((p1, p2) => p2.opta_index - p1.opta_index);

        const bonusModel: BonusModel[] = [];
        for (let i = 0; i < 5; i++) {
          bonusModel.push({
            home_player_name: sortedHome[i].name,
            away_player_name: sortedAway[i].name,
            home_opta: sortedHome[i].opta_index,
            away_opta: sortedAway[i].opta_index,
          });
        }
        fixModel.bonus_list = bonusModel;
      }
    });

    // Convert grouped fixtures to array of [dateString, FixtureModel[]]
    const listOfLists: [string, FixtureModel[]][] = Object.entries(elementsByDate).map(
    ([date, fixtures]): [string, FixtureModel[]] => [convertDateToString(date), fixtures]
    );

    return {
      currentGameweek: parsed.current_gameweek,
      previousGameweek: parsed.previous_gw,
      nextGameweek: parsed.next_gw,
      hasOwnershipData: parsed.has_ownership_data,
      fixtureData: listOfLists,
      liveMatchId: liveMatchId,
    };
  } catch (err) {
    console.error("[getLiveFixtureData] Error:", err);
    throw new Error("Unable to load live fixture data from server.");
  }
}

function extractPlayerData(playersRaw: any[]): PlayerModel[] {
  return playersRaw.map((player: any[]) => ({
    name: player[0],
    minutes: player[1],
    opta_index: player[2],
    total_points: player[3],
    position_id: player[4],
    team_id: player[5],
    stats: extractStats(player[6]),
    EO: player[7],
  }));
}

function extractStats(statsRaw: StatsModel[]): StatsModel[] {
  return statsRaw.map((stat: StatsModel) => ({
    identifier: stat?.identifier,
    points: stat?.points,
    value: stat?.value,
  }));
}

function convertDateToString(date: string): string {
  const dateToTime = (dateObj: Date) =>
    dateObj.toLocaleString("no", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return dateToTime(new Date(date));
}