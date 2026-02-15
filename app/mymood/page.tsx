"use client";

import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { keyframes } from "@mui/material/styles";
import Image from "next/image";
import { Play, Sparkles } from "lucide-react";

/**
 * 감정 점수화 – 가이드 / 인트로 페이지
 * 인사이드아웃 감성: 감정 구슬, 따뜻한 그라데이션, 라운드 UI
 */

// ─── 감정 캐릭터 정보 ───
const EMOTIONS = [
  { label: "기쁨", emoji: "😊", color: "#FFD93D", shadow: "rgba(255,217,61,0.5)" },
  { label: "피로", emoji: "😴", color: "#7B8CDE", shadow: "rgba(123,140,222,0.5)" },
  { label: "스트레스", emoji: "😤", color: "#FF6B6B", shadow: "rgba(255,107,107,0.5)" },
  { label: "평온", emoji: "😌", color: "#69D2A0", shadow: "rgba(105,210,160,0.5)" },
  { label: "설렘", emoji: "💫", color: "#E891CF", shadow: "rgba(232,145,207,0.5)" },
] as const;

// ─── 애니메이션 ───
const floatUp = keyframes`
  0%   { opacity: 0; transform: translateY(40px) scale(0.9); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
`;

const orbFloat = keyframes`
  0%, 100% { transform: translateY(0) scale(1); }
  50%      { transform: translateY(-12px) scale(1.05); }
`;

const bubbleDrift = keyframes`
  0%   { transform: translate(0, 0) scale(1); }
  25%  { transform: translate(30px, -20px) scale(1.08); }
  50%  { transform: translate(-10px, -40px) scale(0.95); }
  75%  { transform: translate(-30px, -15px) scale(1.05); }
  100% { transform: translate(0, 0) scale(1); }
`;

const orbGlow = keyframes`
  0%, 100% { opacity: 0.85; transform: scale(1); }
  50%      { opacity: 1; transform: scale(1.06); }
`;

const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const pulseBtn = keyframes`
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.03); }
`;

