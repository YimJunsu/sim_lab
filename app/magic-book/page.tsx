"use client";

import { useState, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { keyframes } from "@mui/material/styles";
import Image from "next/image";

// ─── Types ───
type Stage = "intro" | "loading" | "result";
type Answer = "yes" | "no" | "fortune";

// ─── Seeded PRNG: Mulberry32 ───
// Produces deterministic float in [0, 1) from a seed integer.
function mulberry32(seed: number): number {
  let t = (seed + 0x6d2b79f5) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

// Seed changes every 3 minutes → same result within each 3-min window.
function getAnswer(): Answer {
  const seed = Math.floor(Date.now() / 180_000);
  const rand = mulberry32(seed);
  if (rand < 0.3) return "yes";
  if (rand < 0.9) return "no";
  return "fortune";
}

// ─── Answer metadata ───
const ANSWER_CONFIG: Record<
  Answer,
  { label: string; image: string; title: string; message: string; color: string; glow: string }
> = {
  yes: {
    label: "O",
    image: "/magic-book/magic-book-yes.png",
    title: "긍정의 답",
    message: "마법의 책이 고개를 끄덕였습니다.\n당신의 질문에 긍정적인 기운이 감돌고 있어요.",
    color: "#8DB870",
    glow: "rgba(141, 184, 112, 0.4)",
  },
  no: {
    label: "X",
    image: "/magic-book/magic-book-no.png",
    title: "부정의 답",
    message: "마법의 책이 고개를 가로저었습니다.\n지금은 때가 아닌 것 같아요.",
    color: "#C87878",
    glow: "rgba(200, 120, 120, 0.4)",
  },
  fortune: {
    label: "✦ FORTUNE",
    image: "/magic-book/magic-book-lucky.png",
    title: "특별한 행운",
    message: "마법의 책이 황금빛으로 빛났습니다!\n이 질문엔 아주 특별한 행운이 깃들어 있어요.",
    color: "#E8B040",
    glow: "rgba(232, 176, 64, 0.5)",
  },
};

// ─── Keyframe animations ───
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// 로딩 중 책에만 사용하는 미세한 브리딩 효과
const breathe = keyframes`
  0%, 100% { opacity: 0.85; }
  50%       { opacity: 1; }
`;

const glowPulse = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50%       { opacity: 0.85; transform: scale(1.05); }
`;

// 먼지(촛불 그을음) 입자 – 아래서 위로 느리게 떠오름
const dustDrift = keyframes`
  0%   { opacity: 0; transform: translate(0, 0) scale(1); }
  15%  { opacity: 0.6; }
  85%  { opacity: 0.3; }
  100% { opacity: 0; transform: translate(8px, -52px) scale(0.4); }
`;

const runeOrbit = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const shimmer = keyframes`
  0%, 100% { opacity: 0.25; }
  50%       { opacity: 0.85; }
`;

const revealIn = keyframes`
  0%   { opacity: 0; transform: scale(0.8); }
  70%  { transform: scale(1.03); }
  100% { opacity: 1; transform: scale(1); }
`;

// ─── Static data ───
// 촛불 그을음 같은 작은 먼지 입자
const DUST = [
  { left: "9%",  top: "18%", delay: 0,   dur: 6.5 },
  { left: "23%", top: "75%", delay: 1.2, dur: 5.8 },
  { left: "42%", top: "32%", delay: 2.3, dur: 7.0 },
  { left: "68%", top: "82%", delay: 0.7, dur: 6.2 },
  { left: "81%", top: "20%", delay: 1.9, dur: 5.5 },
  { left: "88%", top: "55%", delay: 3.4, dur: 6.8 },
  { left: "37%", top: "58%", delay: 0.3, dur: 6.0 },
  { left: "72%", top: "40%", delay: 2.8, dur: 7.2 },
  { left: "14%", top: "42%", delay: 4.0, dur: 5.9 },
  { left: "55%", top: "88%", delay: 1.5, dur: 6.4 },
];

const RUNES = ["ᚠ", "ᚢ", "ᚦ", "ᚨ", "ᚱ", "ᚲ", "ᚷ", "ᚹ"];

// 이미지 색감에 맞춘 웜톤 팔레트
const WARM = {
  bg:          "radial-gradient(ellipse at 50% 20%, #2a1206 0%, #160900 50%, #0a0400 100%)",
  accent:      "#C87030",        // 촛불 앰버
  accentLight: "#E8A840",        // 밝은 앰버/금
  parchment:   "rgba(240,218,178,0.82)",  // 양피지 텍스트
  parchmentDim:"rgba(230,205,160,0.55)",
  badge:       "rgba(185,90,25,0.35)",
  cardBg:      "rgba(160,70,15,0.07)",
  cardBorder:  "rgba(170,80,20,0.22)",
  divider:     "rgba(160,75,20,0.14)",
  dustColor:   "#B86020",
};

// ─── Component ───
export default function MagicBookPage() {
  const [stage, setStage] = useState<Stage>("intro");
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [countdown, setCountdown] = useState(5);
  const [dotCount, setDotCount] = useState(0);

  const handleAsk = useCallback(() => {
    setAnswer(getAnswer());
    setStage("loading");
    setCountdown(5);
    setDotCount(0);
  }, []);

  useEffect(() => {
    if (stage !== "loading") return;

    const dotInterval  = setInterval(() => setDotCount((n) => (n + 1) % 4), 500);
    const countInterval = setInterval(() => setCountdown((n) => Math.max(0, n - 1)), 1000);
    const revealTimer  = setTimeout(() => {
      clearInterval(dotInterval);
      clearInterval(countInterval);
      setStage("result");
    }, 5000);

    return () => {
      clearInterval(dotInterval);
      clearInterval(countInterval);
      clearTimeout(revealTimer);
    };
  }, [stage]);

  const config = answer ? ANSWER_CONFIG[answer] : null;
  const loadingLabel = "마법의 책님께서 확인중입니다" + ".".repeat(dotCount);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: WARM.bg,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: { xs: "88px", sm: "100px" },
        pb: { xs: 6, sm: 8 },
      }}
    >
      {/* ─── 촛불 그을음 파티클 ─── */}
      {DUST.map((d, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            left: d.left,
            top: d.top,
            width: 2,
            height: 2,
            borderRadius: "50%",
            bgcolor: WARM.dustColor,
            boxShadow: `0 0 3px 1px rgba(184,96,32,0.35)`,
            animation: `${dustDrift} ${d.dur}s ease-in-out ${d.delay}s infinite`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      ))}

      {/* ─── 배경 암비언트 링 (극도로 미세) ─── */}
      {[340, 500].map((size, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            top: "42%",
            left: "50%",
            width: size,
            height: size,
            borderRadius: "50%",
            border: "1px solid rgba(160,70,20,0.06)",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      ))}

      {/* ═══════════════════════════════════════
          STAGE: INTRO
      ════════════════════════════════════════ */}
      {stage === "intro" && (
        <Box
          sx={{
            width: "100%",
            maxWidth: 400,
            px: 3,
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* 배지 */}
          <Box sx={{ animation: `${fadeUp} 0.5s ease-out both`, mb: 3 }}>
            <Box
              sx={{
                border: `1px solid ${WARM.badge}`,
                borderRadius: 6,
                px: 2,
                py: 0.5,
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.58rem",
                  color: WARM.accent,
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                }}
              >
                ANCIENT ORACLE · 고대의 예언서
              </Typography>
            </Box>
          </Box>

          {/* 책 표지 이미지 – 정적, 페이드인만 */}
          <Box
            sx={{
              animation: `${fadeUp} 0.7s ease-out 0.08s both`,
              mb: 3,
              position: "relative",
            }}
          >
            {/* 이미지 뒤 따뜻한 캔들 빛 헤일로 */}
            <Box
              sx={{
                position: "absolute",
                inset: "-20px",
                borderRadius: "50%",
                background: "radial-gradient(ellipse, rgba(190,90,20,0.18) 0%, transparent 68%)",
                animation: `${glowPulse} 4s ease-in-out infinite`,
                pointerEvents: "none",
              }}
            />
            <Image
              src="/magic-book/magic-book-cover.png"
              alt="마법의 책"
              width={210}
              height={266}
              sizes="210px"
              style={{
                objectFit: "contain",
                // 이미지 자체 색감과 어울리는 따뜻한 그림자만
                filter: "drop-shadow(0 8px 24px rgba(140,60,10,0.55))",
                borderRadius: 8,
                display: "block",
              }}
            />
          </Box>

          {/* 타이틀 */}
          <Box sx={{ animation: `${fadeUp} 0.5s ease-out 0.18s both`, textAlign: "center", mb: 1.5 }}>
            <Typography
              sx={{
                color: WARM.accentLight,
                fontWeight: 800,
                fontSize: { xs: "1.75rem", sm: "2.1rem" },
                textShadow: `0 0 24px rgba(220,160,50,0.35)`,
                fontFamily: "'Georgia', serif",
                letterSpacing: "0.04em",
                lineHeight: 1.2,
              }}
            >
              마법의 책
            </Typography>
            <Typography
              sx={{ color: "rgba(200,130,50,0.45)", fontSize: "0.6rem", letterSpacing: "0.22em", mt: 0.5 }}
            >
              THE MAGIC BOOK
            </Typography>
          </Box>

          {/* 스토리 카드 */}
          <Box
            sx={{
              animation: `${fadeUp} 0.5s ease-out 0.28s both`,
              width: "100%",
              mb: 3.5,
              background: WARM.cardBg,
              border: `1px solid ${WARM.cardBorder}`,
              borderRadius: 3,
              p: 2.5,
              textAlign: "center",
            }}
          >
            <Typography
              sx={{ color: WARM.parchmentDim, fontSize: "0.83rem", lineHeight: 2, mb: 2 }}
            >
              수백 년 전, 어느 고대 유적지에서 발견된 마법의 책.
              <br />
              아무도 그 기원을 알지 못하지만,
              <br />
              책은 언제나{" "}
              <Box component="span" sx={{ color: WARM.accentLight, fontWeight: 600 }}>
                진실을 말한다
              </Box>
              고 전해진다.
            </Typography>
            <Box sx={{ borderTop: `1px solid ${WARM.divider}`, pt: 2 }}>
              <Typography
                sx={{ color: WARM.parchment, fontSize: "0.9rem", fontWeight: 600, lineHeight: 1.8 }}
              >
                속마음으로 질문을 생각하세요.
              </Typography>
              <Typography
                sx={{ color: "rgba(200,130,50,0.55)", fontSize: "0.73rem", mt: 0.6, fontStyle: "italic" }}
              >
                (소리 내시면 더 잘 나와요! 제 경험입니다. 😉)
              </Typography>
            </Box>
          </Box>

          {/* CTA 버튼 */}
          <Box sx={{ animation: `${fadeUp} 0.5s ease-out 0.38s both`, textAlign: "center" }}>
            <Button
              onClick={handleAsk}
              size="large"
              sx={{
                py: 1.8,
                px: 5,
                borderRadius: 8,
                fontSize: "0.95rem",
                fontWeight: 700,
                textTransform: "none",
                // 이미지의 캔들 앰버를 담은 버튼
                background: "linear-gradient(135deg, #9C4E18 0%, #C06828 50%, #9C4E18 100%)",
                color: "#FFF5E0",
                boxShadow: "0 4px 24px rgba(160,80,20,0.45), 0 1px 0 rgba(255,200,100,0.15) inset",
                transition: "all 0.25s ease",
                letterSpacing: "0.03em",
                "&:hover": {
                  background: "linear-gradient(135deg, #B05C20 0%, #D47830 50%, #B05C20 100%)",
                  boxShadow: "0 6px 32px rgba(160,80,20,0.6)",
                  transform: "translateY(-1px)",
                },
                "&:active": {
                  transform: "translateY(0)",
                  boxShadow: "0 2px 12px rgba(160,80,20,0.4)",
                },
              }}
            >
              📖 책에 묻기
            </Button>
            <Typography
              sx={{ color: "rgba(180,100,30,0.35)", fontSize: "0.62rem", mt: 2, letterSpacing: "0.04em" }}
            >
              마법의 책은 3분마다 새로운 답을 준비합니다
            </Typography>
          </Box>
        </Box>
      )}

      {/* ═══════════════════════════════════════
          STAGE: LOADING
      ════════════════════════════════════════ */}
      {stage === "loading" && (
        <Box
          sx={{
            width: "100%",
            maxWidth: 400,
            px: 3,
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            animation: `${fadeUp} 0.4s ease-out both`,
          }}
        >
          {/* 책 + 룬 링 */}
          <Box
            sx={{
              position: "relative",
              mb: 5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* 따뜻한 캔들 빛 글로우 */}
            <Box
              sx={{
                position: "absolute",
                inset: "-28px",
                borderRadius: "50%",
                background: "radial-gradient(ellipse, rgba(190,90,20,0.35) 0%, transparent 70%)",
                animation: `${glowPulse} 1.6s ease-in-out infinite`,
                pointerEvents: "none",
              }}
            />

            {/* 회전 룬 링 */}
            <Box
              sx={{
                position: "absolute",
                inset: "-58px",
                borderRadius: "50%",
                border: "1px solid rgba(180,85,25,0.28)",
                animation: `${runeOrbit} 5s linear infinite`,
                pointerEvents: "none",
              }}
            >
              {RUNES.map((rune, i) => (
                <Box
                  key={i}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    color: "rgba(210,120,45,0.72)",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    transform: `rotate(${i * 45}deg) translateY(-58px) rotate(-${i * 45}deg)`,
                    animation: `${shimmer} 2.2s ease-in-out ${i * 0.27}s infinite`,
                    lineHeight: 1,
                    mt: "-0.5em",
                    ml: "-0.3em",
                  }}
                >
                  {rune}
                </Box>
              ))}
            </Box>

            {/* 책 표지 – 브리딩 효과만 */}
            <Box sx={{ animation: `${breathe} 1.6s ease-in-out infinite` }}>
              <Image
                src="/magic-book/magic-book-cover.png"
                alt="마법의 책 확인 중"
                width={185}
                height={235}
                sizes="185px"
                style={{
                  objectFit: "contain",
                  filter: "drop-shadow(0 0 28px rgba(180,80,15,0.7)) drop-shadow(0 8px 20px rgba(100,40,5,0.8))",
                  borderRadius: 8,
                  display: "block",
                }}
              />
            </Box>
          </Box>

          {/* 로딩 텍스트 */}
          <Typography
            sx={{
              color: WARM.accentLight,
              fontSize: { xs: "0.95rem", sm: "1.05rem" },
              fontWeight: 600,
              textAlign: "center",
              textShadow: `0 0 16px rgba(220,160,50,0.45)`,
              mb: 1.5,
              minHeight: "1.6em",
              letterSpacing: "0.02em",
            }}
          >
            {loadingLabel}
          </Typography>

          <Typography
            sx={{ color: "rgba(190,110,40,0.4)", fontSize: "0.68rem", letterSpacing: "0.08em" }}
          >
            잠시만 기다려 주세요... ({countdown})
          </Typography>
        </Box>
      )}

      {/* ═══════════════════════════════════════
          STAGE: RESULT
      ════════════════════════════════════════ */}
      {stage === "result" && config && (
        <Box
          sx={{
            width: "100%",
            maxWidth: 400,
            px: 3,
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            animation: `${fadeUp} 0.5s ease-out both`,
          }}
        >
          {/* 결과 이미지 */}
          <Box
            sx={{
              position: "relative",
              mb: 3,
              animation: `${revealIn} 0.75s cubic-bezier(0.22, 1, 0.36, 1) both`,
            }}
          >
            {/* 결과 타입별 컬러 글로우 */}
            <Box
              sx={{
                position: "absolute",
                inset: "-16px",
                borderRadius: "12px",
                background: `radial-gradient(ellipse, ${config.glow} 0%, transparent 68%)`,
                animation: `${glowPulse} 2.4s ease-in-out infinite`,
                pointerEvents: "none",
              }}
            />
            <Image
              src={config.image}
              alt={config.title}
              width={225}
              height={285}
              sizes="225px"
              style={{
                objectFit: "contain",
                filter: `drop-shadow(0 0 20px ${config.glow}) drop-shadow(0 8px 24px rgba(80,30,5,0.7))`,
                borderRadius: 8,
                display: "block",
                position: "relative",
              }}
            />
          </Box>

          {/* 결과 레이블 */}
          <Box
            sx={{
              textAlign: "center",
              mb: 2,
              animation: `${fadeUp} 0.4s ease-out 0.25s both`,
            }}
          >
            <Typography
              sx={{
                fontSize: answer === "fortune"
                  ? { xs: "1.9rem", sm: "2.3rem" }
                  : { xs: "3.8rem", sm: "4.5rem" },
                fontWeight: 900,
                color: config.color,
                textShadow: `0 0 24px ${config.glow}, 0 0 48px ${config.glow}`,
                lineHeight: 1,
                mb: 0.5,
                fontFamily: "'Georgia', serif",
              }}
            >
              {config.label}
            </Typography>
            <Typography
              sx={{
                color: config.color,
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.16em",
                opacity: 0.65,
              }}
            >
              {config.title}
            </Typography>
          </Box>

          {/* 결과 메시지 */}
          <Box
            sx={{
              width: "100%",
              animation: `${fadeUp} 0.4s ease-out 0.4s both`,
              mb: 4,
              background: WARM.cardBg,
              border: `1px solid ${WARM.cardBorder}`,
              borderRadius: 3,
              p: 2.5,
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                color: WARM.parchment,
                fontSize: "0.88rem",
                lineHeight: 2,
                whiteSpace: "pre-line",
              }}
            >
              {config.message}
            </Typography>
          </Box>

          {/* 다시 묻기 */}
          <Box sx={{ animation: `${fadeUp} 0.4s ease-out 0.52s both`, textAlign: "center" }}>
            <Button
              onClick={() => setStage("intro")}
              variant="outlined"
              sx={{
                py: 1.5,
                px: 4.5,
                borderRadius: 7,
                fontSize: "0.88rem",
                fontWeight: 600,
                textTransform: "none",
                borderColor: "rgba(180,85,25,0.4)",
                color: WARM.accent,
                letterSpacing: "0.03em",
                transition: "all 0.25s ease",
                "&:hover": {
                  borderColor: "rgba(180,85,25,0.7)",
                  bgcolor: "rgba(160,70,15,0.08)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              다시 묻기
            </Button>
            <Typography
              sx={{ color: "rgba(180,100,30,0.3)", fontSize: "0.61rem", mt: 1.5, letterSpacing: "0.03em" }}
            >
              같은 질문은 3분 내 동일한 답이 나옵니다
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}