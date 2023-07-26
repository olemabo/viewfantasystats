import { LanguageProps, LanguageType, no, en } from './LanguageType';
import { LeagueProps, LeagueType, fpl, esf } from './LeagueType';


export type { LanguageProps };
export type { LanguageType };
export { no, en };

export type { LeagueProps };
export type { LeagueType };
export { fpl, esf };


export type PageProps = LanguageProps & LeagueProps & {
    top_x_managers_default?: number;
}