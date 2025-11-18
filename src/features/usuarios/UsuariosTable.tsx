import * as React from "react";
import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import type { UsuarioRow } from "./types";

type Props = {
  data: UsuarioRow[];
};

function getSexoLabel(value: number) {
  if (value === 1) return "Masculino";
  if (value === 2) return "Femenino";
  return "N/D";
}

function getEstadoChip(idEstado: number) {
  if (idEstado === 1) {
    return <Chip label="ACTIVE" color="success" size="small" />;
  }
  if (idEstado === 0) {
    return <Chip label="SUSPENDED" color="error" size="small" />;
  }
  return <Chip label="UNKNOWN" size="small" />;
}

export default function UsuariosTable({ data }: Props) {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Nombre completo</TableCell>
            <TableCell>Usuario</TableCell>
            <TableCell>Documento</TableCell>
            <TableCell>Sexo</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Fecha registro</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.IDPERSONAL}>
              <TableCell>{row.IDPERSONAL}</TableCell>
              <TableCell>{row.nombre_completo}</TableCell>
              <TableCell>{row.USUARIO}</TableCell>
              <TableCell>{row.DOC}</TableCell>
              <TableCell>{getSexoLabel(row.SEXO)}</TableCell>
              <TableCell>{getEstadoChip(row.IDESTADO)}</TableCell>
              <TableCell>{row.fecha_registro}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
