"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

export default function Error() {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        bgcolor: "background.default",
        px: 3,
      }}
    >
      <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
        문제가 발생했어요. 잠시 후 다시 시도해주세요.
      </Typography>
      <Button variant="contained" href="/" startIcon={<HomeRoundedIcon />}>
        홈으로 돌아가기
      </Button>
    </Box>
  );
}
