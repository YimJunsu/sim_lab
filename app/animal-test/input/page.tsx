"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { keyframes } from "@mui/material/styles";
import { ArrowRight } from "lucide-react";
import { ANIMAL_TYPE_META, type AnimalScores } from "@/lib/animal-type-questions";

/**
 * 동물상 테스트 – 인트로 + 성별 선택
 * 디자인: 이머시브 포레스트, 중앙 오빗 히어로, 풀스크린 성별 카드, 반딧불 파티클
 */

const TYPE_KEYS: (keyof AnimalScores)[] = ["warmth", "energy", "wit", "calm", "charm"];

// ─── 애니메이션 ───
const fadeUp = keyframes`
  0%   { opacity: 0; transform: translateY(28px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const orbit = keyframes`
  0%   { transform: rotate(0deg) translateX(72px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(72px) rotate(-360deg); }
`;

const firefly = keyframes`
  0%, 100% { opacity: 0; }
  20%      { opacity: 0.8; }
  80%      { opacity: 0.6; }
`;

const fireflyDrift = keyframes`
  0%   { transform: translate(0, 0); }
  33%  { transform: translate(12px, -18px); }
  66%  { transform: translate(-8px, -6px); }
  100% { transform: translate(0, 0); }
`;

const pulseRing = keyframes`
  0%   { transform: scale(1); opacity: 0.15; }
  50%  { transform: scale(1.08); opacity: 0.25; }
  100% { transform: scale(1); opacity: 0.15; }
`;

const chipEnter = keyframes`
  0%   { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
`;

const ORBIT_EMOJIS = ["🐶", "🦊", "🐯", "🐼", "🐧", "🦁"];

// 반딧불 위치/타이밍 데이터
const FIREFLIES = [
  { left: "8%", top: "20%", delay: 0, dur: 4.5, size: 4 },
  { left: "85%", top: "15%", delay: 1.2, dur: 5.2, size: 3 },
  { left: "15%", top: "55%", delay: 2.4, dur: 4.8, size: 5 },
  { left: "78%", top: "45%", delay: 0.8, dur: 5.5, size: 3 },
  { left: "45%", top: "75%", delay: 3.1, dur: 4.2, size: 4 },
  { left: "92%", top: "70%", delay: 1.8, dur: 5.0, size: 3 },
  { left: "25%", top: "85%", delay: 0.3, dur: 4.6, size: 5 },
  { left: "60%", top: "30%", delay: 2.8, dur: 5.3, size: 3 },
];

export default function AnimalTestInputPage() {
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState<"female" | "male" | null>(null);

  const handleStart = () => {
    if (!selectedGender) return;
    sessionStorage.setItem("animalTestGender", selectedGender);
    router.push("/animal-test/test");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0A1F0D 0%, #071207 50%, #0D1B0E 100%)",
        pt: { xs: 14, sm: 10 },
        pb: { xs: 6, sm: 10 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ─── 반딧불 파티클 ─── */}
      {FIREFLIES.map((f, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            left: f.left,
            top: f.top,
            width: f.size,
            height: f.size,
            borderRadius: "50%",
            bgcolor: "#7CFC00",
            boxShadow: `0 0 ${f.size * 3}px ${f.size}px rgba(124, 252, 0, 0.3)`,
            animation: `${firefly} ${f.dur}s ease-in-out ${f.delay}s infinite, ${fireflyDrift} ${f.dur * 1.5}s ease-in-out ${f.delay}s infinite`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      ))}

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        {/* ─── 태그 ─── */}
        <Box sx={{ animation: `${fadeUp} 0.5s ease-out both`, textAlign: "center", mb: 4 }}>
          <Box
            sx={{
              display: "inline-block",
              bgcolor: "rgba(46, 204, 113, 0.06)",
              border: "1px solid rgba(46, 204, 113, 0.15)",
              borderRadius: 6,
              px: 2,
              py: 0.5,
              mb: 4,
            }}
          >
            <Typography sx={{ fontSize: "0.65rem", color: "#2ECC71", fontWeight: 600, letterSpacing: "0.15em" }}>
              ANIMAL TYPE TEST
            </Typography>
          </Box>
        </Box>

        {/* ─── 오빗 히어로 (동물 이모지가 원형으로 회전) ─── */}
        <Box
          sx={{
            animation: `${fadeUp} 0.6s ease-out 0.1s both`,
            display: "flex",
            justifyContent: "center",
            mb: 4,
          }}
        >
          <Box sx={{ position: "relative", width: 180, height: 180 }}>
            {/* 중앙 글로우 링 */}
            <Box
              sx={{
                position: "absolute",
                inset: 20,
                borderRadius: "50%",
                border: "1px solid rgba(46, 204, 113, 0.12)",
                animation: `${pulseRing} 3s ease-in-out infinite`,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 35,
                borderRadius: "50%",
                border: "1px solid rgba(46, 204, 113, 0.08)",
                animation: `${pulseRing} 3s ease-in-out 0.5s infinite`,
              }}
            />

            {/* 중앙 물음표 */}
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 56,
                height: 56,
                borderRadius: "50%",
                bgcolor: "rgba(46, 204, 113, 0.1)",
                border: "1px solid rgba(46, 204, 113, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography sx={{ fontSize: "1.5rem", color: "#2ECC71", fontWeight: 800 }}>?</Typography>
            </Box>

            {/* 궤도 동물들 */}
            {ORBIT_EMOJIS.map((emoji, i) => (
              <Box
                key={i}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: 0,
                  height: 0,
                  animation: `${orbit} ${18 + i * 2}s linear ${i * -3}s infinite`,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "1.4rem",
                    transform: "translate(-50%, -50%)",
                    filter: "drop-shadow(0 0 6px rgba(46, 204, 113, 0.3))",
                  }}
                >
                  {emoji}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ─── 타이틀 ─── */}
        <Box sx={{ animation: `${fadeUp} 0.5s ease-out 0.15s both`, textAlign: "center", mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              color: "#fff",
              fontWeight: 800,
              fontSize: { xs: "1.5rem", sm: "2rem" },
              lineHeight: 1.5,
              mb: 1,
            }}
          >
            그/그녀와 닮은{" "}
            <Box
              component="span"
              sx={{
                color: "#2ECC71",
                textShadow: "0 0 20px rgba(46, 204, 113, 0.3)",
              }}
            >
              동물
            </Box>
            은?
          </Typography>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.35)",
              fontSize: { xs: "0.85rem", sm: "0.92rem" },
              lineHeight: 1.7,
            }}
          >
            상대방을 떠올리며 12개 질문에 답해보세요
          </Typography>
        </Box>

        {/* ─── 성향 칩 (가로 스크롤 가능한 pill 형태) ─── */}
        <Box sx={{ animation: `${fadeUp} 0.5s ease-out 0.2s both`, mb: 5 }}>
          <Stack
            direction="row"
            sx={{
              gap: 1,
              justifyContent: "center",
              flexWrap: "wrap",
              px: 1,
            }}
          >
            {TYPE_KEYS.map((key, i) => {
              const meta = ANIMAL_TYPE_META[key];
              return (
                <Box
                  key={key}
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.6,
                    px: 1.5,
                    py: 0.7,
                    borderRadius: 6,
                    bgcolor: `${meta.color}10`,
                    border: `1px solid ${meta.color}25`,
                    animation: `${chipEnter} 0.3s ease-out ${0.25 + i * 0.06}s both`,
                  }}
                >
                  <Typography sx={{ fontSize: "0.75rem" }}>{meta.emoji}</Typography>
                  <Typography sx={{ color: meta.color, fontWeight: 600, fontSize: "0.72rem" }}>
                    {meta.label}
                  </Typography>
                </Box>
              );
            })}
          </Stack>
        </Box>

        {/* ─── 메타 정보 (아이콘 카드형) ─── */}
        <Box sx={{ animation: `${fadeUp} 0.5s ease-out 0.25s both`, mb: 5 }}>
          <Stack direction="row" spacing={1.5} sx={{ justifyContent: "center" }}>
            {[
              { emoji: "📝", label: "12문항" },
              { emoji: "⏱️", label: "2~3분" },
              { emoji: "🔍", label: "5가지 성향" },
            ].map((info) => (
              <Box
                key={info.label}
                sx={{
                  textAlign: "center",
                  px: 2,
                  py: 1.2,
                  borderRadius: 3,
                  bgcolor: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <Typography sx={{ fontSize: "1.1rem", mb: 0.3 }}>{info.emoji}</Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", fontWeight: 600 }}>
                  {info.label}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        {/* ─── 성별 선택 (이머시브 카드) ─── */}
        <Box sx={{ animation: `${fadeUp} 0.5s ease-out 0.3s both`, mb: 5 }}>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.35)",
              fontSize: "0.78rem",
              fontWeight: 500,
              textAlign: "center",
              mb: 2,
              letterSpacing: "0.05em",
            }}
          >
            떠올리는 상대방의 성별은?
          </Typography>

          <Stack direction="row" spacing={1.5}>
            {([
              { value: "female" as const, label: "여자", emoji: "👩", sub: "그녀를 떠올리며", animals: "🐱🦊🐰🦋" },
              { value: "male" as const, label: "남자", emoji: "👨", sub: "그를 떠올리며", animals: "🐯🐻🦁🐺" },
            ]).map(({ value, label, emoji, sub, animals }) => {
              const isSelected = selectedGender === value;
              return (
                <Button
                  key={value}
                  onClick={() => setSelectedGender(value)}
                  sx={{
                    flex: 1,
                    py: 2.5,
                    px: 2,
                    borderRadius: 4,
                    border: isSelected
                      ? "1.5px solid rgba(46, 204, 113, 0.6)"
                      : "1px solid rgba(255,255,255,0.06)",
                    bgcolor: isSelected
                      ? "rgba(46, 204, 113, 0.08)"
                      : "rgba(255,255,255,0.02)",
                    color: "#fff",
                    textTransform: "none",
                    flexDirection: "column",
                    gap: 0.8,
                    transition: "all 0.25s ease",
                    boxShadow: isSelected
                      ? "0 0 25px rgba(46, 204, 113, 0.1), inset 0 0 30px rgba(46, 204, 113, 0.03)"
                      : "none",
                    "&:hover": {
                      bgcolor: isSelected
                        ? "rgba(46, 204, 113, 0.1)"
                        : "rgba(255,255,255,0.04)",
                      borderColor: isSelected
                        ? "rgba(46, 204, 113, 0.6)"
                        : "rgba(255,255,255,0.12)",
                    },
                  }}
                >
                  <Typography sx={{ fontSize: "2rem", mb: 0.3 }}>{emoji}</Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: isSelected ? "#fff" : "rgba(255,255,255,0.7)" }}>
                    {label}
                  </Typography>
                  <Typography sx={{ fontSize: "0.68rem", color: isSelected ? "rgba(46, 204, 113, 0.7)" : "rgba(255,255,255,0.25)" }}>
                    {sub}
                  </Typography>
                  <Typography sx={{ fontSize: "0.85rem", mt: 0.5, letterSpacing: "2px", opacity: isSelected ? 0.8 : 0.3, transition: "opacity 0.25s" }}>
                    {animals}
                  </Typography>
                </Button>
              );
            })}
          </Stack>
        </Box>

        {/* ─── CTA ─── */}
        <Box sx={{ animation: `${fadeUp} 0.5s ease-out 0.35s both`, textAlign: "center" }}>
          <Button
            onClick={handleStart}
            disabled={!selectedGender}
            variant="contained"
            size="large"
            endIcon={<ArrowRight size={20} />}
            sx={{
              py: 1.8,
              px: 6,
              borderRadius: 8,
              fontSize: "0.95rem",
              fontWeight: 700,
              bgcolor: "#2ECC71",
              color: "#fff",
              textTransform: "none",
              boxShadow: selectedGender
                ? "0 4px 24px rgba(46, 204, 113, 0.25), 0 0 60px rgba(46, 204, 113, 0.08)"
                : "none",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "#27AE60",
                boxShadow: "0 6px 32px rgba(46, 204, 113, 0.35)",
                transform: "translateY(-1px)",
              },
              "&:disabled": {
                bgcolor: "rgba(46, 204, 113, 0.15)",
                color: "rgba(255,255,255,0.25)",
                boxShadow: "none",
              },
            }}
          >
            테스트 시작하기
          </Button>

          <Typography
            sx={{ color: "rgba(255,255,255,0.12)", fontSize: "0.65rem", mt: 4, textAlign: "center" }}
          >
            본 테스트는 재미를 위한 것이며, 전문적인 심리 진단이 아닙니다.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
