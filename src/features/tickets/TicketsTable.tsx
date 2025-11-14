import * as React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";

import MoneyIcon from "@mui/icons-material/Money";
import { Box } from "@mui/material";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";

import DOMPurify from "dompurify";

export type RowAny = Record<string, any>;

// Sanitiza HTML
const asHtml = (value: unknown) => {
  const clean = DOMPurify.sanitize(String(value ?? ""), {
    USE_PROFILES: { html: true },
  });
  return { __html: clean };
};

const stripHtml = (value: unknown) =>
  String(value ?? "").replace(/<[^>]*>/g, "").trim();


const getRemixClass = (value: unknown): string | undefined => {
  const match = String(value ?? "").match(/ri-[\w-]+/);
  return match?.[0];
};

const remixToMuiIcon = (cls?: string) => {
  switch (cls) {
    case "ri-currency-line":
      return <MoneyIcon fontSize="small" />;
    // case "ri-shopping-cart-line":
    //   return <ShoppingCartIcon fontSize="small" />;
    default:
      return null;
  }
};

export default function TicketsTable({ data }: { data: RowAny[] }) {
  const columns = React.useMemo<ColumnDef<RowAny>[]>(() => [
    { accessorKey: "id", header: "Id" },
    { accessorKey: "fecha_pedido", header: "Fecha" },
    { accessorKey: "usuario", header: "Usuario" },
    { accessorKey: "cliente", header: "Cliente" },
    {
      accessorKey: "productos",
      header: "Items",
      cell: (info) => (
        <span dangerouslySetInnerHTML={asHtml(info.getValue())} />
      ),
    },
    {
      accessorKey: "precioxcant",
      header: "Subtotal",
      cell: (info) => {
        const row = info.row.original as RowAny;
        const cantidad = row.cantidad; 

        return (
          <div>
            {/* items (html) */}
            <span dangerouslySetInnerHTML={asHtml(info.getValue())} />
            {/* cantidad debajo */}
            {cantidad != null && (
              <Typography
                variant="caption"
                sx={{ display: "block", mt: 0.5, fontWeight: 600 }}
              >
                {cantidad} items
              </Typography>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: (info) => {
        const raw = info.getValue();
        const text = stripHtml(raw);
        const remixClass = getRemixClass(raw);
        const Icon = remixToMuiIcon(remixClass);

        return (
        <Box display="flex" alignItems="center" gap={0.5}>
            <Typography fontWeight={700}>{text}</Typography>
            {Icon}
        </Box>
        );
      },
    },
  ], []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Paper>

      <TableContainer sx={{ maxHeight: "75vh" }}>
        <Table stickyHeader size="small">
          <TableHead>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableCell key={header.id} sx={{ fontWeight: 700 }}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>

          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} hover>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
