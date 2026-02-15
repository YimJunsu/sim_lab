"use client";

import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { keyframes } from "@mui/material/styles";
import { ArrowRight } from "lucide-react";
import { TYPE_META, type IdealTypeScores } from "@/lib/ideal-type-questions";

/**
 * 이상형 성향 테스트 – 인트로 페이지
 * 디자인: 클린/미니멀 다크, 카드 그리드, mymood(보라 몽환풍)와 완전 차별화
 */

const TYPE_KEYS: (keyof IdealTypeScores)[] = ["leader", "romantic", "stable", "humorous", "intellectual"];

// ─── 애니메이션 ───
const fadeUp = keyframes`
  0%   { opacity: 0; transform: translateY(24px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const borderGlow = keyframes`
  0%, 100% { border-color: rgba(232,67,147,0.2); }
  50%      { border-color: rgba(232,67,147,0.5); }
`;

const tagSlide = keyframes`
  0%   { opacity: 0; transform: translateX(-8px); }
  100% { opacity: 1; transform: translateX(0); }
`;

export default function IdealTypeGuidePage() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#111",
        pt: { xs: 14, sm: 12 },
        pb: { xs: 6, sm: 10 },
        position: "relative",
      }}
    >
      <Container maxWidth="sm">
        {/* ─── 히어로 ─── */}
        <Box sx={{ animation: `${fadeUp} 0.5s ease-out both`, mb: { xs: 5, sm: 6 } }}>
          {/* 태그 */}
          <Box
            sx={{
              display: "inline-block",
              bgcolor: "rgba(232,67,147,0.08)",
              border: "1px solid rgba(232,67,147,0.2)",
              borderRadius: 1,
              px: 1.5,
              py: 0.4,
              mb: 2.5,
            }}
          >
            <Typography sx={{ fontSize: "0.7rem", color: "#E84393", fontWeight: 600, letterSpacing: "0.12em" }}>
              IDEAL TYPE TEST
            </Typography>
          </Box>

          <Typography
            variant="h3"
            sx={{
              color: "#fff",
              fontWeight: 800,
              fontSize: { xs: "1.6rem", sm: "2.2rem" },
              lineHeight: 1.4,
              mb: 1.5,
            }}
          >
            내가 끌리는 사람은{"\n"}
            <Box component="span" sx={{ color: "#E84393" }}>
              어떤 타입
            </Box>
            일까?
          </Typography>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.4)",
              fontSize: { xs: "0.88rem", sm: "0.95rem" },
              lineHeight: 1.7,
            }}
          >
            20개 질문으로 알아보는 나의 이상형 성향
          </Typography>
        </Box>

        {/* ─── 성향 카드 (세로 리스트) ─── */}
        <Box sx={{ animation: `${fadeUp} 0.5s ease-out 0.1s both`, mb: { xs: 4, sm: 5 } }}>
          <Stack spacing={1}>
            {TYPE_KEYS.map((key, i) => {
              const meta = TYPE_META[key];
              return (
                <Box
                  key={key}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    px: 2,
                    py: 1.5,
                    borderRadius: 2,
                    bgcolor: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    animation: `${tagSlide} 0.35s ease-out ${0.15 + i * 0.06}s both`,
                    transition: "border-color 0.2s, background-color 0.2s",
                    "&:hover": {
                      borderColor: `${meta.color}33`,
                      bgcolor: `${meta.color}08`,
                    },
                  }}
                >
                  {/* 컬러 바 인디케이터 */}
                  <Box
                    sx={{
                      width: 3,
                      height: 28,
                      borderRadius: 2,
                      bgcolor: meta.color,
                      flexShrink: 0,
                      opacity: 0.7,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={0.8} sx={{ alignItems: "center" }}>
                      <Typography sx={{ fontSize: "0.9rem" }}>{meta.emoji}</Typography>
                      <Typography sx={{ color: meta.color, fontWeight: 700, fontSize: "0.82rem" }}>
                        {meta.label}
                      </Typography>
                    </Stack>
                    <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: "0.72rem", mt: 0.2 }}>
                      {meta.description}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </Box>

        {/* ─── 안내 정보 ─── */}
        <Box sx={{ animation: `${fadeUp} 0.5s ease-out 0.2s both`, mb: { xs: 4, sm: 5 } }}>
          <Stack
            direction="row"
            sx={{ gap: 2, justifyContent: "center", flexWrap: "wrap" }}
          >
            {[
              { label: "20문항", sub: "질문" },
              { label: "3~5분", sub: "소요" },
              { label: "5가지", sub: "성향" },
            ].map((info) => (
              <Box key={info.label} sx={{ textAlign: "center" }}>
                <Typography sx={{ color: "#fff", fontSize: "1.1rem", fontWeight: 700 }}>
                  {info.label}
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.25)", fontSize: "0.68rem", mt: 0.2 }}>
                  {info.sub}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        {/* ─── CTA 버튼 ─── */}
        <Box sx={{ animation: `${fadeUp} 0.5s ease-out 0.3s both`, textAlign: "center" }}>
          <Button
            onClick={() => router.push("/ideal-type/test")}
            variant="contained"
            size="large"
            endIcon={<ArrowRight size={20} />}
            sx={{
              py: 1.8,
              px: 5,
              borderRadius: 2,
              fontSize: "1rem",
              fontWeight: 700,
              bgcolor: "#E84393",
              color: "#fff",
              textTransform: "none",
              border: "1px solid rgba(232,67,147,0.3)",
              animation: `${borderGlow} 3s ease-in-out infinite`,
              boxShadow: "0 0 30px rgba(232,67,147,0.15)",
              "&:hover": {
                bgcolor: "#d63784",
                boxShadow: "0 0 40px rgba(232,67,147,0.25)",
              },
            }}
          >
            테스트 시작하기
          </Button>

          <Typography
            sx={{ color: "rgba(255,255,255,0.15)", fontSize: "0.68rem", mt: 3, textAlign: "center" }}
          >
            본 테스트는 재미를 위한 것이며, 전문적인 심리 진단이 아닙니다.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
