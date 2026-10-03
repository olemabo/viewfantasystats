export const API_ENDPOINTS = {
  PLAYER_OWNERSHIP: 'statistics/player-ownership-api/',
  FIXTURE_PLANNER: 'fixture-planner/get-all-fdr-data/',
  FIXTURE_PLANNER_ESF: '/fixture-planner-eliteserien/get-all-eliteserien-fdr-data/',
  GET_KICKOFF_TIMES: '/fixture-planner/get-kickoff-times/',
  GET_KICKOFF_TIMES_ESF: '/fixture-planner-eliteserien/get-eliteserien-kickoff-times/',
  PLAYER_STATISTICS: '/statistics/player-statistics-api/',
  FIXTURE_PLANNER_TEAM_ID: '/fixture-planner/get-fdr-data-from-team-id/',
  FIXTURE_PLANNER_TEAM_ID_ESF: '/fixture-planner-eliteserien/get-fdr-data-from-team-id/',
  LIVE_FIXTURES: '/statistics/live-fixtures-api/',
  PRICE_CHANGE: 'statistics/price-change-api/',
  TEAM_DATA: 'statistics/team-names-ids',
  FIXTURE_TEAM_DATA_FPL: '/fixture-planner-eliteserien/get-eliteserien-team-data/',
  FPL: {
    GET_KICKOFF_TIMES: '/fixture-planner/get-kickoff-times/',
    GET_TEAM_DATA: '/fixture-planner/team-data/',
  },
  ESF: {
    FIXTURE_PLANNER: {
      KICKOFF_TIMES: "elitserien/fixture-planner/kickoff-times",
      FDR: "elitserien/fixture-planner/fdr",
      FANTASY_TEAM_FDR: "elitserien/fixture-planner/fantasy-team-fdr",
      FIXTURE_TEAMS: "elitserien/fixture-planner/fixture-teams",
    },
  },
  // ... add more here
};