import { FixturePlanningProps, FixturePlanningType, FixturePlanningTypes } from './fixturePlanningType';
import { LanguageProps, LanguageType, LanguageCodes } from './language';
import { LeagueProps, LeagueType, LeagueTypes } from './league';

export type { LanguageProps, LanguageType };
export { LanguageCodes };

export type { LeagueProps, LeagueType };
export { LeagueTypes };

export type { FixturePlanningProps, FixturePlanningType };
export { FixturePlanningTypes };

export type PageProps = LeagueProps & {
  topXManagersDefault: number;
};