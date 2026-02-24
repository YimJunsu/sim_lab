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
import Image from "next/image";
import { RotateCcw, Share2, Sparkles, TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
    type EmotionScores,
    type ShareableMoodData,
    EMOTION_META,
    getDominantEmotion,
    getRelatedContent,
    encodeMoodCompact,
    decodeMoodCompact,
} from "@/lib/mymood-questions";
import { copyToClipboard } from "@/lib/clipboard";

// ─── 인사이드아웃 감성 컬러 (더 생생한 톤) ───
const IO_COLORS: Record<keyof EmotionScores, { main: string; light: string; glow: string }> = {
    joy:        { main: "#FFD93D", light: "#FFF3C4", glow: "rgba(255,217,61,0.35)" },
    fatigue:    { main: "#7B8CDE", light: "#D4DAFF", glow: "rgba(123,140,222,0.35)" },
    stress:     { main: "#FF6B6B", light: "#FFD4D4", glow: "rgba(255,107,107,0.35)" },
    calm:       { main: "#69D2A0", light: "#C8F5DC", glow: "rgba(105,210,160,0.35)" },
    excitement: { main: "#E891CF", light: "#F9D4EE", glow: "rgba(232,145,207,0.35)" },
};

// ─── 애니메이션 ───
const fadeSlideIn = keyframes`
    0%   { opacity: 0; transform: translateY(24px) scale(0.96); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
`;
const orbFloat = keyframes`
    0%, 100% { transform: translateY(0) scale(1); }
    50%      { transform: translateY(-6px) scale(1.02); }
`;
const orbGlow = keyframes`
    0%, 100% { opacity: 0.85; transform: translate(-50%, -50%) scale(1); }
    50%      { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
`;
const donutReveal = keyframes`
    0%   { stroke-dashoffset: var(--circumference); }
    100% { stroke-dashoffset: var(--final-offset); }
`;
const barGrow = keyframes`
    0%   { width: 0%; }
    100% { width: var(--bar-width); }
`;
const shimmer = keyframes`
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
`;
const charBounce = keyframes`
    0%, 100% { transform: translateY(0) scale(1); }
    50%      { transform: translateY(-8px) scale(1.02); }
`;
const bubbleDrift = keyframes`
    0%   { transform: translate(0, 0) scale(1); }
    25%  { transform: translate(30px, -20px) scale(1.08); }
    50%  { transform: translate(-10px, -40px) scale(0.95); }
    75%  { transform: translate(-30px, -15px) scale(1.05); }
    100% { transform: translate(0, 0) scale(1); }
`;

// ─── 타입 ───
interface ChartSegment {
    key: keyof EmotionScores;
    value: number;
    label: string;
    emoji: string;
    color: string;
    dash: number;
    offset: number;
}

function Animated({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    return (
        <Box sx={{ animation: `${fadeSlideIn} 0.5s ease-out ${delay}s both` }}>
            {children}
        </Box>
    );
}

function getYesterdayData(): ShareableMoodData | null {
    if (typeof window === "undefined") return null;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const key = `mymood_${yesterday.toISOString().slice(0, 10)}`;
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    } catch { return null; }
}

