"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Snackbar from "@mui/material/Snackbar";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { keyframes } from "@mui/material/styles";
import { RotateCcw, Camera, Share2 } from "lucide-react";
import html2canvas from "html2canvas";

/**
 * 사주/운세 결과 클라이언트 컴포넌트
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

const ELEMENT_COLORS: Record<string, { bar: string; label: string }> = {
    "목(木)": { bar: "#3a7d44", label: "木" },
    "화(火)": { bar: "#c0392b", label: "火" },
    "토(土)": { bar: "#b8860b", label: "土" },
    "금(金)": { bar: "#bdc3c7", label: "金" },
    "수(水)": { bar: "#2471a3", label: "수" },
};

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

    // 알림 및 컨펌 상태
    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState("");
    const [confirmOpen, setConfirmOpen] = useState(false);

    // ─── 데이터 로드 (ESLint 에러 해결 방식) ───
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

            // setTimeout을 사용하여 렌더링 사이클이 완료된 후 상태를 업데이트합니다.
            // 이는 'cascading renders' 에러를 방지하는 권장 비동기 방식입니다.
            const timeoutId = setTimeout(() => {
                setData(parsed);
            }, 0);

            return () => clearTimeout(timeoutId);
        } catch {
            router.replace("/fortune/input");
        }
    }, [router]);

    // ─── 캡쳐 및 저장 ───
    const performCapture = async () => {
        if (!captureRef.current) return;
        setConfirmOpen(false); // 다이얼로그를 즉시 닫아 캡쳐본에 포함되지 않게 함

        // 다이얼로그가 닫히는 애니메이션 시간을 고려한 짧은 지연
        await new Promise((resolve) => setTimeout(resolve, 150));

        try {
            const el = captureRef.current;
            const savedStyles: { el: HTMLElement; animation: string; opacity: string }[] = [];

            // html2canvas는 애니메이션 중인 요소를 제대로 잡지 못하므로 일시 정지
            el.querySelectorAll("*").forEach((child) => {
                const h = child as HTMLElement;
                const cs = getComputedStyle(h);
                if (cs.animationName && cs.animationName !== "none") {
                    savedStyles.push({ el: h, animation: h.style.animation, opacity: h.style.opacity });
                    h.style.animation = "none";
                    h.style.opacity = "1";
                }
            });

            const canvas = await html2canvas(el, {
                backgroundColor: T.bgDark,
                scale: 2,
                useCORS: true,
                logging: false,
            });

            // 원래 스타일 복원
            savedStyles.forEach((s) => {
                s.el.style.animation = s.animation;
                s.el.style.opacity = s.opacity;
            });

            const link = document.createElement("a");
            link.download = `사주운세_${data?.input?.name || "결과"}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();

            setSnackMessage("오늘의 운세 카드가 저장되었습니다.");
            setSnackOpen(true);
        } catch (err) {
            setSnackMessage("이미지 생성 중 오류가 발생했습니다.");
            setSnackOpen(true);
        }
    };

    const handleScreenshotRequest = () => setConfirmOpen(true);

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
            await navigator.clipboard.writeText(shareUrl);
            setSnackMessage("공유 링크가 클립보드에 복사되었습니다.");
            setSnackOpen(true);
        }
    };

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
                            <Button fullWidth variant="outlined" onClick={handleRetry} startIcon={<RotateCcw size={18} />} sx={{ py: 1.5, color: T.gold, borderColor: T.border, borderRadius: 3, fontWeight: 700 }}>
                                다시하기
                            </Button>
                            <Button fullWidth variant="contained" onClick={handleScreenshotRequest} startIcon={<Camera size={18} />} sx={{ py: 1.5, bgcolor: T.crimson, color: T.cream, borderRadius: 3, fontWeight: 700, "&:hover": { bgcolor: "#802020" } }}>
                                결과 저장
                            </Button>
                        </Stack>
                        <Button fullWidth variant="outlined" onClick={handleShareLink} startIcon={<Share2 size={18} />} sx={{ py: 1.5, color: T.gold, borderColor: T.border, borderRadius: 3, fontWeight: 700 }}>
                            친구에게 추천하기
                        </Button>
                    </Stack>
                </Animated>
            </Container>

            {/* ─── 커스텀 컨펌 다이얼로그 ─── */}
            <Dialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                PaperProps={{
                    sx: {
                        bgcolor: "#0c0e1a",
                        backgroundImage: "none",
                        border: `1px solid ${T.goldDim}`,
                        borderRadius: 5,
                        minWidth: 310,
                        overflow: "hidden"
                    }
                }}
            >
                <DialogContent sx={{ textAlign: "center", pt: 5, pb: 3 }}>
                    <Typography sx={{ fontFamily: "serif", color: T.gold, fontSize: "1.6rem", mb: 2, opacity: 0.8 }}>
                        告
                    </Typography>
                    <Typography sx={{ color: T.cream, fontSize: "1rem", lineHeight: 1.7, fontWeight: 500, wordBreak: "keep-all" }}>
                        오늘의 길한 기운을 담은 운세 카드를<br />
                        이미지로 저장하여 간직하시겠습니까?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 4, px: 4 }}>
                    <Button onClick={() => setConfirmOpen(false)} sx={{ color: T.goldDim, fontWeight: 600, flex: 1 }}>
                        취소
                    </Button>
                    <Button onClick={performCapture} variant="contained" sx={{ bgcolor: T.crimson, color: T.cream, fontWeight: 700, flex: 1, "&:hover": { bgcolor: "#802020" } }}>
                        저장하기
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackOpen}
                autoHideDuration={3000}
                onClose={() => setSnackOpen(false)}
                message={snackMessage}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                sx={{ "& .MuiSnackbarContent-root": { bgcolor: T.bgCard, color: T.cream, border: `1px solid ${T.border}`, borderRadius: 3 } }}
            />
        </Box>
    );
}