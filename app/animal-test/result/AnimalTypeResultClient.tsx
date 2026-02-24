"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import { keyframes } from "@mui/material/styles";
import { RotateCcw, Share2, Sparkles } from "lucide-react";
import {
  type AnimalScores,
  type ShareableAnimalData,
  ANIMAL_TYPE_META,
  getAnimalsByGender,
  encodeAnimalCompact,
  decodeAnimalCompact,
} from "@/lib/animal-type-questions";
import { copyToClipboard } from "@/lib/clipboard";

/**
 * 동물상 테스트 결과
 * 차별점: 메달 리빌 + 동심원 게이지 + 가로 스크롤 스탯 카드 + 스피치 버블
 * 이상형(오각형 레이더 + 수평 바)와 완전히 다른 시각화
 */

// ─── 성향 컬러 ───
const AT_COLORS: Record<keyof AnimalScores, string> = {
  warmth: "#F0A500",
  energy: "#FF6B6B",
  wit: "#2ECC71",
  calm: "#5DADE2",
  charm: "#AF7AC5",
};

const MAIN_COLOR = "#2ECC71";
const SCORE_KEYS: (keyof AnimalScores)[] = ["warmth", "energy", "wit", "calm", "charm"];

// ─── 애니메이션 ───
const fadeIn = keyframes`
  0%   { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const medalReveal = keyframes`
  0%   { opacity: 0; transform: scale(0.2) rotate(-20deg); }
  50%  { transform: scale(1.1) rotate(5deg); }
  70%  { transform: scale(0.95) rotate(-2deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
`;

const ringExpand = keyframes`
  0%   { opacity: 0; transform: scale(0.5); }
  60%  { opacity: 0.3; transform: scale(1.2); }
  100% { opacity: 0; transform: scale(1.5); }
`;

const gaugeGrow = keyframes`
  0%   { stroke-dashoffset: var(--circumference); }
  100% { stroke-dashoffset: var(--dash-offset); }
`;

const bubblePop = keyframes`
  0%   { opacity: 0; transform: scale(0.9) translateY(10px); }
  60%  { transform: scale(1.02) translateY(-2px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
`;

const leafConfetti = keyframes`
  0%   { opacity: 1; transform: translateY(0) rotate(0deg); }
  100% { opacity: 0; transform: translateY(-80px) rotate(180deg); }
`;

const firefly = keyframes`
  0%, 100% { opacity: 0; }
  30%      { opacity: 0.5; }
  70%      { opacity: 0.3; }
`;

const fireflyDrift = keyframes`
  0%   { transform: translate(0, 0); }
  33%  { transform: translate(10px, -15px); }
  66%  { transform: translate(-8px, -5px); }
  100% { transform: translate(0, 0); }
`;

function Animated({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return <Box sx={{ animation: `${fadeIn} 0.5s ease-out ${delay}s both` }}>{children}</Box>;
}

const FIREFLIES = [
  { left: "6%", top: "15%", delay: 0, dur: 5 },
  { left: "88%", top: "22%", delay: 1.2, dur: 4.5 },
  { left: "10%", top: "60%", delay: 2.5, dur: 5.2 },
  { left: "85%", top: "50%", delay: 0.8, dur: 4.8 },
];

// ─── 동심원 게이지 차트 (레이더 대체) ───
function ConcentricGaugeChart({ scores }: { scores: AnimalScores }) {
  const size = 260;
  const cx = size / 2;
  const cy = size / 2;

  // 5개 링 - 바깥에서 안쪽으로
  const rings = SCORE_KEYS.map((key, i) => {
    const radius = 110 - i * 20;
    const circumference = 2 * Math.PI * radius;
    const pct = Math.max(scores[key] / 100, 0.03);
    const dashOffset = circumference * (1 - pct);
    const color = AT_COLORS[key];
    const meta = ANIMAL_TYPE_META[key];

    return { key, radius, circumference, dashOffset, pct, color, meta, value: scores[key] };
  });

  return (
    <Box sx={{ width: size, height: size, mx: "auto", position: "relative" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* 배경 링 */}
        {rings.map((r) => (
          <circle
            key={`bg-${r.key}`}
            cx={cx}
            cy={cy}
            r={r.radius}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth={10}
          />
        ))}

        {/* 데이터 링 */}
        {rings.map((r, i) => (
          <circle
            key={`data-${r.key}`}
            cx={cx}
            cy={cy}
            r={r.radius}
            fill="none"
            stroke={r.color}
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={r.circumference}
            style={{
              "--circumference": `${r.circumference}`,
              "--dash-offset": `${r.dashOffset}`,
              strokeDashoffset: r.dashOffset,
              transform: "rotate(-90deg)",
              transformOrigin: `${cx}px ${cy}px`,
              animation: `${gaugeGrow} 1s ease-out ${0.3 + i * 0.12}s both`,
              opacity: 0.85,
            } as React.CSSProperties}
          />
        ))}
      </svg>

      {/* 범례 (우측) */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0.3,
        }}
      >
        {rings.map((r) => (
          <Stack key={r.key} direction="row" spacing={0.4} sx={{ alignItems: "center" }}>
            <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: r.color }} />
            <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.58rem", fontWeight: 500 }}>
              {r.meta.label}
            </Typography>
            <Typography sx={{ color: r.color, fontSize: "0.58rem", fontWeight: 700 }}>
              {r.value}%
            </Typography>
          </Stack>
        ))}
      </Box>
    </Box>
  );
}

// ─── 메인 ───
export default function AnimalTypeResultClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [pageState, setPageState] = useState<{ result: ShareableAnimalData | null; isShared: boolean }>({ result: null, isShared: false });
  const [snack, setSnack] = useState({ open: false, msg: "" });

  useEffect(() => {
    const dataParam = searchParams.get("r");
    if (dataParam) {
      const decoded = decodeAnimalCompact(dataParam);
      if (decoded) {
        setPageState({ result: decoded, isShared: true });
      } else {
        router.replace("/animal-test/input");
      }
      return;
    }
    const raw = sessionStorage.getItem("animalTestResult");
    if (!raw) { router.replace("/animal-test/input"); return; }
    try {
      setPageState({ result: JSON.parse(raw), isShared: false });
    } catch {
      router.replace("/animal-test/input");
    }
  }, [searchParams, router]);

  const { result, isShared } = pageState;

  const animal = useMemo(() => {
    if (!result) return null;
    const animals = getAnimalsByGender(result.gender);
    return animals[result.animalIdx] ?? null;
  }, [result]);

  const sortedTypes = useMemo(() => {
    if (!result) return [];
    return (Object.keys(result.scores) as (keyof AnimalScores)[])
      .map(key => ({ key, value: result.scores[key], ...ANIMAL_TYPE_META[key] }))
      .sort((a, b) => b.value - a.value);
  }, [result]);

  const handleShare = useCallback(async () => {
    if (!result) return;
    const shareUrl = `${window.location.origin}/animal-test/result?r=${encodeAnimalCompact(result)}`;
    if (navigator.share) {
      try { await navigator.share({ title: "동물상 테스트 | 심랩", url: shareUrl }); } catch { /* */ }
    } else {
      const ok = await copyToClipboard(shareUrl);
      setSnack({ open: true, msg: ok ? "링크가 복사되었습니다!" : "링크 복사에 실패했습니다." });
    }
  }, [result]);

  if (!result || !animal) return null;

  const genderLabel = result.gender === "female" ? "그녀" : "그";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0A1F0D 0%, #071207 50%, #0D1B0E 100%)",
        pt: { xs: 12, sm: 10 },
        pb: 10,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ─── 반딧불 ─── */}
      {FIREFLIES.map((f, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            left: f.left,
            top: f.top,
            width: 3,
            height: 3,
            borderRadius: "50%",
            bgcolor: "#7CFC00",
            boxShadow: "0 0 8px 3px rgba(124, 252, 0, 0.2)",
            animation: `${firefly} ${f.dur}s ease-in-out ${f.delay}s infinite, ${fireflyDrift} ${f.dur * 1.4}s ease-in-out ${f.delay}s infinite`,
            pointerEvents: "none",
          }}
        />
      ))}

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        {isShared && (
          <Animated>
            <Box
              sx={{
                bgcolor: "rgba(46, 204, 113, 0.06)",
                border: "1px solid rgba(46, 204, 113, 0.12)",
                borderRadius: 6,
                py: 0.4,
                px: 1.5,
                mb: 2,
                width: "fit-content",
                mx: "auto",
              }}
            >
              <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.68rem" }}>
                공유된 결과
              </Typography>
            </Box>
          </Animated>
        )}

        {/* ─── 메달 리빌 (동물 대형 표시) ─── */}
        <Animated>
          <Box sx={{ textAlign: "center", mb: 4, position: "relative" }}>
            {/* 나뭇잎 컨페티 */}
            {["🍃", "🌿", "🍂", "🍃"].map((leaf, i) => (
              <Typography
                key={i}
                sx={{
                  position: "absolute",
                  fontSize: "0.9rem",
                  left: `${25 + i * 18}%`,
                  top: "10%",
                  animation: `${leafConfetti} 1.5s ease-out ${0.3 + i * 0.15}s both`,
                  pointerEvents: "none",
                }}
              >
                {leaf}
              </Typography>
            ))}

            {/* 메달 컨테이너 */}
            <Box
              sx={{
                position: "relative",
                display: "inline-block",
                mb: 2.5,
              }}
            >
              {/* 확장 링 이펙트 */}
              {[0, 0.3, 0.6].map((delay, i) => (
                <Box
                  key={i}
                  sx={{
                    position: "absolute",
                    inset: -10 - i * 15,
                    borderRadius: "50%",
                    border: `1px solid ${MAIN_COLOR}`,
                    animation: `${ringExpand} 1.5s ease-out ${delay}s both`,
                    pointerEvents: "none",
                  }}
                />
              ))}

              {/* 메달 본체 */}
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  background: `radial-gradient(circle at 40% 35%, rgba(46, 204, 113, 0.15), rgba(46, 204, 113, 0.03) 70%)`,
                  border: "2px solid rgba(46, 204, 113, 0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  animation: `${medalReveal} 0.8s ease-out 0.2s both`,
                  boxShadow: "0 0 40px rgba(46, 204, 113, 0.1), inset 0 0 30px rgba(46, 204, 113, 0.05)",
                }}
              >
                <Typography sx={{ fontSize: "3.5rem" }}>{animal.emoji}</Typography>
              </Box>
            </Box>

            <Typography sx={{ fontSize: "0.62rem", letterSpacing: "0.2em", fontWeight: 600, color: "rgba(255,255,255,0.2)", mb: 0.8 }}>
              {genderLabel}의 동물상은
            </Typography>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#fff",
                fontSize: { xs: "1.7rem", sm: "2.1rem" },
                lineHeight: 1.4,
                mb: 0.5,
              }}
            >
              <Box
                component="span"
                sx={{
                  color: MAIN_COLOR,
                  textShadow: "0 0 20px rgba(46, 204, 113, 0.25)",
                }}
              >
                {animal.name}
              </Box>
              상
            </Typography>

            <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: { xs: "0.88rem", sm: "0.95rem" } }}>
              {animal.description}
            </Typography>

            <Typography sx={{ color: "rgba(255,255,255,0.2)", fontSize: "0.72rem", mt: 1.5 }}>
              {result.date}
            </Typography>
          </Box>
        </Animated>

        {/* ─── 스피치 버블 코멘트 ─── */}
        <Box sx={{ animation: `${bubblePop} 0.5s ease-out 0.4s both`, mb: 3 }}>
          <Box
            sx={{
              position: "relative",
              bgcolor: "rgba(240, 165, 0, 0.06)",
              border: "1px solid rgba(240, 165, 0, 0.12)",
              borderRadius: 4,
              p: 2.5,
              "&::before": {
                content: '""',
                position: "absolute",
                top: -8,
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderBottom: "8px solid rgba(240, 165, 0, 0.12)",
              },
            }}
          >
            <Typography
              sx={{
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.8,
                fontSize: "0.9rem",
                textAlign: "center",
                fontStyle: "italic",
              }}
            >
              &ldquo;{result.comment}&rdquo;
            </Typography>
          </Box>
        </Box>

        {/* ─── 동물 특징 카드 ─── */}
        <Animated delay={0.3}>
          <Box
            sx={{
              borderRadius: 4,
              border: `1px solid ${MAIN_COLOR}18`,
              bgcolor: `${MAIN_COLOR}06`,
              p: { xs: 2.5, sm: 3 },
              mb: 3,
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: `linear-gradient(90deg, transparent, ${MAIN_COLOR}30, transparent)`,
              },
            }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1.5 }}>
              <Typography sx={{ fontSize: "1.2rem" }}>{animal.emoji}</Typography>
              <Typography sx={{ color: MAIN_COLOR, fontSize: "0.82rem", fontWeight: 700 }}>
                {animal.name}상의 특징
              </Typography>
            </Stack>
            <Typography sx={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.9, fontSize: "0.88rem" }}>
              {animal.detail}
            </Typography>
          </Box>
        </Animated>

        {/* ─── 동심원 게이지 차트 ─── */}
        <Animated delay={0.4}>
          <Box
            sx={{
              bgcolor: "rgba(255,255,255,0.02)",
              borderRadius: 4,
              border: "1px solid rgba(255,255,255,0.05)",
              p: { xs: 2, sm: 3 },
              mb: 3,
            }}
          >
            <Typography sx={{ color: "rgba(255,255,255,0.2)", fontSize: "0.6rem", letterSpacing: "0.2em", fontWeight: 600, mb: 1.5, textAlign: "center" }}>
              TRAIT ANALYSIS
            </Typography>
            <ConcentricGaugeChart scores={result.scores} />
          </Box>
        </Animated>

        {/* ─── 가로 스크롤 스탯 카드 ─── */}
        <Animated delay={0.5}>
          <Box
            sx={{
              mx: -2,
              px: 2,
              pb: 1,
              overflowX: "auto",
              mb: 3,
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            <Stack direction="row" spacing={1.2} sx={{ width: "max-content" }}>
              {sortedTypes.map((t, i) => {
                const color = AT_COLORS[t.key];
                const isTop = i === 0;
                return (
                  <Box
                    key={t.key}
                    sx={{
                      width: 130,
                      p: 2,
                      borderRadius: 3,
                      bgcolor: isTop ? `${color}0D` : "rgba(255,255,255,0.02)",
                      border: isTop ? `1px solid ${color}25` : "1px solid rgba(255,255,255,0.05)",
                      flexShrink: 0,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {isTop && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          bgcolor: `${color}20`,
                          borderRadius: 4,
                          px: 0.8,
                          py: 0.2,
                        }}
                      >
                        <Typography sx={{ color, fontSize: "0.5rem", fontWeight: 700 }}>TOP</Typography>
                      </Box>
                    )}

                    <Typography sx={{ fontSize: "1.1rem", mb: 0.8 }}>{t.emoji}</Typography>

                    <Typography sx={{ color: isTop ? color : "rgba(255,255,255,0.5)", fontSize: "0.75rem", fontWeight: 600, mb: 0.5 }}>
                      {t.label}
                    </Typography>

                    <Typography sx={{ color: isTop ? color : "rgba(255,255,255,0.4)", fontSize: "1.3rem", fontWeight: 800 }}>
                      {t.value}
                      <Box component="span" sx={{ fontSize: "0.7rem", fontWeight: 500, ml: 0.2 }}>%</Box>
                    </Typography>

                    {/* 미니 바 */}
                    <Box sx={{ width: "100%", height: 3, bgcolor: "rgba(255,255,255,0.04)", borderRadius: 2, mt: 1 }}>
                      <Box sx={{ width: `${t.value}%`, height: "100%", bgcolor: color, borderRadius: 2, opacity: isTop ? 1 : 0.5, transition: "width 0.8s ease-out" }} />
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </Box>
        </Animated>

        {/* ─── 버튼 ─── */}
        <Animated delay={0.6}>
          <Stack direction="row" spacing={1.5} sx={{ mt: 1 }}>
            {isShared ? (
              <Button
                fullWidth
                variant="contained"
                href="/animal-test/input"
                startIcon={<Sparkles size={18} />}
                sx={{
                  py: 1.5,
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: "0.92rem",
                  bgcolor: MAIN_COLOR,
                  color: "#fff",
                  textTransform: "none",
                  boxShadow: "0 4px 20px rgba(46, 204, 113, 0.2)",
                  "&:hover": { bgcolor: "#27AE60", boxShadow: "0 6px 28px rgba(46, 204, 113, 0.3)" },
                }}
              >
                나도 테스트하기
              </Button>
            ) : (
              <>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => router.push("/animal-test/input")}
                  startIcon={<RotateCcw size={16} />}
                  sx={{
                    py: 1.4,
                    borderRadius: 8,
                    color: "rgba(255,255,255,0.5)",
                    borderColor: "rgba(255,255,255,0.1)",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.88rem",
                    "&:hover": {
                      borderColor: "rgba(255,255,255,0.2)",
                      bgcolor: "rgba(255,255,255,0.03)",
                    },
                  }}
                >
                  다시하기
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleShare}
                  startIcon={<Share2 size={16} />}
                  sx={{
                    py: 1.4,
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    bgcolor: MAIN_COLOR,
                    color: "#fff",
                    textTransform: "none",
                    boxShadow: "0 4px 20px rgba(46, 204, 113, 0.2)",
                    "&:hover": { bgcolor: "#27AE60", boxShadow: "0 6px 28px rgba(46, 204, 113, 0.3)" },
                  }}
                >
                  공유하기
                </Button>
              </>
            )}
          </Stack>
        </Animated>
      </Container>
      <Snackbar
        open={snack.open}
        autoHideDuration={2000}
        onClose={() => setSnack(prev => ({ ...prev, open: false }))}
        message={snack.msg}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}