// ─── 도넛 차트 (인사이드아웃 버전) ───
function DonutChart({ scores }: { scores: EmotionScores }) {
    const size = 240;
    const strokeWidth = 32;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const sorted = useMemo(() =>
            (Object.keys(scores) as (keyof EmotionScores)[])
                .map(key => ({ key, value: scores[key], ...EMOTION_META[key] }))
                .sort((a, b) => b.value - a.value)
        , [scores]);

    const segments = useMemo(() => {
        return sorted.reduce<{ items: ChartSegment[]; total: number }>(
            (acc, seg) => {
                const dash = (seg.value / 100) * circumference;
                const offset = circumference - acc.total;
                return {
                    items: [...acc.items, { ...seg, dash, offset }],
                    total: acc.total + dash,
                };
            },
            { items: [], total: 0 }
        ).items;
    }, [sorted, circumference]);

    const dominant = sorted[0];
    const dominantIO = IO_COLORS[dominant.key];

    return (
        <Box sx={{ position: "relative", width: size, height: size, mx: "auto" }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={strokeWidth} />
                {segments.map((seg, i) => (
                    <circle
                        key={seg.key}
                        cx={size / 2} cy={size / 2} r={radius}
                        fill="none"
                        stroke={IO_COLORS[seg.key].main}
                        strokeWidth={strokeWidth}
                        strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
                        strokeDashoffset={seg.offset}
                        strokeLinecap="round"
                        transform={`rotate(-90 ${size / 2} ${size / 2})`}
                        style={{
                            opacity: 0.9,
                            filter: `drop-shadow(0 0 4px ${IO_COLORS[seg.key].glow})`,
                            animation: `${donutReveal} 1.2s ease-out ${0.4 + i * 0.15}s both`,
                            "--circumference": `${circumference}px`,
                            "--final-offset": `${seg.offset}px`,
                        } as React.CSSProperties}
                    />
                ))}
            </svg>
            {/* 중앙 감정 구슬 */}
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    background: `radial-gradient(circle at 40% 35%, ${dominantIO.main}40, transparent)`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 0 24px ${dominantIO.glow}`,
                    animation: `${orbGlow} 3s ease-in-out infinite`,
                }}
            >
                <Typography sx={{ fontSize: "2.2rem", lineHeight: 1 }}>{dominant.emoji}</Typography>
                <Typography sx={{ color: dominantIO.main, fontWeight: 800, fontSize: "1.5rem", mt: 0.3 }}>{dominant.value}%</Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.7rem", fontWeight: 600 }}>{dominant.label}</Typography>
            </Box>
        </Box>
    );
}

// ─── 메인 컴포넌트 ───
export default function MymoodResultClient() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [pageState, setPageState] = useState<{
        result: ShareableMoodData | null;
        yesterday: ShareableMoodData | null;
        isShared: boolean;
    }>({ result: null, yesterday: null, isShared: false });

    const [snack, setSnack] = useState({ open: false, msg: "" });

    useEffect(() => {
        const loadData = () => {
            const dataParam = searchParams.get("r");

            if (dataParam) {
                const decoded = decodeMoodCompact(dataParam);
                if (decoded) {
                    setPageState({ result: decoded, yesterday: null, isShared: true });
                } else {
                    router.replace("/mymood/test-mymood");
                }
                return;
            }

            const raw = sessionStorage.getItem("mymoodResult");
            if (!raw) {
                router.replace("/mymood/test-mymood");
                return;
            }

            try {
                const parsed = JSON.parse(raw);
                setPageState({
                    result: parsed,
                    yesterday: getYesterdayData(),
                    isShared: false
                });
            } catch {
                router.replace("/mymood/test-mymood");
            }
        };

        const timer = setTimeout(loadData, 0);
        return () => clearTimeout(timer);
    }, [searchParams, router]);

    const { result, yesterday, isShared } = pageState;

    const sortedEmotions = useMemo(() => {
        if (!result) return [];
        return (Object.keys(result.scores) as (keyof EmotionScores)[])
            .map(key => ({ key, value: result.scores[key], ...EMOTION_META[key] }))
            .sort((a, b) => b.value - a.value);
    }, [result]);

    const handleShare = useCallback(async () => {
        if (!result) return;
        const shareUrl = `${window.location.origin}/mymood/result-mymood?r=${encodeMoodCompact(result)}`;
        if (navigator.share) {
            try { await navigator.share({ title: "감정 점수 | 심랩", url: shareUrl }); } catch { /* ignore */ }
        } else {
            const ok = await copyToClipboard(shareUrl);
            setSnack({ open: true, msg: ok ? "링크가 복사되었습니다!" : "링크 복사에 실패했습니다." });
        }
    }, [result]);

    if (!result) return null;

    const dominantKey = getDominantEmotion(result.scores);
    const dominantIO = IO_COLORS[dominantKey];
    const dominantMeta = EMOTION_META[dominantKey];

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(170deg, #1a103d 0%, #251758 35%, #1e1250 65%, #0f0a2e 100%)",
                pt: { xs: 8, sm: 10 },
                pb: 10,
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* ─── 배경 물방울 (스크린세이버) ─── */}
            {[
                { top: "3%", left: "5%", size: 50, color: "#FFD93D", dur: 8, delay: 0 },
                { top: "10%", right: "7%", size: 70, color: "#FF6B6B", dur: 10, delay: 1 },
                { top: "22%", left: "82%", size: 38, color: "#69D2A0", dur: 7.5, delay: 0.5 },
                { top: "32%", left: "2%", size: 60, color: "#7B8CDE", dur: 9, delay: 2 },
                { top: "48%", right: "4%", size: 45, color: "#E891CF", dur: 11, delay: 0.8 },
                { top: "15%", left: "42%", size: 32, color: "#FFD93D", dur: 12, delay: 3 },
                { top: "58%", left: "10%", size: 42, color: "#FF6B6B", dur: 9.5, delay: 1.5 },
                { top: "68%", right: "12%", size: 55, color: "#69D2A0", dur: 10.5, delay: 2.5 },
                { top: "80%", left: "28%", size: 35, color: "#7B8CDE", dur: 8.5, delay: 0.3 },
                { top: "88%", right: "22%", size: 48, color: "#E891CF", dur: 11.5, delay: 1.8 },
            ].map((orb, i) => (
                <Box
                    key={i}
                    sx={{
                        position: "absolute",
                        top: orb.top,
                        left: orb.left,
                        right: orb.right,
                        width: { xs: orb.size * 0.7, sm: orb.size },
                        height: { xs: orb.size * 0.7, sm: orb.size },
                        borderRadius: "50%",
                        background: `radial-gradient(circle at 40% 40%, ${orb.color}15, ${orb.color}05)`,
                        animation: `${bubbleDrift} ${orb.dur}s ease-in-out ${orb.delay}s infinite`,
                        pointerEvents: "none",
                    }}
                />
            ))}

            <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
                {isShared && (
                    <Animated>
                        <Box
                            sx={{
                                bgcolor: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: 50,
                                py: 0.8,
                                px: 2.5,
                                mb: 2,
                                textAlign: "center",
                                width: "fit-content",
                                mx: "auto",
                            }}
                        >
                            <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.78rem" }}>
                                공유된 결과입니다
                            </Typography>
                        </Box>
                    </Animated>
                )}

                {/* ─── 타이틀 ─── */}
                <Animated>
                    <Stack spacing={1} sx={{ alignItems: "center", mb: 4 }}>
                        <Typography
                            sx={{
                                fontSize: "0.7rem",
                                letterSpacing: "0.25em",
                                fontWeight: 600,
                                color: `${dominantIO.main}99`,
                            }}
                        >
                            MOOD REPORT
                        </Typography>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 800,
                                textAlign: "center",
                                background: `linear-gradient(90deg, #FFD93D, #FF6B6B, #E891CF, #69D2A0, #7B8CDE)`,
                                backgroundSize: "200% auto",
                                backgroundClip: "text",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                animation: `${shimmer} 5s linear infinite`,
                                fontSize: { xs: "1.6rem", sm: "2rem" },
                            }}
                        >
                            오늘의 감정 리포트
                        </Typography>
                        <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem" }}>
                            {result.date}
                        </Typography>
                    </Stack>
                </Animated>

                {/* ─── 감정 캐릭터 이미지 ─── */}
                <Animated delay={0.1}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
                        <Box
                            sx={{
                                position: "relative",
                                width: { xs: 200, sm: 240 },
                                height: { xs: 200, sm: 240 },
                                borderRadius: 5,
                                overflow: "hidden",
                                boxShadow: `0 8px 32px ${dominantIO.glow}, 0 0 64px ${dominantIO.glow}`,
                                animation: `${charBounce} 3s ease-in-out infinite`,
                            }}
                        >
                            <Image
                                src={`/mood-character/${dominantKey}.png`}
                                alt={`${dominantMeta.label} 캐릭터`}
                                fill
                                sizes="(max-width: 600px) 200px, 240px"
                                style={{ objectFit: "cover" }}
                                priority
                            />
                        </Box>
                        <Typography sx={{ color: "rgba(255,255,255,0.18)", fontSize: "0.58rem", mt: 1 }}>
                            Image generated by Gemini (Nano-Banana)
                        </Typography>
                    </Box>
                </Animated>

                {/* ─── 도넛 차트 카드 ─── */}
                <Animated delay={0.15}>
                    <Box
                        sx={{
                            bgcolor: "rgba(255,255,255,0.03)",
                            backdropFilter: "blur(16px)",
                            borderRadius: 5,
                            border: "1px solid rgba(255,255,255,0.06)",
                            p: { xs: 3, sm: 4 },
                            mb: 3,
                        }}
                    >
                        <DonutChart scores={result.scores} />

                        {/* 감정 구슬 레전드 */}
                        <Stack direction="row" sx={{ flexWrap: "wrap", justifyContent: "center", gap: { xs: 1, sm: 1.5 }, mt: 3 }}>
                            {sortedEmotions.map(em => (
                                <Stack
                                    key={em.key}
                                    direction="row"
                                    spacing={0.7}
                                    sx={{
                                        alignItems: "center",
                                        bgcolor: `${IO_COLORS[em.key].main}10`,
                                        borderRadius: 50,
                                        px: 1.2,
                                        py: 0.4,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: "50%",
                                            background: `radial-gradient(circle at 35% 35%, ${IO_COLORS[em.key].main}, ${IO_COLORS[em.key].main}88)`,
                                            boxShadow: `0 0 4px ${IO_COLORS[em.key].glow}`,
                                        }}
                                    />
                                    <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.72rem", fontWeight: 500 }}>
                                        {em.label} {em.value}%
                                    </Typography>
                                </Stack>
                            ))}
                        </Stack>
                    </Box>
                </Animated>

                {/* ─── 바 차트 ─── */}
                <Animated delay={0.25}>
                    <Box
                        sx={{
                            bgcolor: "rgba(255,255,255,0.03)",
                            backdropFilter: "blur(16px)",
                            borderRadius: 4,
                            border: "1px solid rgba(255,255,255,0.06)",
                            p: 3,
                            mb: 3,
                        }}
                    >
                        <Stack spacing={2.5}>
                            {sortedEmotions.map((em, i) => {
                                const io = IO_COLORS[em.key];
                                return (
                                    <Box key={em.key}>
                                        <Stack direction="row" sx={{ justifyContent: "space-between", mb: 0.8, alignItems: "center" }}>
                                            <Stack direction="row" spacing={0.8} sx={{ alignItems: "center" }}>
                                                {/* 미니 감정 구슬 */}
                                                <Box
                                                    sx={{
                                                        width: 28,
                                                        height: 28,
                                                        borderRadius: "50%",
                                                        background: `radial-gradient(circle at 35% 35%, ${io.main}dd, ${io.main}66)`,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontSize: "0.85rem",
                                                        boxShadow: `0 0 8px ${io.glow}`,
                                                    }}
                                                >
                                                    {em.emoji}
                                                </Box>
                                                <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.88rem", fontWeight: 600 }}>
                                                    {em.label}
                                                </Typography>
                                            </Stack>
                                            <Typography sx={{ color: io.main, fontWeight: 700, fontSize: "1rem" }}>
                                                {em.value}%
                                            </Typography>
                                        </Stack>
                                        <Box
                                            sx={{
                                                width: "100%",
                                                height: 10,
                                                bgcolor: "rgba(255,255,255,0.04)",
                                                borderRadius: 5,
                                                overflow: "hidden",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    "--bar-width": `${em.value}%`,
                                                    height: "100%",
                                                    background: `linear-gradient(90deg, ${io.main}cc, ${io.main})`,
                                                    borderRadius: 5,
                                                    animation: `${barGrow} 1s ease-out ${0.5 + i * 0.1}s both`,
                                                    boxShadow: `0 0 8px ${io.glow}`,
                                                } as React.CSSProperties}
                                            />
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Stack>
                    </Box>
                </Animated>

                {/* ─── 코멘트 카드 ─── */}
                <Animated delay={0.35}>
                    <Box
                        sx={{
                            bgcolor: "rgba(255,255,255,0.03)",
                            backdropFilter: "blur(16px)",
                            borderRadius: 4,
                            p: 3,
                            mb: 3,
                            position: "relative",
                            overflow: "hidden",
                            border: "1px solid rgba(255,255,255,0.06)",
                            // 왼쪽 구슬 장식
                            "&::before": {
                                content: '""',
                                position: "absolute",
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: 4,
                                borderRadius: "4px 0 0 4px",
                                background: `linear-gradient(180deg, ${dominantIO.main}, ${dominantIO.main}66)`,
                            },
                        }}
                    >
                        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1.5 }}>
                            <Box
                                sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: "50%",
                                    background: `radial-gradient(circle at 35% 35%, ${dominantIO.main}cc, ${dominantIO.main}55)`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "1.1rem",
                                    boxShadow: `0 0 12px ${dominantIO.glow}`,
                                }}
                            >
                                {dominantMeta.emoji}
                            </Box>
                            <Typography sx={{ color: dominantIO.main, fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em" }}>
                                {dominantMeta.label} 메시지
                            </Typography>
                        </Stack>
                        <Typography sx={{ color: "rgba(255,255,255,0.75)", textAlign: "left", lineHeight: 1.7, pl: 0.5, fontSize: "0.95rem" }}>
                            &ldquo;{result.comment}&rdquo;
                        </Typography>
                    </Box>
                </Animated>

                {/* ─── 어제 비교 ─── */}
                {!isShared && yesterday && (
                    <Animated delay={0.45}>
                        <Box
                            sx={{
                                bgcolor: "rgba(255,255,255,0.03)",
                                backdropFilter: "blur(16px)",
                                borderRadius: 4,
                                p: 3,
                                mb: 3,
                                border: "1px solid rgba(255,255,255,0.06)",
                            }}
                        >
                            <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: "0.68rem", textAlign: "center", mb: 2, letterSpacing: "0.2em", fontWeight: 600 }}>
                                VS YESTERDAY
                            </Typography>
                            <Stack spacing={1.8}>
                                {(Object.keys(result.scores) as (keyof EmotionScores)[]).map(key => {
                                    const diff = result.scores[key] - yesterday.scores[key];
                                    const io = IO_COLORS[key];
                                    return (
                                        <Stack key={key} direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                                            <Stack direction="row" spacing={0.8} sx={{ alignItems: "center" }}>
                                                <Box
                                                    sx={{
                                                        width: 22,
                                                        height: 22,
                                                        borderRadius: "50%",
                                                        background: `radial-gradient(circle at 35% 35%, ${io.main}aa, ${io.main}44)`,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontSize: "0.65rem",
                                                    }}
                                                >
                                                    {EMOTION_META[key].emoji}
                                                </Box>
                                                <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.82rem" }}>
                                                    {EMOTION_META[key].label}
                                                </Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                                                <Typography sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>{result.scores[key]}%</Typography>
                                                <Box sx={{ minWidth: 44 }}>
                                                    {diff > 0 ? (
                                                        <Stack direction="row" spacing={0.3} sx={{ color: "#69D2A0", alignItems: "center" }}>
                                                            <TrendingUp size={13} />
                                                            <Typography sx={{ fontSize: "0.75rem", fontWeight: 600 }}>+{diff}</Typography>
                                                        </Stack>
                                                    ) : diff < 0 ? (
                                                        <Stack direction="row" spacing={0.3} sx={{ color: "#FF6B6B", alignItems: "center" }}>
                                                            <TrendingDown size={13} />
                                                            <Typography sx={{ fontSize: "0.75rem", fontWeight: 600 }}>{diff}</Typography>
                                                        </Stack>
                                                    ) : (
                                                        <Stack direction="row" spacing={0.3} sx={{ color: "rgba(255,255,255,0.25)", alignItems: "center" }}>
                                                            <Minus size={13} />
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

                {/* ─── 액션 버튼 ─── */}
                <Animated delay={0.55}>
                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                        {isShared ? (
                            <Button
                                fullWidth
                                variant="contained"
                                href="/mymood"
                                startIcon={<Sparkles size={18} />}
                                sx={{
                                    py: 1.6,
                                    borderRadius: 50,
                                    fontWeight: 700,
                                    fontSize: "0.95rem",
                                    background: "linear-gradient(135deg, #FFD93D 0%, #FF6B6B 50%, #E891CF 100%)",
                                    color: "#1a103d",
                                    textTransform: "none",
                                    boxShadow: "0 4px 20px rgba(255,107,107,0.3)",
                                    "&:hover": {
                                        background: "linear-gradient(135deg, #FFE066 0%, #FF8585 50%, #F0A8DD 100%)",
                                    },
                                }}
                            >
                                나도 체크하기
                            </Button>
                        ) : (
                            <>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={() => router.push("/mymood/test-mymood")}
                                    startIcon={<RotateCcw size={18} />}
                                    sx={{
                                        py: 1.5,
                                        borderRadius: 50,
                                        color: "rgba(255,255,255,0.7)",
                                        borderColor: "rgba(255,255,255,0.12)",
                                        textTransform: "none",
                                        fontWeight: 600,
                                        "&:hover": {
                                            borderColor: "rgba(255,255,255,0.25)",
                                            bgcolor: "rgba(255,255,255,0.04)",
                                        },
                                    }}
                                >
                                    다시하기
                                </Button>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleShare}
                                    startIcon={<Share2 size={18} />}
                                    sx={{
                                        py: 1.5,
                                        borderRadius: 50,
                                        fontWeight: 700,
                                        background: "linear-gradient(135deg, #FFD93D 0%, #FF6B6B 50%, #E891CF 100%)",
                                        color: "#1a103d",
                                        textTransform: "none",
                                        boxShadow: "0 4px 20px rgba(255,107,107,0.25)",
                                        "&:hover": {
                                            background: "linear-gradient(135deg, #FFE066 0%, #FF8585 50%, #F0A8DD 100%)",
                                        },
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