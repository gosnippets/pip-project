import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import approverSlice from './slice/approver.slice';
import ticketSlice from './slice/ticket.slice';

export const store = configureStore({
  reducer: {
    ticket: ticketSlice,
    approver: approverSlice
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
