import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/app/redux/store';

export interface AccountState {
  credits: string;
  name: string;
  figmaUserID: string;
  photoUrl: string;
  // null until the API reports it (older API versions don't return it)
  hasBonus?: boolean | null;
}

const initialState = {
  credits: null,
  name: null,
  figmaUserID: null,
  photoUrl: null,
  hasBonus: null,
} satisfies AccountState as AccountState;

// The API may return credits as a string (varchar column) or as a number
const toCredits = (credits: string | number | null | undefined): string =>
  credits === null || credits === undefined ? null : String(credits);

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAccount(state, action: PayloadAction<AccountState>) {
      state.name = action.payload.name;
      state.figmaUserID = action.payload.figmaUserID;
      state.photoUrl = action.payload.photoUrl;
      state.credits = toCredits(action.payload.credits);
      state.hasBonus =
        typeof action.payload.hasBonus === 'boolean'
          ? action.payload.hasBonus
          : null;
    },

    updateAccountCredits(
      state,
      action: PayloadAction<{ credits: string | number }>,
    ) {
      state.credits = toCredits(action.payload.credits);
    },

    setAccountHasBonus(state, action: PayloadAction<boolean>) {
      state.hasBonus = action.payload;
    },
  },
});

export const getAccount = (state: RootState) => state.account;

export const getAccountHasBonus = (state: RootState) => state.account.hasBonus;

export const { setAccount, updateAccountCredits, setAccountHasBonus } =
  accountSlice.actions;
