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
  Divider,
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

  const sidebarContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "primary.main",
        color: "primary.contrastText",
      }}
    >
      {/* Header del sidebar (botón colapsar) */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          px: 2,
          py: 1.5,
        }}
      >
        {!collapsed && (
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Xintra
          </Typography>
        )}

        <IconButton
          size="small"
          onClick={() => setCollapsed((prev) => !prev)}
          sx={{ color: "inherit" }}
        >
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />

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
      {/* HEADER GLOBAL (como el PHP) */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "white",
          color: "text.primary",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          {/* Botón menú en móvil */}
          <IconButton
            edge="start"
            onClick={handleToggleMobileDrawer}
            sx={{ display: { xs: "inline-flex", md: "none" }, mr: 1 }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo / nombre app */}
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, mr: { xs: 1, md: 2 } }}
          >
            Xintra
          </Typography>

          {/* Buscador central */}
          <Box sx={{ flexGrow: 1, maxWidth: 600 }}>
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

          {/* Iconos derecha */}
          <IconButton>
            <Badge color="error" variant="dot">
              <NotificationsNoneIcon />
            </Badge>
          </IconButton>

          <Avatar sx={{ width: 32, height: 32 }}>A</Avatar>
        </Toolbar>
      </AppBar>

      {/* CONTENIDO: SIDEBAR + MAIN */}
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          minHeight: 0, // importante para que el scroll sea correcto
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

        {/* SIDEBAR MÓVIL (drawer) */}
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
              // contenedor tipo “card grande” como en PHP
              maxWidth: "1200px",
              mx: "auto",
              bgcolor: "white",
              borderRadius: 2,
              boxShadow: "0 1px 3px rgba(15,23,42,0.1)",
              p: { xs: 2, md: 3 },
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
