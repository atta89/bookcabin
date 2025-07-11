import {
  ConfirmationNumberRounded,
  GridViewRounded,
  Menu,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState, type PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => {
  const drawerWidth = 240;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const menu = [
    {
      name: "Dashboard",
      icon: <GridViewRounded />,
      link: "/dashboard",
    },
    {
      name: "Voucher",
      icon: <ConfirmationNumberRounded />,
      link: "/",
    },
  ];

  const drawer = (
    <Box py={3}>
      <Toolbar sx={{ gap: 2 }}>
        <img width={36} height={36} alt="vite" src="/vite.svg" />
        <Box flexGrow={1}>
          <Typography variant="h6">BookCabin</Typography>
        </Box>
      </Toolbar>
      <Stack p={2} gap={1} flexDirection="column">
        {menu.map((item) => (
          <Button
            key={item.name}
            size="large"
            color="info"
            href={item.link}
            startIcon={item.icon}
            variant={
              window.location.pathname === item.link ? "contained" : "outlined"
            }
            sx={{
              textTransform: "none",
              borderColor: "transparent",
              justifyContent: "flex-start",
            }}
          >
            {item.name}
          </Button>
        ))}
      </Stack>
    </Box>
  );

  return (
    <>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          slotProps={{
            root: {
              keepMounted: true, // Better open performance on mobile.
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        p={3}
        flexGrow={1}
        component="main"
        width={{ sm: `calc(100% - ${drawerWidth}px)` }}
        ml={{ sm: `${drawerWidth}px` }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: "none" } }}
          >
            <Menu />
          </IconButton>
          <Box flexGrow={1}>
            <Typography variant="h6">Welcome, Chandra</Typography>
            <Typography variant="body2" color="textDisabled">
              {new Date().toDateString()}
            </Typography>
          </Box>
        </Toolbar>
        {children}
      </Box>
    </>
  );
};

export default Layout;
