"use client";

import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { FlaskConical } from "lucide-react";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: theme.palette.divider,
  backgroundColor: alpha(theme.palette.background.default, 0.4),
  boxShadow: theme.shadows[1],
  padding: "8px 12px",
}));

const navItems = [
  { label: "테스트", href: "#contents" },
  { label: "소개", href: "#about" },
];

export default function Header() {
  const [open, setOpen] = React.useState(false);

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: "28px",
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          {/* Logo - left */}
          <Box
            component="a"
            href="/"
            sx={{
              fontWeight: 700,
              fontSize: "0.9rem",
              color: "#1e3a5f",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              letterSpacing: "0.05em",
              flexShrink: 0,
            }}
          >
            <FlaskConical size={18} color="#1e3a5f" />
            SIMLAB
          </Box>

          {/* Desktop nav - center */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              gap: 0.5,
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="text"
                size="small"
                sx={{ color: "#1e3a5f" }}
                href={item.href}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Right spacer for desktop balance */}
          <Box sx={{ display: { xs: "none", md: "flex" }, width: 80 }} />

          {/* Mobile hamburger */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton aria-label="메뉴" onClick={() => setOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor="top" open={open} onClose={() => setOpen(false)}>
              <Box sx={{ p: 2, bgcolor: "background.default" }}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <IconButton onClick={() => setOpen(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                {navItems.map((item) => (
                  <MenuItem
                    key={item.href}
                    component="a"
                    href={item.href}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
