import { Box, LinearProgress, Typography } from '@mui/material';
import { useGetTicketsQuery } from '../../app/services/ticketsApi';
import TicketsTable from './TicketsTable';

export default function TicketsPage() {
  const { data = [], isLoading, isFetching, error } = useGetTicketsQuery();

  return (
    <Box p={2}>
      <Typography variant="h5" mb={2}>Tickets</Typography>

      {(isLoading || isFetching) && <LinearProgress />}
      {error && <Typography color="error">Error al cargar</Typography>}

      <TicketsTable data={data} />
    </Box>
  );
}
