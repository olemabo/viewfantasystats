import { FixturePlanningProps, FixturePlanningType, fdrPeriode, fdrPlanner, fdrRotation } from './FixturePlanningType';
import { LanguageProps, LanguageType, no, en } from './LanguageType';
import { LeagueProps, LeagueType, fpl, esf } from './LeagueType';


export type { LanguageProps };
export type { LanguageType };
export { no, en };

export type { LeagueProps };
export type { LeagueType };
export { fpl, esf };

export type { FixturePlanningProps };
export type { FixturePlanningType };
export { fdrPeriode, fdrPlanner, fdrRotation }

export type PageProps = LanguageProps & LeagueProps & {
    topXManagersDefault?: number;
}