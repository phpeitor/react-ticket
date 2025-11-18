import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import type { UsuarioRow } from "./types";
import UsuariosTable from "./UsuariosTable";

export default function UsuariosPage() {
  const [rows, setRows] = React.useState<UsuarioRow[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/usuarios");
        const data = await res.json();
        setRows(data);
      } catch (err) {
        console.error("Error cargando usuarios", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        Usuarios
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <UsuariosTable data={rows} />
      )}
    </Box>
  );
}
