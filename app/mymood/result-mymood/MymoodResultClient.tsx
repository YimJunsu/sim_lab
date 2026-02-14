"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import { keyframes } from "@mui/material/styles";
import { RotateCcw, Share2, Sparkles, TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  type EmotionScores,
  type ShareableMoodData,
  EMOTION_META,
  getDominantEmotion,
  getRelatedContent,
} from "@/lib/mymood-questions";

/**
 * 감정 점수화 결과 클라이언트 컴포넌트
 *
 * 데이터 소스 우선순위:
 * 1. props.sharedData (공유 링크)
 * 2. sessionStorage (본인 결과)
 * 3. 리다이렉트
 *
 * 기능:
 * - SVG 도넛 차트 시각화
 * - 감정별 바 그래프
 * - 어제와 비교 (localStorage)
 * - 공유 기능 (fortune과 동일 패턴)
 * - 관련 컨텐츠 추천
 */

// ─── 디자인 토큰 ───
const T = {
  bgDark: "#0f0b25",
  bgCard: "rgba(25, 18, 52, 0.85)",
  primary: "#9b7ae8",
  primaryLight: "#b99af5",
  primaryDim: "rgba(155, 122, 232, 0.35)",
  primaryFaint: "rgba(155, 122, 232, 0.12)",
  cream: "#e8e0f0",
  creamDim: "rgba(232, 224, 240, 0.55)",
  accent: "#e891cf",
  accentGlow: "rgba(232, 145, 207, 0.25)",
  border: "rgba(155, 122, 232, 0.18)",
  borderHover: "rgba(155, 122, 232, 0.35)",
} as const;

// ─── 애니메이션 ───
const fadeSlideIn = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;
const gentleFloat = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
`;
const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 16px rgba(155, 122, 232, 0.08); }
  50% { box-shadow: 0 0 32px rgba(155, 122, 232, 0.18); }
`;
const donutReveal = keyframes`
  0% { stroke-dashoffset: var(--circumference); }
  100% { stroke-dashoffset: var(--final-offset); }
`;

// 애니메이션 래퍼
function Animated({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <Box sx={{ animation: `${fadeSlideIn} 0.45s ease-out ${delay}s both` }}>
      {children}
    </Box>
  );
}

