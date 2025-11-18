import * as React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TableSortLabel,
  TablePagination,
  Box,
  IconButton,
} from "@mui/material";

import MoneyIcon from "@mui/icons-material/Money";
import EditIcon from "@mui/icons-material/Edit";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import type { ColumnDef, SortingState } from "@tanstack/react-table";

import DOMPurify from "dompurify";
import CryptoJS from "crypto-js";

export type RowAny = Record<string, any>;

const API_BASE = import.meta.env.VITE_API_BASE as string;

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
    default:
      return null;
  }
};

const md5 = (value: string | number) =>
  CryptoJS.MD5(String(value)).toString();

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
            <span dangerouslySetInnerHTML={asHtml(info.getValue())} />
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
    {
      id: "opciones",
      header: "Opciones",
      enableSorting: false,
      cell: (info) => {
        const row = info.row.original as RowAny;
        const id = row.id;
        const hash = md5(id);
        const pdfUrl = `${API_BASE}/controller/venta/tkt_pdf.php?hash=${hash}`;

        return (
          <Box display="flex" justifyContent="center" gap={1}>
            {/* Editar (por ahora solo botón) */}
            <IconButton
              size="small"
              color="primary"
              // onClick={() => console.log("Editar", id)}
            >
              <EditIcon fontSize="small" />
            </IconButton>

            {/* PDF */}
            <IconButton
              size="small"
              color="error"
              component="a"
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <PictureAsPdfIcon fontSize="small" />
            </IconButton>
          </Box>
        );
      },
    },
  ], []);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination: { pageIndex, pageSize },
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
  });

  const totalRows = data.length;

  return (
    <Paper>
      <TableContainer sx={{ maxHeight: "75vh", minHeight: 300 }}>
        <Table stickyHeader size="small">
          <TableHead>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => {
                  const isSorted = header.column.getIsSorted();
                  const canSort = header.column.getCanSort();
                  return (
                    <TableCell key={header.id} sx={{ fontWeight: 700 }}>
                      {header.isPlaceholder ? null : canSort ? (
                        <TableSortLabel
                          active={!!isSorted}
                          direction={
                            isSorted === "asc" || isSorted === "desc"
                              ? isSorted
                              : "asc"
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </TableSortLabel>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>

          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  align="center"
                >
                  <Typography variant="body2" color="text.secondary">
                    No hay resultados para el rango seleccionado.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} hover>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalRows}
        page={pageIndex}
        onPageChange={(_, newPage) => {
          setPageIndex(newPage);
          table.setPageIndex(newPage);
        }}
        rowsPerPage={pageSize}
        onRowsPerPageChange={(e) => {
          const newSize = parseInt(e.target.value, 10);
          setPageSize(newSize);
          setPageIndex(0);
          table.setPageSize(newSize);
          table.setPageIndex(0);
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Paper>
  );
}
