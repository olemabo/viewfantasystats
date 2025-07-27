export const LeagueTypes = {
  FPL: 'fpl',
  ESF: 'esf',
} as const;
  
export type LeagueType = typeof LeagueTypes[keyof typeof LeagueTypes];

export const LeaguePaths = {
  [LeagueTypes.FPL]: 'premier-league',
  [LeagueTypes.ESF]: 'eliteserien'
} as const satisfies Record<LeagueType, string>;

export type LeaguePath = typeof LeaguePaths[LeagueType];

export type LeagueProps = {
  leagueType: LeagueType;
};

export const LeagueTypeByPath = {
  'premier-league': LeagueTypes.FPL,
  'eliteserien': LeagueTypes.ESF
} as const satisfies Record<LeaguePath, LeagueType>;