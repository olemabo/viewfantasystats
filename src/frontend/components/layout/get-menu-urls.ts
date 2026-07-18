import { LeagueType, LeagueTypes } from '../../types/league';
import { URLS } from "../../constants/urls";

const MENU_URLS = {
    FPL: {
        Statistics: {
            PlayerOwnership: URLS.INTERNAL.PREMIER_LEAGUE.PLAYER_OWNERSHIP,
            LiveFixtures: URLS.INTERNAL.PREMIER_LEAGUE.LIVE_FIXTURES,
            PlayerStatistics: URLS.INTERNAL.PREMIER_LEAGUE.PLAYER_STATS,
            PriceChange: URLS.INTERNAL.PREMIER_LEAGUE.PRICE_CHANGES,
        },
        Fixture: {
            FixturePlanner: URLS.INTERNAL.PREMIER_LEAGUE.FDR_PLANNER,
            RotationPlanner: URLS.INTERNAL.PREMIER_LEAGUE.ROTATION_PLANNER,
            PeriodPlanner: URLS.INTERNAL.PREMIER_LEAGUE.PERIOD_PLANNER,
            TeamPlanner: URLS.INTERNAL.PREMIER_LEAGUE.FDR_PLANNER_TEAM_ID
        }
    },
    ESF: {
        Statistics: {
           PlayerOwnership: URLS.INTERNAL.ELITESERIEN.PLAYER_OWNERSHIP,
            LiveFixtures: URLS.INTERNAL.ELITESERIEN.LIVE_FIXTURES,
            PlayerStatistics: URLS.INTERNAL.ELITESERIEN.PLAYER_STATS,
            PriceChange: URLS.INTERNAL.ELITESERIEN.PRICE_CHANGES,
            // RankStatistics: urls.url_eliteserien_rank_statistics,
        },
        Fixture: {
            FixturePlanner: URLS.INTERNAL.ELITESERIEN.FDR_PLANNER,
            RotationPlanner: URLS.INTERNAL.ELITESERIEN.ROTATION_PLANNER,
            PeriodPlanner: URLS.INTERNAL.ELITESERIEN.PERIOD_PLANNER,
            TeamPlanner: URLS.INTERNAL.ELITESERIEN.FDR_PLANNER_TEAM_ID
        }
    }
};

type SectionUrls = typeof MENU_URLS.FPL;

const urlsByLeague: Record<LeagueType, SectionUrls> = {
  [LeagueTypes.FPL]: MENU_URLS.FPL,
  [LeagueTypes.ESF]: MENU_URLS.ESF,
} as const;

export function getSectionUrlsByLeague(leagueType: LeagueType): SectionUrls | null {
  const sectionUrls = urlsByLeague[leagueType];
  return sectionUrls && Object.keys(sectionUrls).length > 0 ? sectionUrls : null;
}
