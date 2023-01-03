import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import approverSlice from './slice/approver';
import ticketSlice from './slice/ticket';
import softwareSlice from './slice/software';

export const store = configureStore({
  reducer: {
    ticket: ticketSlice,
    approver: approverSlice,
    software: softwareSlice
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
