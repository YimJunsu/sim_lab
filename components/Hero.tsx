"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { keyframes } from "@mui/material/styles";

const popIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
    filter: blur(4px);
  }
  60% {
    opacity: 1;
    transform: translateY(-6px) scale(1.02);
    filter: blur(0px);
  }
  80% {
    transform: translateY(2px) scale(0.99);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0px);
  }
`;

const fadeUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

export default function Hero() {
  return (
    <Box
      id="hero"
      sx={{
        width: "100%",
        backgroundRepeat: "no-repeat",
        backgroundImage:
          "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(230, 40%, 92%), transparent)",
      }}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Stack
          spacing={2}
          useFlexGap
          sx={{ alignItems: "center", width: { xs: "100%", sm: "70%" } }}
        >
          <Typography
            variant="h1"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              fontSize: "clamp(2.5rem, 8vw, 3.5rem)",
              fontWeight: 700,
              textAlign: "center",
              animation: `${popIn} 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both`,
            }}
          >
            나를 알아가는&nbsp;
            <Typography
              component="span"
              variant="h1"
              sx={{
                fontSize: "inherit",
                fontWeight: "inherit",
                color: "primary.main",
                animation: `${popIn} 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both`,
              }}
            >
              심리 실험실
            </Typography>
          </Typography>
          <Typography
            sx={{
              textAlign: "center",
              color: "text.secondary",
              width: { sm: "100%", md: "80%" },
              fontSize: { xs: "1rem", sm: "1.125rem" },
              animation: `${fadeUp} 0.6s ease-out 0.4s both`,
            }}
          >
            메뉴 추천부터 감정 체크, 이상형 테스트, 운세, 동물상까지.
            <br />
            가볍고 재미있는 테스트로 나를 발견해보세요.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
