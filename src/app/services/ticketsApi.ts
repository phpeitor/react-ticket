import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type Ticket = Record<string, any>;

export const ticketsApi = createApi({
  reducerPath: 'ticketsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    getTickets: builder.query<Ticket[], void>({
      query: () => 'tickets',
      transformResponse: (r: any) =>
        Array.isArray(r) ? r : r?.data ?? r?.rows ?? r?.items ?? [],
    }),
  }),
});

export const { useGetTicketsQuery } = ticketsApi;
