import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type LanguageCodeState = {
    languageCode: string;
};

const initialState: LanguageCodeState = {
    languageCode: 'no',
};

export const { actions: LanguageCodeActions, reducer: languageCodeReducer } = createSlice({
  name: 'LanguageCodeStore',
  initialState: initialState,
  reducers: {
    setLanguageCode: (state, action: PayloadAction<string>) => {
        state.languageCode = action.payload;
    },
  },
});