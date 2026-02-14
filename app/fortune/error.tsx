"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

const T = {
  bgDark: "#0c0e1a",
  gold: "#c9a96e",
  goldDim: "rgba(201, 169, 110, 0.35)",
  cream: "#f0e6d3",
  creamDim: "rgba(240, 230, 211, 0.55)",
  crimson: "#a03030",
  border: "rgba(201, 169, 110, 0.18)",
} as const;

export default function FortuneError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(175deg, ${T.bgDark} 0%, #10121f 40%, #161028 70%, #0e0c18 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="xs">
        <Stack spacing={2.5} sx={{ alignItems: "center", textAlign: "center" }}>
          <Typography
            sx={{ fontFamily: "serif", fontSize: "2.5rem", color: T.gold, lineHeight: 1 }}
          >
            凶
          </Typography>
          <Typography sx={{ color: T.cream, fontWeight: 700, fontSize: "1.1rem" }}>
            오류가 발생했습니다
          </Typography>
          <Typography sx={{ color: T.creamDim, fontSize: "0.84rem", lineHeight: 1.6 }}>
            페이지를 불러오는 중 문제가 생겼습니다.
            <br />
            다시 시도하거나 처음부터 시작해주세요.
          </Typography>
          <Stack direction="row" spacing={1.5} sx={{ mt: 1 }}>
            <Button
              variant="outlined"
              onClick={reset}
              sx={{
                color: T.gold,
                borderColor: T.border,
                borderRadius: 2,
                fontWeight: 600,
                fontSize: "0.85rem",
                "&:hover": { borderColor: T.gold },
              }}
            >
              다시 시도
            </Button>
            <Button
              variant="contained"
              href="/fortune/input"
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                fontSize: "0.85rem",
                background: `linear-gradient(135deg, ${T.crimson} 0%, #c24040 100%)`,
                color: T.cream,
                "&:hover": {
                  background: `linear-gradient(135deg, #b03535 0%, #d04545 100%)`,
                },
              }}
            >
              처음부터 시작
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}