import * as urls from './internalUrls';

export const leagueUrls = {
    urlsFpl: {
        Statistics: {
            PlayerOwnership: urls.url_premier_league_player_ownership,
            LiveFixtures: urls.url_premier_league_live_fixtures,
            PlayerStatistics: urls.url_premier_league_player_statistics,
            PriceChange: urls.url_premier_league_price_change,
        },
        Fixture: {
            FixturePlanner: urls.url_premier_league_fdr_planner,
            RotationPlanner: urls.url_premier_league_rotation_planner,
            PeriodPlanner: urls.url_premier_league_periode_planner,
            TeamPlanner: urls.url_premier_league_fdr_planner_team_id
        }
    },
    urlsEsf: {
        Statistics: {
            PlayerOwnership: urls.url_eliteserien_player_ownership,
            LiveFixtures: urls.url_eliteserien_live_fixtures,
            PlayerStatistics: urls.url_eliteserien_player_statistics,
            PriceChange: urls.url_eliteserien_price_change,
            RankStatistics: urls.url_eliteserien_rank_statistics,
        },
        Fixture: {
            FixturePlanner: urls.url_eliteserien_fdr_planner,
            RotationPlanner: urls.url_eliteserien_rotation_planner,
            PeriodPlanner: urls.url_eliteserien_periode_planner,
            TeamPlanner: urls.url_eliteserien_fdr_planner_team_id
        }
    }
};