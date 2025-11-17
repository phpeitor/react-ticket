import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type Ticket = Record<string, any>;

export type TicketsFilters = {
  fechaInicio?: string;
  fechaFin?: string;
};

export const ticketsApi = createApi({
  reducerPath: "ticketsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  endpoints: (builder) => ({
    getTickets: builder.query<Ticket[], TicketsFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();

        if (filters?.fechaInicio) {
          params.append("fecha_inicio", filters.fechaInicio);
        }
        if (filters?.fechaFin) {
          params.append("fecha_fin", filters.fechaFin);
        }

        const qs = params.toString();
        return qs ? `/api/tickets?${qs}` : "/api/tickets";
      },
      transformResponse: (r: any) =>
        Array.isArray(r) ? r : r?.data ?? r?.rows ?? r?.items ?? [],
    }),
  }),
});

export const { useLazyGetTicketsQuery } = ticketsApi;
