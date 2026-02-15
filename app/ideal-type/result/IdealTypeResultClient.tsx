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
  type IdealTypeScores,
  type ShareableIdealTypeData,
  TYPE_META,
  getDominantType,
  getResultTitle,
  encodeIdealTypeCompact,
  decodeIdealTypeCompact,
} from "@/lib/ideal-type-questions";

/**
 * 이상형 성향 테스트 결과
 * 디자인: 미니멀 다크 (#111), 오각형 레이더, 수평 바
 * mymood(보라 몽환 + 도넛 + 오브)와 완전 차별화
 */

// ─── 성향별 컬러 ───
const IT_COLORS: Record<keyof IdealTypeScores, string> = {
  leader: "#FF6B35",
  romantic: "#E84393",
  stable: "#0984E3",
  humorous: "#FDCB6E",
  intellectual: "#6C5CE7",
};

// ─── 애니메이션 ───
const fadeIn = keyframes`
  0%   { opacity: 0; transform: translateY(16px); }
  100% { opacity: 1; transform: translateY(0); }
`;
const barGrow = keyframes`
  0%   { width: 0%; }
  100% { width: var(--bar-w); }
`;
const radarDraw = keyframes`
  0%   { opacity: 0; transform: scale(0.4); }
  100% { opacity: 1; transform: scale(1); }
`;

