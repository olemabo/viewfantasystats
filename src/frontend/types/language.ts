import { Locale } from "../i18n/routing";

export type LanguageType = 'no' | 'en';

export const LanguageCodes = {
  NO: 'no',
  EN: 'en',
} as const;

export type LanguageProps = {
  language: Locale;
};