import { LeagueType, LeagueTypes } from "@/types/league";

export const TOP_X_MANAGERS_DEFAULT: Record<LeagueType, number> = {
  [LeagueTypes.ESF]: 5000,
  [LeagueTypes.FPL]: 10000,
};

export const PLAYER_POSITIONS_IDS = {
  Goalkeeper: "1",
  Defender: "2",
  Midfielder: "3",
  Forward: "4",
};

export const DEFAULT_PAGINATION_SIZE = 10;
