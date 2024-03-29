import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type IsMenuOpenState = {
    isMenuOpen: boolean;
};

const initialState: IsMenuOpenState = {
    isMenuOpen: false,
};

export const { actions: IsMenuOpenActions, reducer: isMenuOpenReducer } = createSlice({
  name: 'IsMenuOpenStore',
  initialState: initialState,
  reducers: {
    setisMenuOpen: (state, action: PayloadAction<boolean>) => {
        state.isMenuOpen = action.payload;
    },
  },
});