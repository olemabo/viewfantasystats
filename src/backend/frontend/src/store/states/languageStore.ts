import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { content_json } from '../../language/languageContent';

export type LanguageState = {
    language: object;
};

const initialState: LanguageState = {
    language: content_json.Norwegian,
};

export const { actions: languageActions, reducer: languageReducer } = createSlice({
  name: 'LanguageStore',
  initialState: initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<object>) => {
        state.language = action.payload;
    },
  },
});