function Animated({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return <Box sx={{ animation: `${fadeIn} 0.45s ease-out ${delay}s both` }}>{children}</Box>;
}

// ─── 오각형 레이더 차트 ───
const RADAR_KEYS: (keyof IdealTypeScores)[] = ["leader", "romantic", "stable", "humorous", "intellectual"];

function PentagonRadarChart({ scores }: { scores: IdealTypeScores }) {
  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = 100;
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const angles = RADAR_KEYS.map((_, i) => (-90 + i * 72) * (Math.PI / 180));

  function pentagonPath(scale: number) {
    return angles
      .map((a, i) => {
        const x = cx + maxR * scale * Math.cos(a);
        const y = cy + maxR * scale * Math.sin(a);
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ") + " Z";
  }

  const dataPath = angles
    .map((a, i) => {
      const val = Math.max(scores[RADAR_KEYS[i]] / 100, 0.05);
      const x = cx + maxR * val * Math.cos(a);
      const y = cy + maxR * val * Math.sin(a);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ") + " Z";

  const dominant = getDominantType(scores);
  const dominantColor = IT_COLORS[dominant];

  const vertices = angles.map((a, i) => {
    const key = RADAR_KEYS[i];
    const meta = TYPE_META[key];
    const labelR = maxR + 32;
    const val = Math.max(scores[key] / 100, 0.05);
    return {
      key,
      dotX: cx + maxR * val * Math.cos(a),
      dotY: cy + maxR * val * Math.sin(a),
      labelX: cx + labelR * Math.cos(a),
      labelY: cy + labelR * Math.sin(a),
      color: IT_COLORS[key],
      label: meta.label,
      value: scores[key],
    };
  });

  return (
    <Box sx={{ width: size, height: size + 10, mx: "auto", position: "relative" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
        {/* 그리드 */}
        {levels.map((lvl, i) => (
          <path key={i} d={pentagonPath(lvl)} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
        ))}

        {/* 축 */}
        {vertices.map((v, i) => (
          <line key={i} x1={cx} y1={cy} x2={cx + maxR * Math.cos(angles[i])} y2={cy + maxR * Math.sin(angles[i])} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
        ))}

        {/* 데이터 영역 */}
        <defs>
          <linearGradient id="rf" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={dominantColor} stopOpacity={0.2} />
            <stop offset="100%" stopColor={dominantColor} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <path
          d={dataPath}
          fill="url(#rf)"
          stroke={dominantColor}
          strokeWidth={1.5}
          strokeLinejoin="round"
          style={{ transformOrigin: `${cx}px ${cy}px`, animation: `${radarDraw} 0.8s ease-out 0.3s both` } as React.CSSProperties}
        />

        {/* 도트 */}
        {vertices.map((v) => (
          <circle key={v.key} cx={v.dotX} cy={v.dotY} r={3} fill={v.color} stroke="#111" strokeWidth={1.5} />
        ))}

        {/* 라벨 */}
        {vertices.map((v) => {
          const isTop = v.labelY < cy - 30;
          const isBottom = v.labelY > cy + 30;
          const dy = isTop ? -4 : isBottom ? 6 : 0;
          return (
            <g key={`l-${v.key}`}>
              <text x={v.labelX} y={v.labelY + dy} textAnchor="middle" fill={v.color} style={{ fontSize: "10px", fontWeight: 700 }}>
                {v.label}
              </text>
              <text x={v.labelX} y={v.labelY + dy + 14} textAnchor="middle" fill="rgba(255,255,255,0.4)" style={{ fontSize: "10px", fontWeight: 500 }}>
                {v.value}%
              </text>
            </g>
          );
        })}
      </svg>
    </Box>
  );
}

// ─── 메인 ───
export default function IdealTypeResultClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [pageState, setPageState] = useState<{ result: ShareableIdealTypeData | null; isShared: boolean }>({ result: null, isShared: false });
  const [snack, setSnack] = useState({ open: false, msg: "" });

  useEffect(() => {
    const dataParam = searchParams.get("r");
    if (dataParam) {
      const decoded = decodeIdealTypeCompact(dataParam);
      if (decoded) {
        setPageState({ result: decoded, isShared: true });
      } else {
        router.replace("/ideal-type/test");
      }
      return;
    }
    const raw = sessionStorage.getItem("idealTypeResult");
    if (!raw) { router.replace("/ideal-type/test"); return; }
    try {
      setPageState({ result: JSON.parse(raw), isShared: false });
    } catch {
      router.replace("/ideal-type/test");
    }
  }, [searchParams, router]);

  const { result, isShared } = pageState;

  const sortedTypes = useMemo(() => {
    if (!result) return [];
    return (Object.keys(result.scores) as (keyof IdealTypeScores)[])
      .map(key => ({ key, value: result.scores[key], ...TYPE_META[key] }))
      .sort((a, b) => b.value - a.value);
  }, [result]);

  const handleShare = useCallback(async () => {
    if (!result) return;
    const shareUrl = `${window.location.origin}/ideal-type/result?r=${encodeIdealTypeCompact(result)}`;
    if (navigator.share) {
      try { await navigator.share({ title: "이상형 성향 테스트 | 심랩", url: shareUrl }); } catch { /* */ }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setSnack({ open: true, msg: "링크가 복사되었습니다!" });
    }
  }, [result]);

  if (!result) return null;

  const dominantKey = getDominantType(result.scores);
  const dominantColor = IT_COLORS[dominantKey];
  const dominantMeta = TYPE_META[dominantKey];
  const resultTitle = getResultTitle(dominantKey);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#111", pt: { xs: 14, sm: 12 }, pb: 10 }}>
      <Container maxWidth="sm">
        {isShared && (
          <Animated>
            <Box
              sx={{
                bgcolor: "rgba(232,67,147,0.06)",
                border: "1px solid rgba(232,67,147,0.12)",
                borderRadius: 1,
                py: 0.5,
                px: 1.5,
                mb: 2,
                width: "fit-content",
                mx: "auto",
              }}
            >
              <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.7rem" }}>
                공유된 결과
              </Typography>
            </Box>
          </Animated>
        )}

        {/* ─── 타이틀 ─── */}
        <Animated>
          <Stack spacing={0.8} sx={{ mb: 4 }}>
            <Typography sx={{ fontSize: "0.65rem", letterSpacing: "0.2em", fontWeight: 600, color: "rgba(255,255,255,0.2)" }}>
              RESULT
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#fff",
                fontSize: { xs: "1.4rem", sm: "1.7rem" },
                lineHeight: 1.4,
              }}
            >
              {resultTitle}
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.25)", fontSize: "0.75rem" }}>
              {result.date}
            </Typography>
          </Stack>
        </Animated>

        {/* ─── 레이더 차트 ─── */}
        <Animated delay={0.1}>
          <Box
            sx={{
              bgcolor: "rgba(255,255,255,0.02)",
              borderRadius: 3,
              border: "1px solid rgba(255,255,255,0.05)",
              p: { xs: 2, sm: 3 },
              mb: 2.5,
            }}
          >
            <PentagonRadarChart scores={result.scores} />
          </Box>
        </Animated>

        {/* ─── 바 차트 ─── */}
        <Animated delay={0.2}>
          <Box
            sx={{
              bgcolor: "rgba(255,255,255,0.02)",
              borderRadius: 3,
              border: "1px solid rgba(255,255,255,0.05)",
              p: 2.5,
              mb: 2.5,
            }}
          >
            <Stack spacing={2}>
              {sortedTypes.map((t, i) => {
                const color = IT_COLORS[t.key];
                return (
                  <Box key={t.key}>
                    <Stack direction="row" sx={{ justifyContent: "space-between", mb: 0.5, alignItems: "center" }}>
                      <Stack direction="row" spacing={0.6} sx={{ alignItems: "center" }}>
                        <Box sx={{ width: 3, height: 14, borderRadius: 1, bgcolor: color, opacity: 0.7 }} />
                        <Typography sx={{ color: "rgba(255,255,255,0.65)", fontSize: "0.82rem", fontWeight: 600 }}>
                          {t.label}
                        </Typography>
                      </Stack>
                      <Typography sx={{ color, fontWeight: 700, fontSize: "0.85rem" }}>
                        {t.value}%
                      </Typography>
                    </Stack>
                    <Box sx={{ width: "100%", height: 6, bgcolor: "rgba(255,255,255,0.04)", borderRadius: 3 }}>
                      <Box
                        sx={{
                          "--bar-w": `${t.value}%`,
                          height: "100%",
                          bgcolor: color,
                          borderRadius: 3,
                          animation: `${barGrow} 0.8s ease-out ${0.4 + i * 0.08}s both`,
                        } as React.CSSProperties}
                      />
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </Box>
        </Animated>

        {/* ─── 코멘트 ─── */}
        <Animated delay={0.3}>
          <Box
            sx={{
              borderRadius: 3,
              border: `1px solid ${dominantColor}20`,
              bgcolor: `${dominantColor}06`,
              p: 2.5,
              mb: 2.5,
            }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1.2 }}>
              <Typography sx={{ fontSize: "1rem" }}>{dominantMeta.emoji}</Typography>
              <Typography sx={{ color: dominantColor, fontSize: "0.78rem", fontWeight: 700 }}>
                {dominantMeta.label}
              </Typography>
            </Stack>
            <Typography sx={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.8, fontSize: "0.92rem" }}>
              &ldquo;{result.comment}&rdquo;
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.25)", fontSize: "0.73rem", mt: 1.2 }}>
              {dominantMeta.description}
            </Typography>
          </Box>
        </Animated>

        {/* ─── 성향 상세 ─── */}
        <Animated delay={0.4}>
          <Box
            sx={{
              bgcolor: "rgba(255,255,255,0.02)",
              borderRadius: 3,
              border: "1px solid rgba(255,255,255,0.05)",
              p: 2.5,
              mb: 3,
            }}
          >
            <Typography sx={{ color: "rgba(255,255,255,0.2)", fontSize: "0.6rem", letterSpacing: "0.2em", fontWeight: 600, mb: 2 }}>
              TYPE BREAKDOWN
            </Typography>
            <Stack spacing={1.2}>
              {sortedTypes.map((t, i) => {
                const color = IT_COLORS[t.key];
                const isTop = i === 0;
                return (
                  <Box
                    key={t.key}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.2,
                      py: 1,
                      px: 1.2,
                      borderRadius: 2,
                      bgcolor: isTop ? `${color}08` : "transparent",
                      border: isTop ? `1px solid ${color}15` : "1px solid transparent",
                    }}
                  >
                    <Typography sx={{ fontSize: "1rem", flexShrink: 0 }}>{t.emoji}</Typography>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                        <Typography sx={{ color: isTop ? color : "rgba(255,255,255,0.55)", fontSize: "0.8rem", fontWeight: isTop ? 700 : 500 }}>
                          {t.label}
                          {isTop && (
                            <Box component="span" sx={{ ml: 0.6, fontSize: "0.6rem", color, opacity: 0.6 }}>
                              TOP
                            </Box>
                          )}
                        </Typography>
                        <Typography sx={{ color: isTop ? color : "rgba(255,255,255,0.35)", fontWeight: 600, fontSize: "0.8rem" }}>
                          {t.value}%
                        </Typography>
                      </Stack>
                      <Typography sx={{ color: "rgba(255,255,255,0.25)", fontSize: "0.68rem", mt: 0.2 }}>
                        {t.description}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </Box>
        </Animated>

        {/* ─── 버튼 ─── */}
        <Animated delay={0.5}>
          <Stack direction="row" spacing={1.5} sx={{ mt: 1 }}>
            {isShared ? (
              <Button
                fullWidth
                variant="contained"
                href="/ideal-type"
                startIcon={<Sparkles size={18} />}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: "0.92rem",
                  bgcolor: "#E84393",
                  color: "#fff",
                  textTransform: "none",
                  "&:hover": { bgcolor: "#d63784" },
                }}
              >
                나도 테스트하기
              </Button>
            ) : (
              <>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => router.push("/ideal-type/test")}
                  startIcon={<RotateCcw size={16} />}
                  sx={{
                    py: 1.4,
                    borderRadius: 2,
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
                    borderRadius: 2,
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    bgcolor: "#E84393",
                    color: "#fff",
                    textTransform: "none",
                    "&:hover": { bgcolor: "#d63784" },
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
      />
    </Box>
  );
}
