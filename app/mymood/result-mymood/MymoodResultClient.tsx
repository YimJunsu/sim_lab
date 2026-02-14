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
import { RotateCcw, Share2, Sparkles, TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
    type EmotionScores,
    type ShareableMoodData,
    EMOTION_META,
    getDominantEmotion,
    getRelatedContent,
} from "@/lib/mymood-questions";

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

// ─── 타입 인터페이스 ───
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
        <Box sx={{ animation: `${fadeSlideIn} 0.45s ease-out ${delay}s both` }}>
            {children}
        </Box>
    );
}

// ─── 유틸리티 ───
function encodeMoodData(data: ShareableMoodData): string {
    try {
        return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    } catch { return ""; }
}

function decodeMoodData(encoded: string): ShareableMoodData | null {
    try {
        const parsed = JSON.parse(decodeURIComponent(escape(atob(encoded))));
        return (parsed?.scores && parsed?.comment) ? (parsed as ShareableMoodData) : null;
    } catch { return null; }
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

// ─── 도넛 차트 ───
function DonutChart({ scores }: { scores: EmotionScores }) {
    const size = 220;
    const strokeWidth = 28;
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

    return (
        <Box sx={{ position: "relative", width: size, height: size, mx: "auto" }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(155,122,232,0.06)" strokeWidth={strokeWidth} />
                {segments.map((seg, i) => (
                    <circle
                        key={seg.key}
                        cx={size/2} cy={size/2} r={radius}
                        fill="none"
                        stroke={seg.color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
                        strokeDashoffset={seg.offset}
                        strokeLinecap="round"
                        transform={`rotate(-90 ${size/2} ${size/2})`}
                        style={{
                            opacity: 0.85,
                            animation: `${donutReveal} 1s ease-out ${0.3 + i * 0.15}s both`,
                            "--circumference": `${circumference}px`,
                            "--final-offset": `${seg.offset}px`,
                        } as React.CSSProperties}
                    />
                ))}
            </svg>
            <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                <Typography sx={{ fontSize: "2rem", lineHeight: 1 }}>{dominant.emoji}</Typography>
                <Typography sx={{ color: dominant.color, fontWeight: 700, fontSize: "1.4rem", mt: 0.5 }}>{dominant.value}%</Typography>
                <Typography sx={{ color: T.creamDim, fontSize: "0.72rem" }}>{dominant.label}</Typography>
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
            const dataParam = searchParams.get("data");

            if (dataParam) {
                const decoded = decodeMoodData(dataParam);
                if (decoded) {
                    setPageState({ result: decoded, yesterday: null, isShared: true });
                } else {
                    router.replace("/mymood/question");
                }
                return;
            }

            const raw = sessionStorage.getItem("mymoodResult");
            if (!raw) {
                router.replace("/mymood/question");
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
                router.replace("/mymood/question");
            }
        };

        // 비동기 래핑으로 Cascading Renders 방지
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
        const shareUrl = `${window.location.origin}/mymood/result-mymood?data=${encodeMoodData(result)}`;
        if (navigator.share) {
            try { await navigator.share({ title: "감정 점수 | 심랩", url: shareUrl }); } catch { /* ignore */ }
        } else {
            await navigator.clipboard.writeText(shareUrl);
            setSnack({ open: true, msg: "링크가 복사되었습니다!" });
        }
    }, [result]);

    if (!result) return null;

    const dominantMeta = EMOTION_META[getDominantEmotion(result.scores)];

    return (
        <Box sx={{ minHeight: "100vh", background: T.bgDark, pt: { xs: 8, sm: 10 }, pb: 10 }}>
            <Container maxWidth="sm">
                {isShared && (
                    <Animated>
                        <Box sx={{ bgcolor: T.primaryFaint, border: `1px solid ${T.border}`, borderRadius: 2, p: 1, mb: 2, textAlign: "center" }}>
                            <Typography sx={{ color: T.primaryLight, fontSize: "0.8rem" }}>공유된 결과입니다</Typography>
                        </Box>
                    </Animated>
                )}

                <Animated>
                    <Stack spacing={1} sx={{ alignItems: "center", mb: 4 }}>
                        <Typography sx={{ color: T.primary, fontSize: "1.8rem", letterSpacing: "0.2em", animation: `${gentleFloat} 3s infinite` }}>감정</Typography>
                        <Typography variant="h5" sx={{ color: T.cream, fontWeight: 700 }}>오늘의 감정 점수</Typography>
                        <Typography sx={{ color: T.primaryDim, fontSize: "0.8rem" }}>{result.date}</Typography>
                    </Stack>
                </Animated>

                <Animated delay={0.1}>
                    <Box sx={{ bgcolor: T.bgCard, borderRadius: 4, border: `1px solid ${T.border}`, p: 4, mb: 3, animation: `${glowPulse} 4s infinite` }}>
                        <DonutChart scores={result.scores} />
                        <Stack direction="row" sx={{ flexWrap: "wrap", justifyContent: "center", gap: 1.5, mt: 3 }}>
                            {sortedEmotions.map(em => (
                                <Stack key={em.key} direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: em.color }} />
                                    <Typography sx={{ color: T.creamDim, fontSize: "0.75rem" }}>{em.label} {em.value}%</Typography>
                                </Stack>
                            ))}
                        </Stack>
                    </Box>
                </Animated>

                <Animated delay={0.2}>
                    <Box sx={{ bgcolor: T.bgCard, borderRadius: 3, p: 3, mb: 3, border: `1px solid ${T.border}` }}>
                        <Stack spacing={2}>
                            {sortedEmotions.map(em => (
                                <Box key={em.key}>
                                    <Stack direction="row" sx={{ justifyContent: "space-between", mb: 0.5 }}>
                                        <Typography sx={{ color: T.cream, fontSize: "0.85rem" }}>{em.emoji} {em.label}</Typography>
                                        <Typography sx={{ color: em.color, fontWeight: 700 }}>{em.value}%</Typography>
                                    </Stack>
                                    <Box sx={{ width: "100%", height: 6, bgcolor: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
                                        <Box sx={{ width: `${em.value}%`, height: "100%", bgcolor: em.color, transition: "width 1s" }} />
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                </Animated>

                <Animated delay={0.3}>
                    <Box sx={{ bgcolor: T.bgCard, borderRadius: 3, p: 3, mb: 3, borderLeft: `4px solid ${dominantMeta.color}` }}>
                        <Typography sx={{ color: T.cream, textAlign: "center" }}>
                            {`"${result.comment}"`}
                        </Typography>
                    </Box>
                </Animated>

                {!isShared && yesterday && (
                    <Animated delay={0.4}>
                        <Box sx={{ bgcolor: T.bgCard, borderRadius: 3, p: 3, mb: 3, border: `1px solid ${T.border}` }}>
                            <Typography sx={{ color: T.primaryDim, fontSize: "0.7rem", textAlign: "center", mb: 2 }}>VS YESTERDAY</Typography>
                            <Stack spacing={1.5}>
                                {(Object.keys(result.scores) as (keyof EmotionScores)[]).map(key => {
                                    const diff = result.scores[key] - yesterday.scores[key];
                                    return (
                                        <Stack key={key} direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                                            <Typography sx={{ color: T.creamDim, fontSize: "0.8rem" }}>{EMOTION_META[key].label}</Typography>
                                            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                                                <Typography sx={{ color: T.cream }}>{result.scores[key]}%</Typography>
                                                <Box sx={{ minWidth: 40 }}>
                                                    {diff > 0 ? (
                                                        <Stack direction="row" spacing={0.2} sx={{ color: "#69D2A0", alignItems: "center" }}>
                                                            <TrendingUp size={12} /><Typography sx={{ fontSize: "0.75rem" }}>{diff}</Typography>
                                                        </Stack>
                                                    ) : diff < 0 ? (
                                                        <Stack direction="row" spacing={0.2} sx={{ color: "#FF6B6B", alignItems: "center" }}>
                                                            <TrendingDown size={12} /><Typography sx={{ fontSize: "0.75rem" }}>{Math.abs(diff)}</Typography>
                                                        </Stack>
                                                    ) : (
                                                        <Stack direction="row" spacing={0.2} sx={{ color: T.primaryDim, alignItems: "center" }}>
                                                            <Minus size={12} />
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

                <Animated delay={0.5}>
                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                        {isShared ? (
                            <Button fullWidth variant="contained" href="/mymood/question" startIcon={<Sparkles size={18} />} sx={{ py: 1.5, background: `linear-gradient(135deg, ${T.primary}, ${T.accent})`, borderRadius: 2 }}>나도 체크하기</Button>
                        ) : (
                            <>
                                <Button fullWidth variant="outlined" onClick={() => router.push("/mymood/question")} startIcon={<RotateCcw size={18} />} sx={{ color: T.primary, borderColor: T.border, borderRadius: 2 }}>다시하기</Button>
                                <Button fullWidth variant="contained" onClick={handleShare} startIcon={<Share2 size={18} />} sx={{ background: `linear-gradient(135deg, ${T.primary}, ${T.accent})`, borderRadius: 2 }}>공유하기</Button>
                            </>
                        )}
                    </Stack>
                </Animated>
            </Container>
            <Snackbar open={snack.open} autoHideDuration={2000} onClose={() => setSnack(prev => ({ ...prev, open: false }))} message={snack.msg} />
        </Box>
    );
}