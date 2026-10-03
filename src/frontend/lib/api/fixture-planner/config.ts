import { LeagueType, LeagueTypes } from "@/types/league";
import { API_ENDPOINTS } from "@/lib/api/shared/api-endpoints";

export const fixturePlannerConfig: Record<
  LeagueType,
  { fdrEndpoint: string; defaultMaxGw: number }
> = {
  [LeagueTypes.FPL]: {
    fdrEndpoint: API_ENDPOINTS.FIXTURE_PLANNER,
    defaultMaxGw: 38,
  },
  [LeagueTypes.ESF]: {
    fdrEndpoint: API_ENDPOINTS.ESF.FIXTURE_PLANNER.FDR,
    defaultMaxGw: 30,
  },
};