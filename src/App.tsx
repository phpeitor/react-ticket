// src/App.tsx
import "./App.css";
import { CssBaseline } from "@mui/material";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AppLayout from "./layout/AppLayout";
import TicketsPage from "./features/tickets/TicketsPage";
import UsuariosPage from "./features/usuarios/UsuariosPage";

// por ahora placeholders; luego los cambiamos por páginas reales
function ClientesPage() {
  return <h2>Clientes (pendiente tabla)</h2>;
}

function CategoriasPage() {
  return <h2>Categorías (pendiente)</h2>;
}

function ItemsPage() {
  return <h2>Items (pendiente)</h2>;
}

export default function App() {
  return (
    <BrowserRouter>
      <CssBaseline />

      <Routes>
        {/* Todas estas rutas comparten el mismo layout */}
        <Route element={<AppLayout />}>
          {/* redirigir / a /tickets */}
          <Route path="/" element={<Navigate to="/tickets" replace />} />

          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/usuarios" element={<UsuariosPage />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/items" element={<ItemsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
