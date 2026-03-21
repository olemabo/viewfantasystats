import { LeagueType } from "@/types/league";
import { getApiUrl } from "../api";
import { API_ENDPOINTS } from "../api-endpoints";

export type PriceChangeRaw = {
    cost_change_event: number;
    cost_change_start: number;
    transfers_in_event: number;
    transfers_out_event: number;
    net_transfers: number;
    web_name: string;
    team_code: string;
    element_type: number;
    status: string;
    now_cost: number;
    selected_by_percent: string;
    net_transfer_prev_gws: number;
};

export type PriceChangeData = {
  priceChange: PriceChangeRaw[];
  gwList: number[];
};

export async function getPriceChange(leagueType: LeagueType, gw: number): Promise<PriceChangeData> {
  const apiUrl = getApiUrl(API_ENDPOINTS.PRICE_CHANGE, {
    league_name: leagueType,
    gw
  });

  
  const response = await fetch(apiUrl, { next: { revalidate: 3600 } });
  
  if (!response.ok) {
      throw new Error("Failed to fetch price change data");
    }
    
    const data = await response.json();
    console.log(apiUrl, "api", data)

  const priceChange = data.player_transfers.map((t: string) => JSON.parse(t));

  return {
    priceChange,
    gwList: data.gw_list,
  };
}