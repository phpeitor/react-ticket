import { configureStore } from '@reduxjs/toolkit';
import { ticketsApi } from './services/ticketsApi';

export const store = configureStore({
  reducer: {
    [ticketsApi.reducerPath]: ticketsApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(ticketsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
