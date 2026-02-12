"use client";

import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3d5a99",
      light: "#5a7ab5",
      dark: "#2c4373",
    },
    text: {
      primary: "#1a1a2e",
      secondary: "#6b7280",
    },
    background: {
      default: "#fafafa",
    },
  },
  typography: {
    fontFamily: '"Noto Sans KR", system-ui, sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
  },
});

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
