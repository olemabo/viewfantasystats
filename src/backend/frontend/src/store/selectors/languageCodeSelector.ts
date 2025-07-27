import { RootState } from '..';

export const languageCodeSelector = (state: RootState) => state.languageCodeStore.languageCode;