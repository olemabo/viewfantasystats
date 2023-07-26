export type LeagueType = 'fpl' | 'esf';

export const fpl: LeagueType = 'fpl';
export const esf: LeagueType = 'esf';

export type LeagueProps = {
    league_type: LeagueType;
}