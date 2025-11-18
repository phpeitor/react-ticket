// src/layout/AppLayout.tsx
import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  InputAdornment,
  Avatar,
  Badge,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { Outlet, useLocation, useNavigate } from "react-router-dom";

const SIDEBAR_WIDTH = 240;
const SIDEBAR_COLLAPSED = 72;

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH;

  const handleToggleMobileDrawer = () => {
    setMobileOpen((prev) => !prev);
  };

  const menuItems = [
    { label: "Tickets", icon: <ReceiptLongIcon />, path: "/tickets" },
    { label: "Clientes", icon: <PeopleIcon />, path: "/clientes" },
    { label: "Usuarios", icon: <PersonIcon />, path: "/usuarios" },
    { label: "Categoría", icon: <CategoryIcon />, path: "/categorias" },
    { label: "Items", icon: <Inventory2Icon />, path: "/items" },
  ];

  // ——— SIDEBAR SOLO MENÚ (sin título Xintra) ———
  const sidebarContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "primary.main",
        color: "primary.contrastText",
        pt: 1, // un pequeño padding arriba
      }}
    >
      {/* Botón colapsar solo en desktop, pegado arriba */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          justifyContent: "center",
          mb: 1,
        }}
      >
        <IconButton
          size="small"
          onClick={() => setCollapsed((prev) => !prev)}
          sx={{
            color: "inherit",
            border: "1px solid rgba(255,255,255,0.4)",
          }}
        >
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <List>
          {menuItems.map((item) => {
            const selected = location.pathname.startsWith(item.path);
            return (
              <ListItemButton
                key={item.path}
                selected={selected}
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                sx={{
                  "&.Mui-selected": {
                    bgcolor: "rgba(255,255,255,0.15)",
                  },
                  "&.Mui-selected:hover": {
                    bgcolor: "rgba(255,255,255,0.25)",
                  },
                  px: collapsed ? 2 : 3,
                }}
              >
                <ListItemIcon
                  sx={{
                    color: "inherit",
                    minWidth: collapsed ? 0 : 40,
                    mr: collapsed ? 0 : 1,
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{ display: collapsed ? "none" : "block" }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f3f4f6",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ——— HEADER COMO EL PHP ——— */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "white",
          color: "text.primary",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <Toolbar sx={{ px: 2, gap: 2 }}>
          {/* COLUMNA IZQUIERDA = ANCHO DEL SIDEBAR EN DESKTOP */}
          <Box
            sx={{
              width: { xs: "auto", md: sidebarWidth },
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            {/* Menú hamburguesa solo en móvil */}
            <IconButton
              edge="start"
              onClick={handleToggleMobileDrawer}
              sx={{ display: { xs: "inline-flex", md: "none" }, mr: 1 }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo / nombre app (siempre visible) */}
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              React
            </Typography>
          </Box>

          {/* BUSCADOR CENTRAL */}
          <Box
            sx={{
              flexGrow: 1,
              maxWidth: 600,
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Search anything here ..."
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* ICONOS DERECHA */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              ml: 1,
            }}
          >
            <IconButton>
              <Badge color="error" variant="dot">
                <NotificationsNoneIcon />
              </Badge>
            </IconButton>
            <Avatar sx={{ width: 32, height: 32 }}>A</Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ——— CONTENIDO: SIDEBAR + MAIN ——— */}
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          minHeight: 0,
        }}
      >
        {/* SIDEBAR DESKTOP */}
        <Box
          component="aside"
          sx={{
            width: { xs: 0, md: sidebarWidth },
            flexShrink: 0,
            display: { xs: "none", md: "flex" },
          }}
        >
          {sidebarContent}
        </Box>

        {/* SIDEBAR MÓVIL */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleToggleMobileDrawer}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: SIDEBAR_WIDTH,
              boxSizing: "border-box",
            },
          }}
        >
          {sidebarContent}
        </Drawer>

        {/* MAIN */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, md: 3 },
            overflow: "auto",
          }}
        >
          <Box
            sx={{
              maxWidth: "1200px",
              mx: "auto",
              bgcolor: "white",
              borderRadius: 2,
              boxShadow: "0 1px 3px rgba(15,23,42,0.1)",
              p: { xs: 2, md: 3 },
            }}
          >
            {/* Aquí cada página (Tickets, Usuarios, etc.) dibuja su propio título y cabecera */}
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
