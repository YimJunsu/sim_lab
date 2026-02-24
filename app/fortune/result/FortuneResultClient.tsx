"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import { keyframes } from "@mui/material/styles";
import { RotateCcw, Camera, Share2 } from "lucide-react";
import { toBlob } from "html-to-image";
import { copyToClipboard } from "@/lib/clipboard";

/**
 * 사주/운세 결과 클라이언트 컴포넌트
 *
 * [캡처 동작]
 * - 모바일: Web Share API(files) → 네이티브 공유 시트 → 사진 앱에 저장 가능
 * - 데스크탑: Clipboard API → 클립보드에 이미지 복사 (PrtSc 효과, Ctrl+V로 붙여넣기)
 * - Fallback: PNG 파일 다운로드
 */

// ─── 디자인 토큰 ───
const T = {
    bgDark: "#0c0e1a",
    bgCard: "rgba(20, 18, 36, 0.85)",
    gold: "#c9a96e",
    goldLight: "#e2cc96",
    goldDim: "rgba(201, 169, 110, 0.35)",
    goldFaint: "rgba(201, 169, 110, 0.12)",
    cream: "#f0e6d3",
    creamDim: "rgba(240, 230, 211, 0.55)",
    crimson: "#a03030",
    crimsonGlow: "rgba(160, 48, 48, 0.25)",
    border: "rgba(201, 169, 110, 0.18)",
    borderHover: "rgba(201, 169, 110, 0.35)",
} as const;

// ─── 애니메이션 ───
const fadeSlideIn = keyframes`
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
`;
const glowPulse = keyframes`
    0%, 100% { box-shadow: 0 0 16px rgba(201, 169, 110, 0.08); }
    50% { box-shadow: 0 0 32px rgba(201, 169, 110, 0.18); }
`;
const gentleFloat = keyframes`
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
`;

// ─── 타입 정의 ───
interface FortuneData {
    overall: string;
    love: string;
    wealth: string;
    health: string;
    advice: string;
    lucky: { color: string; number: string; direction: string };
}

interface SajuData {
    yearPillar: string;
    monthPillar: string;
    dayPillar: string;
    hourPillar: string | null;
    yearPillarHanja: string;
    monthPillarHanja: string;
    dayPillarHanja: string;
    hourPillarHanja: string | null;
    animal: string;
    dominantElement: string;
    elementBalance: Record<string, number>;
    yinYangBalance: { yin: number; yang: number };
}

interface FortuneInput {
    name: string;
    gender: string;
    birthYear: number;
    birthMonth: number;
    birthDay: number;
    birthHour: number | null;
}

interface PageData {
    fortune: FortuneData;
    saju: SajuData;
    input: FortuneInput;
}

const FORTUNE_CATEGORIES = [
    { key: "overall", title: "종합운", hanja: "綜合", accent: "#c9a96e" },
    { key: "love", title: "연애운", hanja: "戀愛", accent: "#d4726a" },
    { key: "wealth", title: "재물운", hanja: "財物", accent: "#c9a96e" },
    { key: "health", title: "건강운", hanja: "健康", accent: "#5d9b6b" },
] as const;

