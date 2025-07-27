import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import { languageCodeReducer } from './states/languageCodeStore';
import { languageReducer } from './states/languageStore';
import { isMenuOpenReducer } from './states/isMenuOpenStore';
import { leagueTypeReducer } from './states/leagueTypeStore';

const store = configureStore({
    reducer: {
        leagueTypeStore: leagueTypeReducer,
        languageCodeStore: languageCodeReducer,
        languageStore: languageReducer,
        isMenuOpenStore: isMenuOpenReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch();

export default store;