export default function MymoodGuidePage() {
  const router = useRouter();

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        background: "linear-gradient(160deg, #1a103d 0%, #2d1b69 30%, #1e1250 60%, #0f0a2e 100%)",
        pt: { xs: 14, sm: 12 },
        pb: { xs: 6, sm: 10 },
        overflow: "hidden",
      }}
    >
      {/* ─── 배경 물방울 (스크린세이버) ─── */}
      {[
        { top: "5%", left: "6%", size: 55, color: "rgba(255,217,61,0.10)", dur: 8, delay: 0 },
        { top: "12%", right: "8%", size: 75, color: "rgba(255,107,107,0.08)", dur: 10, delay: 1 },
        { top: "25%", left: "80%", size: 40, color: "rgba(105,210,160,0.10)", dur: 7, delay: 0.5 },
        { top: "35%", left: "3%", size: 65, color: "rgba(123,140,222,0.09)", dur: 9, delay: 2 },
        { top: "50%", right: "5%", size: 50, color: "rgba(232,145,207,0.10)", dur: 11, delay: 0.8 },
        { top: "18%", left: "45%", size: 35, color: "rgba(255,217,61,0.07)", dur: 12, delay: 3 },
        { top: "65%", left: "12%", size: 45, color: "rgba(255,107,107,0.06)", dur: 9.5, delay: 1.5 },
        { top: "72%", right: "15%", size: 60, color: "rgba(105,210,160,0.07)", dur: 10.5, delay: 2.5 },
        { top: "85%", left: "30%", size: 38, color: "rgba(123,140,222,0.08)", dur: 8.5, delay: 0.3 },
        { top: "90%", right: "25%", size: 48, color: "rgba(232,145,207,0.07)", dur: 11.5, delay: 1.8 },
      ].map((orb, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            top: orb.top,
            left: orb.left,
            right: orb.right,
            width: orb.size,
            height: orb.size,
            borderRadius: "50%",
            bgcolor: orb.color,
            animation: `${bubbleDrift} ${orb.dur}s ease-in-out ${orb.delay}s infinite`,
            pointerEvents: "none",
          }}
        />
      ))}

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        {/* ─── 타이틀 ─── */}
        <Box sx={{ animation: `${floatUp} 0.6s ease-out both`, textAlign: "center" }}>
          <Typography
            sx={{
              fontSize: { xs: "0.7rem", sm: "0.8rem" },
              color: "rgba(255,217,61,0.6)",
              letterSpacing: "0.25em",
              fontWeight: 600,
              mb: 1.5,
            }}
          >
            MOOD CHECK
          </Typography>
          <Typography
            variant="h3"
            sx={{
              color: "#fff",
              fontWeight: 800,
              fontSize: { xs: "2rem", sm: "2.6rem" },
              lineHeight: 1.3,
              mb: 1,
            }}
          >
            오늘,{" "}
            <Box
              component="span"
              sx={{
                background: "linear-gradient(90deg, #FFD93D, #FF6B6B, #E891CF, #69D2A0, #7B8CDE)",
                backgroundSize: "200% auto",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: `${shimmer} 4s linear infinite`,
              }}
            >
              나의 감정
            </Box>
            은?
          </Typography>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.55)",
              fontSize: { xs: "0.9rem", sm: "1rem" },
              lineHeight: 1.7,
              mt: 2,
            }}
          >
            내 안의 다섯 가지 감정을 점수로 만나보세요
          </Typography>

          {/* ─── 감정 캐릭터 대표 이미지 ─── */}
          <Box
            sx={{
              mt: { xs: 3, sm: 4 },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: { xs: 240, sm: 300 },
                height: { xs: 240, sm: 300 },
                borderRadius: 5,
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              }}
            >
              <Image
                src="/mood-character/allmood.png"
                alt="감정 캐릭터들"
                fill
                sizes="(max-width: 600px) 240px, 300px"
                style={{ objectFit: "cover" }}
                priority
              />
            </Box>
            <Typography
              sx={{
                color: "rgba(255,255,255,0.18)",
                fontSize: "0.6rem",
                mt: 1,
              }}
            >
              Image generated by Gemini (Nano-Banana)
            </Typography>
          </Box>
        </Box>

        {/* ─── 감정 캐릭터 구슬 ─── */}
        <Box
          sx={{
            animation: `${floatUp} 0.6s ease-out 0.2s both`,
            mt: { xs: 5, sm: 6 },
          }}
        >
          <Stack
            direction="row"
            sx={{
              justifyContent: "center",
              gap: { xs: 1.5, sm: 2.5 },
              flexWrap: "wrap",
            }}
          >
            {EMOTIONS.map((em, i) => (
              <Stack
                key={em.label}
                spacing={1}
                sx={{
                  alignItems: "center",
                  animation: `${orbFloat} ${3 + i * 0.4}s ease-in-out ${i * 0.2}s infinite`,
                }}
              >
                <Box
                  sx={{
                    width: { xs: 52, sm: 64 },
                    height: { xs: 52, sm: 64 },
                    borderRadius: "50%",
                    background: `radial-gradient(circle at 35% 35%, ${em.color}dd, ${em.color}88)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: { xs: "1.5rem", sm: "1.8rem" },
                    boxShadow: `0 0 20px ${em.shadow}`,
                    animation: `${orbGlow} ${3 + i * 0.5}s ease-in-out ${i * 0.3}s infinite`,
                    cursor: "default",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "scale(1.15) !important" },
                  }}
                >
                  {em.emoji}
                </Box>
                <Typography
                  sx={{
                    color: em.color,
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                  }}
                >
                  {em.label}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>

        {/* ─── 안내 카드 ─── */}
        <Box
          sx={{
            animation: `${floatUp} 0.6s ease-out 0.4s both`,
            mt: { xs: 5, sm: 6 },
          }}
        >
          <Box
            sx={{
              bgcolor: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(16px)",
              borderRadius: 4,
              border: "1px solid rgba(255,255,255,0.08)",
              p: { xs: 3, sm: 4 },
            }}
          >
            <Stack spacing={2.5}>
              {[
                { icon: "🎯", title: "10개의 질문", desc: "40개 중 랜덤 10문항에 답해요" },
                { icon: "🧠", title: "5가지 감정 분석", desc: "기쁨 · 피로 · 스트레스 · 평온 · 설렘" },
                { icon: "📊", title: "나만의 감정 리포트", desc: "도넛 차트로 한눈에 확인해요" },
                { icon: "📅", title: "어제와 비교", desc: "매일 체크하면 변화를 추적할 수 있어요" },
              ].map((item, i) => (
                <Stack key={i} direction="row" spacing={2} sx={{ alignItems: "center" }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 3,
                      bgcolor: "rgba(255,255,255,0.06)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.3rem",
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ color: "#fff", fontWeight: 600, fontSize: "0.9rem" }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.8rem" }}>
                      {item.desc}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Box>

        {/* ─── 시작하기 버튼 ─── */}
        <Box
          sx={{
            animation: `${floatUp} 0.6s ease-out 0.6s both`,
            mt: { xs: 4, sm: 5 },
            textAlign: "center",
          }}
        >
          <Button
            onClick={() => router.push("/mymood/test-mymood")}
            variant="contained"
            size="large"
            startIcon={<Play size={20} />}
            sx={{
              py: 1.8,
              px: 5,
              borderRadius: 50,
              fontSize: "1.05rem",
              fontWeight: 700,
              background: "linear-gradient(135deg, #FFD93D 0%, #FF6B6B 50%, #E891CF 100%)",
              color: "#1a103d",
              textTransform: "none",
              boxShadow: "0 4px 24px rgba(255,107,107,0.3)",
              animation: `${pulseBtn} 2.5s ease-in-out infinite`,
              "&:hover": {
                background: "linear-gradient(135deg, #FFE066 0%, #FF8585 50%, #F0A8DD 100%)",
                boxShadow: "0 6px 32px rgba(255,107,107,0.45)",
              },
            }}
          >
            감정 체크 시작하기
          </Button>

          <Stack spacing={0.5} sx={{ mt: 3 }}>
            <Typography
              sx={{ color: "rgba(255,255,255,0.25)", fontSize: "0.72rem", textAlign: "center" }}
            >
              약 1~2분 소요 · 총 10문항
            </Typography>
            <Typography
              sx={{ color: "rgba(255,255,255,0.18)", fontSize: "0.68rem", textAlign: "center" }}
            >
              본 테스트는 재미를 위한 것이며, 전문적인 심리 진단이 아닙니다.
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}