function Animated({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    return (
        <Box sx={{ animation: `${fadeSlideIn} 0.45s ease-out ${delay}s both` }}>
            {children}
        </Box>
    );
}

export default function FortuneResultClient() {
    const router = useRouter();
    const captureRef = useRef<HTMLDivElement>(null);
    const [data, setData] = useState<PageData | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState("");

    // ─── 데이터 로드 ───
    useEffect(() => {
        const resultRaw = sessionStorage.getItem("fortuneResult");
        const inputRaw = sessionStorage.getItem("fortuneInput");

        if (!resultRaw || !inputRaw) {
            router.replace("/fortune/input");
            return;
        }

        try {
            const result = JSON.parse(resultRaw);
            const parsed: PageData = {
                fortune: result.fortune,
                saju: result.saju,
                input: JSON.parse(inputRaw),
            };
            const timeoutId = setTimeout(() => setData(parsed), 0);
            return () => clearTimeout(timeoutId);
        } catch {
            router.replace("/fortune/input");
        }
    }, [router]);

    // ─── 애니메이션 일시 정지 헬퍼 ───
    const pauseAnimations = (el: HTMLElement) => {
        const saved: { el: HTMLElement; animation: string; opacity: string }[] = [];
        el.querySelectorAll<HTMLElement>("*").forEach((child) => {
            const cs = getComputedStyle(child);
            if (cs.animationName && cs.animationName !== "none") {
                saved.push({ el: child, animation: child.style.animation, opacity: child.style.opacity });
                child.style.animation = "none";
                child.style.opacity = "1";
            }
        });
        return saved;
    };

    const resumeAnimations = (saved: { el: HTMLElement; animation: string; opacity: string }[]) => {
        saved.forEach((s) => {
            s.el.style.animation = s.animation;
            s.el.style.opacity = s.opacity;
        });
    };

    // ─── 캡처 핸들러 ───
    // 동작 우선순위:
    //   1. 모바일 (Web Share API + files 지원) → 네이티브 공유 시트
    //   2. 데스크탑 (Clipboard API) → 클립보드 복사 (PrtSc 효과)
    //   3. Fallback → PNG 다운로드
    const handleCapture = async () => {
        if (!captureRef.current || isCapturing || !data) return;
        setIsCapturing(true);

        const el = captureRef.current;
        const savedStyles = pauseAnimations(el);

        let blob: Blob | null = null;
        try {
            blob = await toBlob(el, {
                backgroundColor: T.bgDark,
                pixelRatio: 2,
                cacheBust: true,
            });
        } catch {
            resumeAnimations(savedStyles);
            setSnackMessage("이미지 생성 중 오류가 발생했습니다.");
            setSnackOpen(true);
            setIsCapturing(false);
            return;
        }

        resumeAnimations(savedStyles);

        if (!blob) {
            setSnackMessage("이미지 생성 중 오류가 발생했습니다.");
            setSnackOpen(true);
            setIsCapturing(false);
            return;
        }

        const filename = `사주운세_${data.input.name}.png`;
        const file = new File([blob], filename, { type: "image/png" });

        try {
            // 1) 모바일: Web Share API (files 지원 여부 확인)
            if (
                typeof navigator.share === "function" &&
                typeof navigator.canShare === "function" &&
                navigator.canShare({ files: [file] })
            ) {
                await navigator.share({
                    files: [file],
                    title: `${data.input.name}님의 오늘의 운세`,
                    text: "심랩에서 확인한 오늘의 운세 카드",
                });
                return;
            }

            // 2) 데스크탑: Clipboard API → 클립보드에 이미지 복사 (PrtSc 효과)
            const ClipboardItemClass = window.ClipboardItem as typeof ClipboardItem | undefined;
            if (
                typeof navigator.clipboard?.write === "function" &&
                typeof ClipboardItemClass !== "undefined"
            ) {
                try {
                    await navigator.clipboard.write([
                        new ClipboardItemClass({ "image/png": blob }),
                    ]);
                    setSnackMessage("클립보드에 복사됐어요! Ctrl+V로 붙여넣기 하세요 📋");
                    setSnackOpen(true);
                    return;
                } catch {
                    // 권한 거부 시 fallback으로 계속
                }
            }

            // 3) Fallback: 파일 다운로드
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.download = filename;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
            setSnackMessage("운세 카드가 저장됐어요!");
            setSnackOpen(true);
        } catch (err) {
            // 공유 취소(AbortError)는 오류 메시지 없이 처리
            const isDismissed =
                err instanceof Error &&
                (err.name === "AbortError" || err.message.toLowerCase().includes("cancel"));
            if (!isDismissed) {
                setSnackMessage("이미지 생성 중 오류가 발생했습니다.");
                setSnackOpen(true);
            }
        } finally {
            setIsCapturing(false);
        }
    };

    // ─── 링크 공유 ───
    const handleShareLink = async () => {
        const shareUrl = `${window.location.origin}/fortune/input`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "사주/미니 운세 | 심랩",
                    text: "나의 오늘의 운세는 어떨까? 지금 확인해보세요!",
                    url: shareUrl,
                });
            } catch { /* 취소 처리 */ }
        } else {
            const ok = await copyToClipboard(shareUrl);
            setSnackMessage(ok ? "공유 링크가 클립보드에 복사되었습니다." : "링크 복사에 실패했습니다.");
            setSnackOpen(true);
        }
    };

    // ─── 다시하기 ───
    const handleRetry = () => {
        sessionStorage.removeItem("fortuneResult");
        sessionStorage.removeItem("fortuneInput");
        router.push("/fortune/input");
    };

    if (!data) {
        return (
            <Box sx={{ minHeight: "100vh", bgcolor: T.bgDark, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography sx={{ color: T.goldDim, fontFamily: "serif", letterSpacing: "0.1em" }}>
                    운명의 흐름을 읽는 중...
                </Typography>
            </Box>
        );
    }

    const { fortune, saju, input } = data;
    const pillars = [
        { label: "年柱", kr: saju.yearPillar, hj: saju.yearPillarHanja },
        { label: "月柱", kr: saju.monthPillar, hj: saju.monthPillarHanja },
        { label: "日柱", kr: saju.dayPillar, hj: saju.dayPillarHanja },
        { label: "時柱", kr: saju.hourPillar || "미상", hj: saju.hourPillarHanja || "—" },
    ];

    return (
        <Box sx={{
            position: "relative",
            minHeight: "100vh",
            background: `linear-gradient(175deg, ${T.bgDark} 0%, #10121f 40%, #161028 70%, #0e0c18 100%)`,
            pt: { xs: 8, sm: 12 },
            pb: 10,
            overflow: "hidden",
        }}>
            <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>

                {/* ─── 캡쳐 영역 ─── */}
                <Box ref={captureRef} sx={{ p: { xs: 1, sm: 0 } }}>
                    <Animated>
                        <Stack spacing={1} sx={{ alignItems: "center", mb: 4 }}>
                            <Typography sx={{ fontFamily: "serif", fontSize: "1.8rem", color: T.gold, animation: `${gentleFloat} 4s ease-in-out infinite` }}>
                                命
                            </Typography>
                            <Typography variant="h5" sx={{ color: T.cream, fontWeight: 700, textAlign: "center" }}>
                                {input.name}님의 오늘의 운세
                            </Typography>
                            <Typography sx={{ color: T.goldDim, fontSize: "0.8rem" }}>
                                {input.birthYear}. {input.birthMonth}. {input.birthDay} · {saju.animal}띠
                            </Typography>
                        </Stack>
                    </Animated>

                    <Animated delay={0.1}>
                        <Box sx={{ bgcolor: T.bgCard, borderRadius: 4, border: `1px solid ${T.border}`, borderTop: `3px solid ${T.gold}`, p: 3, mb: 3, animation: `${glowPulse} 5s ease-in-out infinite` }}>
                            <Typography sx={{ fontFamily: "serif", color: T.gold, fontSize: "0.75rem", textAlign: "center", letterSpacing: "0.3em", mb: 2 }}>
                                四 柱 八 字
                            </Typography>
                            <Stack direction="row" spacing={1.5} sx={{ justifyContent: "center" }}>
                                {pillars.map((p, i) => (
                                    <Stack key={i} spacing={0.5} sx={{ alignItems: "center" }}>
                                        <Typography sx={{ fontFamily: "serif", color: T.goldDim, fontSize: "0.65rem" }}>{p.label}</Typography>
                                        <Box sx={{ width: 52, py: 1, bgcolor: "rgba(201, 169, 110, 0.08)", borderRadius: "8px 8px 0 0", border: `1px solid ${T.border}`, textAlign: "center" }}>
                                            <Typography sx={{ fontFamily: "serif", color: T.goldLight, fontSize: "1.3rem", fontWeight: 700 }}>{p.hj !== "—" ? p.hj[0] : "—"}</Typography>
                                        </Box>
                                        <Box sx={{ width: 52, py: 1, bgcolor: "rgba(160, 48, 48, 0.08)", borderRadius: "0 0 8px 8px", border: `1px solid ${T.border}`, borderTop: "none", textAlign: "center" }}>
                                            <Typography sx={{ fontFamily: "serif", color: T.cream, fontSize: "1.3rem", fontWeight: 700 }}>{p.hj !== "—" ? p.hj[1] : "—"}</Typography>
                                        </Box>
                                    </Stack>
                                ))}
                            </Stack>
                        </Box>
                    </Animated>

                    <Stack spacing={2}>
                        {FORTUNE_CATEGORIES.map((cat, i) => (
                            <Animated key={cat.key} delay={0.2 + i * 0.1}>
                                <Box sx={{ bgcolor: T.bgCard, borderRadius: 3, border: `1px solid ${T.border}`, p: 2.5, borderLeft: `4px solid ${cat.accent}` }}>
                                    <Typography sx={{ color: T.goldLight, fontWeight: 700, mb: 0.5, fontSize: "0.9rem" }}>
                                        {cat.title} <Box component="span" sx={{ fontFamily: "serif", opacity: 0.5, ml: 0.5 }}>{cat.hanja}</Box>
                                    </Typography>
                                    <Typography sx={{ color: T.creamDim, lineHeight: 1.6, fontSize: "0.88rem" }}>
                                        {fortune[cat.key]}
                                    </Typography>
                                </Box>
                            </Animated>
                        ))}
                    </Stack>

                    <Animated delay={0.6}>
                        <Box sx={{ mt: 3, p: 3, bgcolor: "rgba(160, 48, 48, 0.05)", borderRadius: 3, border: `1px dashed ${T.crimsonGlow}`, textAlign: "center" }}>
                            <Typography sx={{ color: T.gold, fontFamily: "serif", fontSize: "0.75rem", mb: 1, letterSpacing: "0.2em" }}>今日之言</Typography>
                            <Typography sx={{ color: T.cream, fontStyle: "italic", fontSize: "0.95rem" }}>
                                {`"${fortune.advice}"`}
                            </Typography>
                        </Box>
                    </Animated>
                </Box>

                {/* ─── 하단 액션 버튼 ─── */}
                <Animated delay={0.8}>
                    <Stack spacing={1.5} sx={{ mt: 5 }}>
                        <Stack direction="row" spacing={1.5}>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={handleRetry}
                                startIcon={<RotateCcw size={18} />}
                                sx={{ py: 1.5, color: T.gold, borderColor: T.border, borderRadius: 3, fontWeight: 700 }}
                            >
                                다시하기
                            </Button>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleCapture}
                                disabled={isCapturing}
                                startIcon={
                                    isCapturing
                                        ? <CircularProgress size={16} sx={{ color: T.cream }} />
                                        : <Camera size={18} />
                                }
                                sx={{
                                    py: 1.5,
                                    bgcolor: T.crimson,
                                    color: T.cream,
                                    borderRadius: 3,
                                    fontWeight: 700,
                                    "&:hover": { bgcolor: "#802020" },
                                    "&.Mui-disabled": { bgcolor: "rgba(160,48,48,0.4)", color: "rgba(240,230,211,0.5)" },
                                }}
                            >
                                {isCapturing ? "캡처 중..." : "결과 캡처"}
                            </Button>
                        </Stack>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={handleShareLink}
                            startIcon={<Share2 size={18} />}
                            sx={{ py: 1.5, color: T.gold, borderColor: T.border, borderRadius: 3, fontWeight: 700 }}
                        >
                            친구에게 추천하기
                        </Button>
                    </Stack>
                </Animated>
            </Container>

            <Snackbar
                open={snackOpen}
                autoHideDuration={3500}
                onClose={() => setSnackOpen(false)}
                message={snackMessage}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                sx={{
                    "& .MuiSnackbarContent-root": {
                        bgcolor: T.bgCard,
                        color: T.cream,
                        border: `1px solid ${T.border}`,
                        borderRadius: 3,
                    },
                }}
            />
        </Box>
    );
}