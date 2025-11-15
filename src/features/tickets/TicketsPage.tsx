import React from "react";
import {
  Box,
  LinearProgress,
  Typography,
  Paper,
  Stack,
  Button,
} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

import TicketsTable from "./TicketsTable";
import { useLazyGetTicketsQuery } from "../../app/services/ticketsApi";

export default function TicketsPage() {
  const today = React.useMemo(() => dayjs(), []);
  const defaultStart = React.useMemo(() => today.subtract(7, "day"), [today]);

  // rango de fechas
  const [startDate, setStartDate] = React.useState<Dayjs | null>(defaultStart);
  const [endDate, setEndDate] = React.useState<Dayjs | null>(today);
  const [dateError, setDateError] = React.useState<string | null>(null);

  const [trigger, { data = [], isLoading, isFetching, error }] =
    useLazyGetTicketsQuery();

  React.useEffect(() => {
    const fechaInicio = defaultStart.format("YYYY-MM-DD");
    const fechaFin = today.format("YYYY-MM-DD");
    trigger({ fechaInicio, fechaFin });
  }, [trigger, defaultStart, today]);

  const isRangeInvalid =
    !startDate ||
    !endDate ||
    startDate.isAfter(endDate, "day") ||
    startDate.isAfter(today, "day") ||
    endDate.isAfter(today, "day");

  const handleBuscar = () => {
    if (!startDate || !endDate) {
      setDateError("Seleccione fecha de inicio y fin.");
      return;
    }

    if (startDate.isAfter(endDate, "day")) {
      setDateError("La fecha inicio no puede ser mayor que la fecha fin.");
      return;
    }

    setDateError(null);

    const fechaInicio = startDate.format("YYYY-MM-DD");
    const fechaFin = endDate.format("YYYY-MM-DD");

    trigger({ fechaInicio, fechaFin });
  };

  return (
    <Box p={2}>
      <Typography variant="h5" mb={2}>
        Tickets
      </Typography>

      {/* Filtros por fecha */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack direction="row" spacing={2} alignItems="center">
            <DatePicker
              label="Fecha inicio"
              value={startDate}
              onChange={(newValue) => {
                setStartDate(newValue);
                if (newValue && endDate && newValue.isAfter(endDate, "day")) {
                  setEndDate(newValue);
                }
              }}
              format="YYYY-MM-DD"
              maxDate={today} // no futuros
              slotProps={{ textField: { size: "small" } }}
            />

            <DatePicker
              label="Fecha fin"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              format="YYYY-MM-DD"
              minDate={startDate || undefined} // no antes de inicio
              maxDate={today} // no futuros
              slotProps={{ textField: { size: "small" } }}
            />

            <Button
              variant="contained"
              onClick={handleBuscar}
              disabled={isLoading || isFetching || isRangeInvalid}
            >
              BUSCAR
            </Button>
          </Stack>
        </LocalizationProvider>

        {dateError && (
          <Typography color="error" variant="body2" mt={1}>
            {dateError}
          </Typography>
        )}
      </Paper>

      {/* Loading / error / tabla */}
      {isLoading || isFetching ? (
        <LinearProgress />
      ) : error ? (
        <Typography color="error">Error al cargar</Typography>
      ) : (
        <TicketsTable data={data} />
      )}
    </Box>
  );
}
