import './App.css'
import TicketsPage from './features/tickets/TicketsPage';
import { Container, CssBaseline } from '@mui/material';

export default function App() {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <TicketsPage />
      </Container>
    </>
  );
}
