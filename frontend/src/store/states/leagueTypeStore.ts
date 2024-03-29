import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fpl, LeagueType } from '../../models/shared/LeagueType';

export type LeagueTypeState = {
    leagueType: LeagueType;
};

const initialState: LeagueTypeState = {
    leagueType: fpl,
};

export const { actions: LeagueTypeActions, reducer: leagueTypeReducer } = createSlice({
  name: 'LeagueTypeStore',
  initialState: initialState,
  reducers: {
    setLeagueType: (state, action: PayloadAction<LeagueType>) => {
        state.leagueType = action.payload;
    },
  },
});