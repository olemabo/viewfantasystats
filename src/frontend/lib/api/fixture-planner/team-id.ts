import { getApiUrl } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { PlayerModel } from "@/models/fixturePlanning/PlayerModel";
import {
  FDRData,
  FdrFixture,
  TeamIdFDRModel,
} from "@/models/fixturePlanning/TeamFDRData";

export interface FixturePlannerResult {
  maxGw: number;
  currentGw: number;
  gwEnd: number;
  playerList: PlayerModel[];
  fixtureData: TeamIdFDRModel[][];
}

type FixturePlannerApiResponse = {
  max_gw: number;
  current_gw: number;
  gw_end: number;
  player_list: string[];
  fdr_data: TeamFDRApiModel[];
  fdr_data_defensive: TeamFDRApiModel[];
  fdr_data_offensive: TeamFDRApiModel[];
};

type TeamFDRApiModel = {
  team_name_short: string;
  team_id: number;
  fdr: string[][];
};

function mapFixtureData(fdrData: TeamFDRApiModel[]): TeamIdFDRModel[] {
  if (!fdrData?.length) {
    return [];
  }

  return fdrData.map((team) => ({
    team_name_short: team.team_name_short,
    team_id: team.team_id,
    FDR: team.fdr.map((fixtures) => ({
      fdr_gw_i: fixtures.map((fixture) => {
        const parsed = JSON.parse(fixture);

        return {
          opponent_team_name: parsed.opponent_team_name,
          difficulty_score: parsed.difficulty_score,
          H_A: parsed.H_A,
          Use_Not_Use: parsed.Use_Not_Use ?? 0,
          message: parsed.message,
        };
      }),
    })),
  }));
}

function mapPlayerData(playerData: string[]): PlayerModel[] {
  if (!playerData?.length) {
    return [];
  }

  return playerData.map((player) => {
    const parsed = JSON.parse(player);

    return {
      player_position_id: parsed.player_position_id,
      player_web_name: parsed.player_web_name,
      player_team_id: parsed.player_team_id,
    };
  });
}

function mapFixturePlannerResult(
  data: FixturePlannerApiResponse,
): FixturePlannerResult {
  return {
    maxGw: data.max_gw,
    currentGw: data.current_gw,
    gwEnd: data.gw_end,
    playerList: mapPlayerData(data.player_list),
    fixtureData: [
      mapFixtureData(data.fdr_data),
      mapFixtureData(data.fdr_data_defensive),
      mapFixtureData(data.fdr_data_offensive),
    ],
  };
}

async function fetchFixturePlannerData(
  url: string,
): Promise<FixturePlannerResult | null> {
  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "no-cache",
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch fixture planner data: ${response.status}`,
      );
      return null;
    }

    const data: FixturePlannerApiResponse = await response.json();

    return mapFixturePlannerResult(data);
  } catch (error) {
    console.error("Error fetching fixture planner data:", error);
    return null;
  }
}

export async function getFixturePlannerDataFPL(): Promise<FixturePlannerResult | null> {
  const url = getApiUrl(API_ENDPOINTS.FIXTURE_PLANNER_TEAM_ID);

  return fetchFixturePlannerData(url);
}

export async function getFixturePlannerDataESF(): Promise<FixturePlannerResult | null> {
  const url = getApiUrl(API_ENDPOINTS.FIXTURE_PLANNER_TEAM_ID_ESF);

  return fetchFixturePlannerData(url);
}