// ─── 도넛 차트 컴포넌트 (SVG) ───
function DonutChart({ scores }: { scores: EmotionScores }) {
  const size = 220;
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;

  // 감정별 데이터 (값이 큰 순서로 정렬)
  const emotionKeys = Object.keys(scores) as (keyof EmotionScores)[];
  const sorted = emotionKeys
    .map((key) => ({
      key,
      value: scores[key],
      ...EMOTION_META[key],
    }))
    .sort((a, b) => b.value - a.value);

  // 주요 감정
  const dominant = sorted[0];

  // 각 세그먼트의 offset 계산
  let accumulated = 0;
  const segments = sorted.map((seg) => {
    const dash = (seg.value / 100) * circumference;
    const offset = circumference - accumulated;
    accumulated += dash;
    return { ...seg, dash, offset };
  });

  return (
    <Box sx={{ position: "relative", width: size, height: size, mx: "auto" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* 배경 원 */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="rgba(155, 122, 232, 0.06)"
          strokeWidth={strokeWidth}
        />
        {/* 감정별 세그먼트 */}
        {segments.map((seg, i) => (
          <circle
            key={seg.key}
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
            strokeDashoffset={seg.offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{
              opacity: 0.85,
              animation: `${donutReveal} 1s ease-out ${0.3 + i * 0.15}s both`,
              ["--circumference" as string]: circumference,
              ["--final-offset" as string]: seg.offset,
            }}
          />
        ))}
      </svg>
      {/* 중앙 텍스트 */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <Typography sx={{ fontSize: "2rem", lineHeight: 1 }}>
          {dominant.emoji}
        </Typography>
        <Typography
          sx={{
            color: dominant.color,
            fontWeight: 700,
            fontSize: "1.4rem",
            lineHeight: 1.2,
            mt: 0.5,
          }}
        >
          {dominant.value}%
        </Typography>
        <Typography sx={{ color: T.creamDim, fontSize: "0.72rem", mt: 0.2 }}>
          {dominant.label}
        </Typography>
      </Box>
    </Box>
  );
}

// ─── 어제 데이터 로드 ───
function getYesterdayData(): ShareableMoodData | null {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const key = `mymood_${yesterday.toISOString().slice(0, 10)}`;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ─── Props ───
interface Props {
  sharedData: ShareableMoodData | null;
  expiredShare?: boolean;
}

export default function MymoodResultClient({ sharedData, expiredShare }: Props) {
  const router = useRouter();
  const [result, setResult] = useState<ShareableMoodData | null>(null);
  const [isSharedView, setIsSharedView] = useState(false);
  const [yesterday, setYesterday] = useState<ShareableMoodData | null>(null);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [sharing, setSharing] = useState(false);

  // 데이터 로드
  useEffect(() => {
    // 1) 공유 링크
    if (sharedData) {
      setResult(sharedData);
      setIsSharedView(true);
      return;
    }

    // 1-b) 만료된 공유 링크
    if (expiredShare) {
      router.replace("/mymood/question");
      return;
    }

    // 2) sessionStorage
    const raw = sessionStorage.getItem("mymoodResult");
    if (!raw) {
      router.replace("/mymood/question");
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      setResult(parsed);
    } catch {
      router.replace("/mymood/question");
      return;
    }

    // 어제 데이터 로드
    setYesterday(getYesterdayData());
  }, [sharedData, expiredShare, router]);

  // 관련 컨텐츠
  const related = useMemo(
    () => (result ? getRelatedContent(result.scores) : null),
    [result]
  );

  // 감정 데이터 정렬 (큰 순서)
  const sortedEmotions = useMemo(() => {
    if (!result) return [];
    const keys = Object.keys(result.scores) as (keyof EmotionScores)[];
    return keys
      .map((key) => ({
        key,
        value: result.scores[key],
        ...EMOTION_META[key],
      }))
      .sort((a, b) => b.value - a.value);
  }, [result]);

  // 공유 핸들러
  const handleShare = async () => {
    if (!result || sharing) return;

    setSharing(true);
    try {
      const res = await fetch("/api/mymood/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });

      if (!res.ok) throw new Error("share failed");
      const { id } = await res.json();

      const shareUrl = `${window.location.origin}/mymood/result-mymood?id=${id}`;
      const shareText = `${result.comment}\n\n나도 감정 점수 확인해보기!`;

      if (navigator.share) {
        try {
          await navigator.share({
            title: "감정 점수화 결과 | 심랩",
            text: shareText,
            url: shareUrl,
          });
        } catch { /* 사용자 취소 */ }
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setSnackMessage("공유 링크가 클립보드에 복사되었습니다");
        setSnackOpen(true);
      }
    } catch {
      setSnackMessage("공유 링크 생성에 실패했습니다. 다시 시도해주세요.");
      setSnackOpen(true);
    } finally {
      setSharing(false);
    }
  };

  // 다시하기
  const handleRetry = () => {
    sessionStorage.removeItem("mymoodResult");
    router.push("/mymood/question");
  };

  // 로딩 / 리다이렉트 대기
  if (!result) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: `linear-gradient(175deg, ${T.bgDark} 0%, #120e2a 40%, #1a1035 70%, #0f0b25 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ color: T.primaryDim, fontSize: "0.9rem" }}>
          결과를 불러오는 중...
        </Typography>
      </Box>
    );
  }

  const dominant = getDominantEmotion(result.scores);
  const dominantMeta = EMOTION_META[dominant];

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        background: `linear-gradient(175deg, ${T.bgDark} 0%, #120e2a 40%, #1a1035 70%, #0f0b25 100%)`,
        pt: { xs: 10, sm: 13 },
        pb: { xs: 6, sm: 10 },
        overflow: "hidden",
      }}
    >
      {/* 배경 장식 */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: "3%", sm: "5%" },
          left: "50%",
          transform: "translateX(-50%)",
          width: { xs: 200, sm: 280 },
          height: { xs: 200, sm: 280 },
          borderRadius: "50%",
          border: `1px solid ${T.primaryFaint}`,
          pointerEvents: "none",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 18,
            borderRadius: "50%",
            border: `1px solid rgba(155, 122, 232, 0.06)`,
          },
        }}
      />

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        {/* ─── 공유 뷰 배너 ─── */}
        {isSharedView && (
          <Animated>
            <Box
              sx={{
                bgcolor: T.primaryFaint,
                border: `1px solid ${T.border}`,
                borderRadius: 2,
                px: 2,
                py: 1.2,
                mb: 2,
                textAlign: "center",
              }}
            >
              <Typography sx={{ color: T.primaryLight, fontSize: "0.8rem" }}>
                공유된 감정 점수 결과입니다
              </Typography>
            </Box>
          </Animated>
        )}

        {/* ─── 상단 타이틀 ─── */}
        <Animated>
          <Stack spacing={0.8} sx={{ alignItems: "center", mb: { xs: 3, sm: 4 } }}>
            <Typography
              sx={{
                fontSize: { xs: "1.6rem", sm: "2rem" },
                color: T.primary,
                animation: `${gentleFloat} 4s ease-in-out infinite`,
                lineHeight: 1,
                letterSpacing: "0.15em",
              }}
            >
              감정
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: T.cream,
                fontWeight: 700,
                textAlign: "center",
                fontSize: { xs: "1.2rem", sm: "1.5rem" },
              }}
            >
              오늘의 감정 점수
            </Typography>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Box sx={{ width: 20, height: "1px", bgcolor: T.primaryDim }} />
              <Typography sx={{ color: T.primaryDim, fontSize: "0.78rem" }}>
                {result.date}
              </Typography>
              <Box sx={{ width: 20, height: "1px", bgcolor: T.primaryDim }} />
            </Stack>
          </Stack>
        </Animated>

        {/* ─── 도넛 차트 ─── */}
        <Animated delay={0.1}>
          <Box
            sx={{
              bgcolor: T.bgCard,
              borderRadius: 3,
              border: `1px solid ${T.border}`,
              borderTop: `2px solid ${T.primary}`,
              p: { xs: 2.5, sm: 3.5 },
              mb: 2.5,
              animation: `${glowPulse} 5s ease-in-out infinite`,
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: -1,
                left: "25%",
                right: "25%",
                height: "1px",
                background: `linear-gradient(90deg, transparent, ${T.primary}, transparent)`,
              },
            }}
          >
            <Typography
              sx={{
                color: T.primaryDim,
                fontSize: "0.7rem",
                textAlign: "center",
                letterSpacing: "0.2em",
                mb: 2,
              }}
            >
              EMOTION CHART
            </Typography>

            <DonutChart scores={result.scores} />

            {/* 범례 */}
            <Stack
              direction="row"
              sx={{
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 1.5,
                mt: 2.5,
              }}
            >
              {sortedEmotions.map((em) => (
                <Stack key={em.key} direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: em.color,
                      opacity: 0.85,
                    }}
                  />
                  <Typography sx={{ color: T.creamDim, fontSize: "0.72rem" }}>
                    {em.emoji} {em.label} {em.value}%
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Animated>

        {/* ─── 감정 바 그래프 ─── */}
        <Animated delay={0.2}>
          <Box
            sx={{
              bgcolor: T.bgCard,
              borderRadius: 2.5,
              border: `1px solid ${T.border}`,
              p: { xs: 2, sm: 2.5 },
              mb: 2,
            }}
          >
            <Typography
              sx={{
                color: T.primaryDim,
                fontSize: "0.7rem",
                textAlign: "center",
                letterSpacing: "0.15em",
                mb: 2,
              }}
            >
              BREAKDOWN
            </Typography>
            <Stack spacing={1.5}>
              {sortedEmotions.map((em) => (
                <Box key={em.key}>
                  <Stack direction="row" sx={{ justifyContent: "space-between", mb: 0.3 }}>
                    <Typography sx={{ color: T.cream, fontSize: "0.82rem", fontWeight: 500 }}>
                      {em.emoji} {em.label}
                    </Typography>
                    <Typography sx={{ color: em.color, fontSize: "0.82rem", fontWeight: 700 }}>
                      {em.value}%
                    </Typography>
                  </Stack>
                  <Box
                    sx={{
                      width: "100%",
                      height: 8,
                      borderRadius: 4,
                      bgcolor: "rgba(155, 122, 232, 0.06)",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        width: `${em.value}%`,
                        height: "100%",
                        borderRadius: 4,
                        bgcolor: em.color,
                        opacity: 0.8,
                        transition: "width 1s ease-out",
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        </Animated>

        {/* ─── 한 줄 코멘트 ─── */}
        <Animated delay={0.3}>
          <Box
            sx={{
              bgcolor: T.bgCard,
              borderRadius: 2.5,
              border: `1px solid ${T.border}`,
              p: { xs: 2.5, sm: 3 },
              textAlign: "center",
              mb: 2,
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: `linear-gradient(90deg, transparent, ${dominantMeta.color}, transparent)`,
              },
            }}
          >
            <Typography sx={{ color: T.primaryDim, fontSize: "0.7rem", letterSpacing: "0.15em", mb: 1 }}>
              TODAY&apos;S COMMENT
            </Typography>
            <Typography
              sx={{
                color: T.cream,
                lineHeight: 1.8,
                fontSize: { xs: "0.9rem", sm: "0.95rem" },
                fontWeight: 500,
              }}
            >
              &ldquo;{result.comment}&rdquo;
            </Typography>
          </Box>
        </Animated>

        {/* ─── 어제와 비교 ─── */}
        {!isSharedView && yesterday && (
          <Animated delay={0.4}>
            <Box
              sx={{
                bgcolor: T.bgCard,
                borderRadius: 2.5,
                border: `1px solid ${T.border}`,
                p: { xs: 2, sm: 2.5 },
                mb: 2,
              }}
            >
              <Typography
                sx={{
                  color: T.primaryDim,
                  fontSize: "0.7rem",
                  textAlign: "center",
                  letterSpacing: "0.15em",
                  mb: 1.5,
                }}
              >
                VS YESTERDAY
              </Typography>
              <Stack spacing={1}>
                {(Object.keys(result.scores) as (keyof EmotionScores)[]).map((key) => {
                  const today = result.scores[key];
                  const prev = yesterday.scores[key];
                  const diff = today - prev;
                  const meta = EMOTION_META[key];

                  return (
                    <Stack key={key} direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
                      <Typography sx={{ color: T.cream, fontSize: "0.8rem" }}>
                        {meta.emoji} {meta.label}
                      </Typography>
                      <Stack direction="row" spacing={0.8} sx={{ alignItems: "center" }}>
                        <Typography sx={{ color: T.creamDim, fontSize: "0.75rem" }}>
                          {prev}%
                        </Typography>
                        <Typography sx={{ color: T.primaryDim, fontSize: "0.7rem" }}>
                          →
                        </Typography>
                        <Typography sx={{ color: meta.color, fontSize: "0.8rem", fontWeight: 600 }}>
                          {today}%
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", ml: 0.5 }}>
                          {diff > 0 ? (
                            <Stack direction="row" spacing={0.2} sx={{ alignItems: "center" }}>
                              <TrendingUp size={12} color="#69D2A0" />
                              <Typography sx={{ color: "#69D2A0", fontSize: "0.7rem" }}>
                                +{diff}
                              </Typography>
                            </Stack>
                          ) : diff < 0 ? (
                            <Stack direction="row" spacing={0.2} sx={{ alignItems: "center" }}>
                              <TrendingDown size={12} color="#FF6B6B" />
                              <Typography sx={{ color: "#FF6B6B", fontSize: "0.7rem" }}>
                                {diff}
                              </Typography>
                            </Stack>
                          ) : (
                            <Stack direction="row" spacing={0.2} sx={{ alignItems: "center" }}>
                              <Minus size={12} color={T.primaryDim as string} />
                              <Typography sx={{ color: T.primaryDim, fontSize: "0.7rem" }}>
                                0
                              </Typography>
                            </Stack>
                          )}
                        </Box>
                      </Stack>
                    </Stack>
                  );
                })}
              </Stack>
            </Box>
          </Animated>
        )}

        {/* ─── 관련 컨텐츠 추천 ─── */}
        {related && (
          <Animated delay={0.5}>
            <Box
              sx={{
                bgcolor: T.bgCard,
                borderRadius: 2.5,
                border: `1px solid ${T.border}`,
                borderLeft: `3px solid ${dominantMeta.color}`,
                p: { xs: 2, sm: 2.5 },
                mb: 2,
                transition: "border-color 0.2s",
                "&:hover": { borderColor: T.borderHover },
              }}
            >
              <Stack spacing={0.5}>
                <Typography sx={{ color: T.primaryDim, fontSize: "0.68rem", letterSpacing: "0.1em" }}>
                  RECOMMENDED
                </Typography>
                <Typography sx={{ color: T.cream, fontWeight: 600, fontSize: "0.9rem" }}>
                  {related.title}
                </Typography>
                <Typography sx={{ color: T.creamDim, fontSize: "0.82rem" }}>
                  {related.description}
                </Typography>
                <Button
                  href={related.href}
                  size="small"
                  sx={{
                    alignSelf: "flex-start",
                    mt: 0.5,
                    color: T.primary,
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    "&:hover": { bgcolor: T.primaryFaint },
                  }}
                >
                  바로가기 →
                </Button>
              </Stack>
            </Box>
          </Animated>
        )}

        {/* ─── 액션 버튼 ─── */}
        <Animated delay={0.6}>
          {isSharedView ? (
            <Stack spacing={1.5} sx={{ mt: 3 }}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                href="/mymood/question"
                startIcon={<Sparkles size={16} />}
                sx={{
                  py: 1.6,
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  letterSpacing: "0.05em",
                  background: `linear-gradient(135deg, ${T.primary} 0%, ${T.accent} 100%)`,
                  color: "#fff",
                  border: `1px solid rgba(155, 122, 232, 0.3)`,
                  boxShadow: `0 4px 20px ${T.accentGlow}`,
                  "&:hover": {
                    background: `linear-gradient(135deg, #8a6ad8 0%, #d580bf 100%)`,
                    boxShadow: `0 6px 24px rgba(232, 145, 207, 0.4)`,
                  },
                }}
              >
                나도 감정 체크하기
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleShare}
                startIcon={<Share2 size={15} />}
                sx={{
                  py: 1.2,
                  color: T.primary,
                  borderColor: T.border,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  "&:hover": { borderColor: T.primary, bgcolor: T.primaryFaint },
                }}
              >
                이 결과 다시 공유하기
              </Button>
            </Stack>
          ) : (
            <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleRetry}
                startIcon={<RotateCcw size={15} />}
                sx={{
                  py: 1.4,
                  color: T.primary,
                  borderColor: T.border,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  "&:hover": { borderColor: T.primary, bgcolor: T.primaryFaint },
                }}
              >
                다시하기
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={handleShare}
                startIcon={<Share2 size={15} />}
                sx={{
                  py: 1.4,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  background: `linear-gradient(135deg, ${T.primary} 0%, ${T.accent} 100%)`,
                  color: "#fff",
                  border: `1px solid rgba(155, 122, 232, 0.3)`,
                  "&:hover": {
                    background: `linear-gradient(135deg, #8a6ad8 0%, #d580bf 100%)`,
                  },
                }}
              >
                공유하기
              </Button>
            </Stack>
          )}
        </Animated>

        {/* ─── 면책 ─── */}
        <Animated delay={0.7}>
          <Stack spacing={0.3} sx={{ mt: 3, alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ width: 16, height: "1px", bgcolor: "rgba(155, 122, 232, 0.15)" }} />
              <Typography sx={{ color: "rgba(155, 122, 232, 0.25)", fontSize: "0.6rem", letterSpacing: "0.1em" }}>
                NOTICE
              </Typography>
              <Box sx={{ width: 16, height: "1px", bgcolor: "rgba(155, 122, 232, 0.15)" }} />
            </Box>
            <Typography
              variant="caption"
              sx={{ color: "rgba(155, 122, 232, 0.25)", textAlign: "center", fontSize: "0.68rem" }}
            >
              본 테스트는 재미를 위한 것이며, 전문적인 심리 진단이 아닙니다.
              <br />
              입력된 정보는 저장되지 않습니다.
              <br />
              공유된 결과는 최대 12시간까지 보존됩니다.
            </Typography>
          </Stack>
        </Animated>
      </Container>

      {/* 클립보드 복사 알림 */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={2500}
        onClose={() => setSnackOpen(false)}
        message={snackMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{
          "& .MuiSnackbarContent-root": {
            bgcolor: "rgba(25, 18, 52, 0.95)",
            color: T.cream,
            border: `1px solid ${T.border}`,
            borderRadius: 2,
            fontSize: "0.82rem",
          },
        }}
      />
    </Box>
  );
}