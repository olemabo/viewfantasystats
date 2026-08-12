export const URLS = {
  INTERNAL: {
    PREMIER_LEAGUE: {
      BASE: 'premier-league',
      FDR_PLANNER: 'premier-league/fdr-planner',
      ROTATION_PLANNER: 'premier-league/rotation-planner',
      FDR_PLANNER_TEAM_ID: 'premier-league/fdr-planner-team-id',
      PERIOD_PLANNER: 'premier-league/periode-planner',
      PLAYER_OWNERSHIP: 'premier-league/player-ownership',
      PLAYER_STATS: 'premier-league/player-statistics',
      LIVE_FIXTURES: 'premier-league/live-fixtures',
      PRICE_CHANGES: 'premier-league/price-change',
    },

    ELITESERIEN: {
      BASE: 'eliteserien',
      FDR_PLANNER: 'eliteserien/fdr-planner',
      ROTATION_PLANNER: 'eliteserien/rotation-planner',
      FDR_PLANNER_TEAM_ID: 'eliteserien/fdr-planner-team-id',
      PERIOD_PLANNER: 'eliteserien/periode-planner',
      PLAYER_OWNERSHIP: 'eliteserien/player-ownership',
      PLAYER_STATS: 'eliteserien/player-statistics',
      SEARCH_USER_NAME: 'eliteserien/search-user-names',
      RANK_STATS: 'eliteserien/rank-statistics',
      LIVE_FIXTURES: 'eliteserien/live-fixtures',
      PRICE_CHANGES: 'eliteserien/price-change',
    },
  },

  API: {
    FDR: {
      PREMIER_LEAGUE_FROM_TEAM_ID: '/fixture-planner/get-fdr-data-from-team-id/',
      ELITESERIEN_FROM_TEAM_ID: 'eliteserien/fixture-planner/fantasy-team-fdr/',
    },
  },

  EXTERNAL: {
    PERSONAL: {
      TWITTER: 'https://twitter.com/Ole_Borge',
      GITHUB: 'https://github.com/olemabo/viewfantasystats',
    },
    OFFICIAL: {
      FPL: 'https://fantasy.premierleague.com/',
    },
    SPREADSHEETS: {
      DAGFINN_THON:
        'https://docs.google.com/spreadsheets/d/10vu3C6lib9qGyoZ6As6qfRZywZUrxpA0zuZogI7D5tA/edit?gid=1349521432#gid=1349521432',
    },
  },
};