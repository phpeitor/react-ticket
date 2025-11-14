import { Box, LinearProgress, Typography } from '@mui/material';
import { useGetTicketsQuery } from '../../app/services/ticketsApi';
import TicketsTable from './TicketsTable';

export default function TicketsPage() {
  const { data = [], isLoading, isFetching, error } = useGetTicketsQuery();

  if (isLoading || isFetching) {
    return (
      <Box p={2}>
        <Typography variant="h5" mb={2}>Tickets</Typography>
        <LinearProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Typography variant="h5" mb={2}>Tickets</Typography>
        <Typography color="error">Error al cargar</Typography>
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Typography variant="h5" mb={2}>Tickets</Typography>
      <TicketsTable data={data} />
    </Box>
  );
}
