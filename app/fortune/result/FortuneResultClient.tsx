"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Snackbar from "@mui/material/Snackbar";
import { keyframes } from "@mui/material/styles";
import { RotateCcw, Share2, Sparkles } from "lucide-react";
import { type ShareableFortuneData } from "@/lib/fortune-share";

/**
 * 사주/운세 결과 클라이언트 컴포넌트
 *
 * 데이터 소스 우선순위:
 * 1. props.sharedData (공유 링크 ?s= 파라미터에서 서버가 디코딩)
 * 2. sessionStorage (본인이 직접 운세를 본 경우)
 * 3. 둘 다 없으면 → 입력 페이지로 리다이렉트
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

// ─── 타입 ───
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

interface Props {
  sharedData: ShareableFortuneData | null;
  /** 공유 링크였지만 만료/유효하지 않은 경우 */
  expiredShare?: boolean;
}

// 오행 전통 색상
const ELEMENT_COLORS: Record<string, { bar: string; label: string }> = {
  "목(木)": { bar: "#3a7d44", label: "木" },
  "화(火)": { bar: "#c0392b", label: "火" },
  "토(土)": { bar: "#b8860b", label: "土" },
  "금(金)": { bar: "#bdc3c7", label: "金" },
  "수(水)": { bar: "#2471a3", label: "水" },
};

// 운세 카테고리
const FORTUNE_CATEGORIES = [
  { key: "overall", title: "종합운", hanja: "綜合", accent: "#c9a96e" },
  { key: "love", title: "연애운", hanja: "戀愛", accent: "#d4726a" },
  { key: "wealth", title: "재물운", hanja: "財物", accent: "#c9a96e" },
  { key: "health", title: "건강운", hanja: "健康", accent: "#5d9b6b" },
] as const;

// 애니메이션 래퍼
function Animated({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <Box sx={{ animation: `${fadeSlideIn} 0.45s ease-out ${delay}s both` }}>
      {children}
    </Box>
  );
}

export default function FortuneResultClient({ sharedData, expiredShare }: Props) {
  const router = useRouter();
  const [fortune, setFortune] = useState<FortuneData | null>(null);
  const [saju, setSaju] = useState<SajuData | null>(null);
  const [input, setInput] = useState<FortuneInput | null>(null);
  const [isSharedView, setIsSharedView] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);

  // 데이터 로드: 공유 데이터 or sessionStorage
  useEffect(() => {
    // 1) 공유 링크에서 온 경우
    if (sharedData) {
      setFortune(sharedData.fortune);
      setSaju(sharedData.saju);
      setInput(sharedData.input);
      setIsSharedView(true);
      return;
    }

    // 1-b) 만료된 공유 링크 → 입력 페이지로 리다이렉트
    if (expiredShare) {
      router.replace("/fortune/input");
      return;
    }

    // 2) sessionStorage에서 로드 (본인 결과)
    const resultRaw = sessionStorage.getItem("fortuneResult");
    const inputRaw = sessionStorage.getItem("fortuneInput");

    if (!resultRaw || !inputRaw) {
      // 3) 데이터 없음 → 입력 페이지로 리다이렉트
      router.replace("/fortune/input");
      return;
    }

    try {
      const result = JSON.parse(resultRaw);
      setFortune(result.fortune);
      setSaju(result.saju);
      setInput(JSON.parse(inputRaw));
    } catch {
      router.replace("/fortune/input");
    }
  }, [sharedData, expiredShare, router]);

  // 공유 URL 생성 (서버에 저장 → 짧은 ID 공유)
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    if (!fortune || !saju || !input || sharing) return;

    setSharing(true);
    try {
      const shareData: ShareableFortuneData = { input, saju, fortune };
      const res = await fetch("/api/fortune/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shareData),
      });

      if (!res.ok) throw new Error("share failed");
      const { id } = await res.json();

      const shareUrl = `${window.location.origin}/fortune/result?id=${id}`;
      const shareText = `${input.name}님의 사주 운세 - "${fortune.advice}"\n\n나도 확인해보세요!`;

      if (navigator.share) {
        try {
          await navigator.share({
            title: `${input.name}님의 사주 운세 | 심랩`,
            text: shareText,
            url: shareUrl,
          });
        } catch { /* 취소 */ }
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setSnackOpen(true);
      }
    } catch {
      setSnackOpen(true);
    } finally {
      setSharing(false);
    }
  };

  // 다시하기
  const handleRetry = () => {
    sessionStorage.removeItem("fortuneResult");
    sessionStorage.removeItem("fortuneInput");
    router.push("/fortune/input");
  };

  // 로딩 / 리다이렉트 대기
  if (!fortune || !saju || !input) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: `linear-gradient(175deg, ${T.bgDark} 0%, #10121f 40%, #161028 70%, #0e0c18 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ color: T.goldDim, fontSize: "0.9rem" }}>
          결과를 불러오는 중...
        </Typography>
      </Box>
    );
  }

  // 사주 4주 데이터
  const pillars = [
    { label: "年柱", sub: "연주", kr: saju.yearPillar, hj: saju.yearPillarHanja },
    { label: "月柱", sub: "월주", kr: saju.monthPillar, hj: saju.monthPillarHanja },
    { label: "日柱", sub: "일주", kr: saju.dayPillar, hj: saju.dayPillarHanja },
    { label: "時柱", sub: "시주", kr: saju.hourPillar || "미상", hj: saju.hourPillarHanja || "—" },
  ];

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        background: `linear-gradient(175deg, ${T.bgDark} 0%, #10121f 40%, #161028 70%, #0e0c18 100%)`,
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
          border: `1px solid ${T.goldFaint}`,
          pointerEvents: "none",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 18,
            borderRadius: "50%",
            border: `1px solid rgba(201, 169, 110, 0.06)`,
          },
        }}
      />

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        {/* ─── 공유 뷰 배너 ─── */}
        {isSharedView && (
          <Animated>
            <Box
              sx={{
                bgcolor: T.goldFaint,
                border: `1px solid ${T.border}`,
                borderRadius: 2,
                px: 2,
                py: 1.2,
                mb: 2,
                textAlign: "center",
              }}
            >
              <Typography sx={{ color: T.goldLight, fontSize: "0.8rem" }}>
                {input.name}님이 공유한 운세 결과입니다
              </Typography>
            </Box>
          </Animated>
        )}

        {/* ─── 상단: 이름 + 띠 ─── */}
        <Animated>
          <Stack spacing={0.8} sx={{ alignItems: "center", mb: { xs: 3, sm: 4 } }}>
            <Typography
              sx={{
                fontFamily: "serif",
                fontSize: { xs: "1.6rem", sm: "2rem" },
                color: T.gold,
                animation: `${gentleFloat} 4s ease-in-out infinite`,
                lineHeight: 1,
                letterSpacing: "0.2em",
              }}
            >
              命
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
              {input.name}님의 오늘의 운세
            </Typography>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Box sx={{ width: 20, height: "1px", bgcolor: T.goldDim }} />
              <Typography sx={{ color: T.goldDim, fontSize: "0.78rem" }}>
                {input.birthYear}년 {input.birthMonth}월 {input.birthDay}일 · {saju.animal}띠
              </Typography>
              <Box sx={{ width: 20, height: "1px", bgcolor: T.goldDim }} />
            </Stack>
          </Stack>
        </Animated>

        {/* ─── 사주 팔자 ─── */}
        <Animated delay={0.1}>
          <Box
            sx={{
              bgcolor: T.bgCard,
              borderRadius: 3,
              border: `1px solid ${T.border}`,
              borderTop: `2px solid ${T.gold}`,
              p: { xs: 2, sm: 3 },
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
                background: `linear-gradient(90deg, transparent, ${T.gold}, transparent)`,
              },
            }}
          >
            <Typography
              sx={{
                fontFamily: "serif",
                color: T.gold,
                fontSize: "0.75rem",
                textAlign: "center",
                letterSpacing: "0.2em",
                mb: 2,
              }}
            >
              四 柱 八 字
            </Typography>

            <Stack direction="row" sx={{ justifyContent: "center", gap: { xs: 1, sm: 2 } }}>
              {pillars.map((p, i) => {
                const stemHanja = p.hj === "—" ? "—" : p.hj.charAt(0);
                const branchHanja = p.hj === "—" ? "—" : p.hj.charAt(1);
                const stemKr = p.kr === "미상" ? "—" : p.kr.charAt(0);
                const branchKr = p.kr === "미상" ? "—" : p.kr.charAt(1);

                return (
                  <Stack key={i} spacing={0.3} sx={{ alignItems: "center" }}>
                    <Typography sx={{ fontFamily: "serif", color: T.goldDim, fontSize: "0.65rem", letterSpacing: "0.1em" }}>
                      {p.label}
                    </Typography>
                    <Box
                      sx={{
                        width: { xs: 48, sm: 56 },
                        py: 0.8,
                        bgcolor: "rgba(201, 169, 110, 0.08)",
                        borderRadius: "8px 8px 0 0",
                        border: `1px solid ${T.border}`,
                        borderBottom: "none",
                        textAlign: "center",
                      }}
                    >
                      <Typography sx={{ fontFamily: "serif", color: T.goldLight, fontSize: { xs: "1.2rem", sm: "1.4rem" }, fontWeight: 700, lineHeight: 1.2 }}>
                        {stemHanja}
                      </Typography>
                      <Typography sx={{ color: T.goldDim, fontSize: "0.6rem" }}>
                        {stemKr}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: { xs: 48, sm: 56 },
                        py: 0.8,
                        bgcolor: "rgba(160, 48, 48, 0.08)",
                        borderRadius: "0 0 8px 8px",
                        border: `1px solid ${T.border}`,
                        borderTop: `1px solid ${T.goldDim}`,
                        textAlign: "center",
                      }}
                    >
                      <Typography sx={{ fontFamily: "serif", color: T.cream, fontSize: { xs: "1.2rem", sm: "1.4rem" }, fontWeight: 700, lineHeight: 1.2 }}>
                        {branchHanja}
                      </Typography>
                      <Typography sx={{ color: T.creamDim, fontSize: "0.6rem" }}>
                        {branchKr}
                      </Typography>
                    </Box>
                  </Stack>
                );
              })}
            </Stack>

            {/* 오행 분포 */}
            <Box sx={{ mt: 2.5 }}>
              <Divider sx={{ borderColor: T.border, mb: 1.5 }} />
              <Typography sx={{ fontFamily: "serif", color: T.goldDim, fontSize: "0.65rem", textAlign: "center", letterSpacing: "0.15em", mb: 1 }}>
                五 行
              </Typography>
              <Stack direction="row" spacing={0.5} sx={{ justifyContent: "center", alignItems: "flex-end", height: 44 }}>
                {Object.entries(saju.elementBalance).map(([el, count]) => {
                  const cfg = ELEMENT_COLORS[el];
                  return (
                    <Stack key={el} spacing={0.2} sx={{ alignItems: "center", flex: 1, maxWidth: 48 }}>
                      <Box
                        sx={{
                          width: "100%",
                          height: count > 0 ? count * 9 + 6 : 3,
                          bgcolor: cfg?.bar || "#666",
                          borderRadius: "3px 3px 0 0",
                          opacity: count > 0 ? 0.75 : 0.2,
                        }}
                      />
                      <Typography sx={{ fontFamily: "serif", color: T.creamDim, fontSize: "0.58rem" }}>
                        {cfg?.label || "?"} {count}
                      </Typography>
                    </Stack>
                  );
                })}
              </Stack>
            </Box>
          </Box>
        </Animated>

        {/* ─── 운세 카테고리들 ─── */}
        <Stack spacing={1.5}>
          {FORTUNE_CATEGORIES.map((cat, i) => (
            <Animated key={cat.key} delay={0.2 + i * 0.08}>
              <Box
                sx={{
                  bgcolor: T.bgCard,
                  borderRadius: 2.5,
                  border: `1px solid ${T.border}`,
                  p: { xs: 2, sm: 2.5 },
                  borderLeft: `3px solid ${cat.accent}`,
                  transition: "border-color 0.2s, background-color 0.2s",
                  "&:hover": {
                    borderColor: T.borderHover,
                    bgcolor: "rgba(20, 18, 36, 0.95)",
                  },
                }}
              >
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "flex-start" }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 1.5,
                      bgcolor: `${cat.accent}15`,
                      border: `1px solid ${cat.accent}30`,
                      flexShrink: 0,
                    }}
                  >
                    <Typography sx={{ fontFamily: "serif", color: cat.accent, fontSize: "0.9rem", fontWeight: 700 }}>
                      {cat.hanja.charAt(0)}
                    </Typography>
                  </Box>
                  <Stack spacing={0.3} sx={{ flex: 1 }}>
                    <Typography sx={{ color: T.goldLight, fontWeight: 600, fontSize: "0.85rem" }}>
                      {cat.title}{" "}
                      <Typography component="span" sx={{ fontFamily: "serif", color: T.goldDim, fontSize: "0.7rem" }}>
                        {cat.hanja}
                      </Typography>
                    </Typography>
                    <Typography sx={{ color: T.creamDim, lineHeight: 1.7, fontSize: "0.84rem" }}>
                      {fortune[cat.key]}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Animated>
          ))}
        </Stack>

        {/* ─── 오늘의 조언 ─── */}
        <Animated delay={0.55}>
          <Box
            sx={{
              mt: 2.5,
              bgcolor: T.bgCard,
              borderRadius: 2.5,
              border: `1px solid ${T.border}`,
              p: { xs: 2.5, sm: 3 },
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: `linear-gradient(90deg, transparent, ${T.crimson}, transparent)`,
              },
            }}
          >
            <Typography sx={{ fontFamily: "serif", color: T.gold, fontSize: "0.7rem", letterSpacing: "0.2em", mb: 1.2 }}>
              今日之言
            </Typography>
            <Typography sx={{ color: T.cream, lineHeight: 1.8, fontSize: { xs: "0.9rem", sm: "0.95rem" }, fontWeight: 500 }}>
              &ldquo;{fortune.advice}&rdquo;
            </Typography>
          </Box>
        </Animated>

        {/* ─── 행운의 요소 ─── */}
        <Animated delay={0.65}>
          <Box sx={{ mt: 2, bgcolor: T.bgCard, borderRadius: 2.5, border: `1px solid ${T.border}`, p: 2.5 }}>
            <Typography sx={{ fontFamily: "serif", color: T.goldDim, fontSize: "0.65rem", textAlign: "center", letterSpacing: "0.15em", mb: 1.5 }}>
              幸 運
            </Typography>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-around" }}
              divider={<Divider orientation="vertical" flexItem sx={{ borderColor: T.border }} />}
            >
              {[
                { label: "색상", hanja: "色", value: fortune.lucky.color },
                { label: "숫자", hanja: "數", value: fortune.lucky.number },
                { label: "방위", hanja: "方", value: fortune.lucky.direction },
              ].map((item) => (
                <Stack key={item.label} spacing={0.3} sx={{ alignItems: "center", flex: 1 }}>
                  <Typography sx={{ fontFamily: "serif", color: T.goldDim, fontSize: "0.6rem" }}>
                    {item.hanja}
                  </Typography>
                  <Typography sx={{ color: T.cream, fontWeight: 600, fontSize: "0.88rem" }}>
                    {item.value}
                  </Typography>
                  <Typography sx={{ color: T.goldDim, fontSize: "0.62rem" }}>
                    {item.label}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Animated>

        {/* ─── 액션 버튼 ─── */}
        <Animated delay={0.75}>
          {isSharedView ? (
            // 공유 뷰: "나도 해보기" 메인 CTA
            <Stack spacing={1.5} sx={{ mt: 3.5 }}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                href="/fortune/input"
                startIcon={<Sparkles size={16} />}
                sx={{
                  py: 1.6,
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  letterSpacing: "0.05em",
                  background: `linear-gradient(135deg, ${T.crimson} 0%, #c24040 100%)`,
                  color: T.cream,
                  border: `1px solid rgba(180, 60, 60, 0.3)`,
                  boxShadow: `0 4px 20px ${T.crimsonGlow}`,
                  "&:hover": {
                    background: `linear-gradient(135deg, #b03535 0%, #d04545 100%)`,
                    boxShadow: `0 6px 24px rgba(160, 48, 48, 0.4)`,
                  },
                }}
              >
                나도 운세 보기
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleShare}
                startIcon={<Share2 size={15} />}
                sx={{
                  py: 1.2,
                  color: T.gold,
                  borderColor: T.border,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  "&:hover": { borderColor: T.gold, bgcolor: T.goldFaint },
                }}
              >
                이 결과 다시 공유하기
              </Button>
            </Stack>
          ) : (
            // 본인 뷰: 다시하기 + 공유하기
            <Stack direction="row" spacing={1.5} sx={{ mt: 3.5 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleRetry}
                startIcon={<RotateCcw size={15} />}
                sx={{
                  py: 1.4,
                  color: T.gold,
                  borderColor: T.border,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  "&:hover": { borderColor: T.gold, bgcolor: T.goldFaint },
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
                  background: `linear-gradient(135deg, ${T.crimson} 0%, #c24040 100%)`,
                  color: T.cream,
                  border: `1px solid rgba(180, 60, 60, 0.3)`,
                  "&:hover": {
                    background: `linear-gradient(135deg, #b03535 0%, #d04545 100%)`,
                  },
                }}
              >
                공유하기
              </Button>
            </Stack>
          )}
        </Animated>

        {/* ─── 면책 ─── */}
        <Animated delay={0.85}>
          <Stack spacing={0.3} sx={{ mt: 3, alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ width: 16, height: "1px", bgcolor: "rgba(201, 169, 110, 0.15)" }} />
              <Typography sx={{ fontFamily: "serif", color: "rgba(201, 169, 110, 0.2)", fontSize: "0.55rem" }}>
                免責
              </Typography>
              <Box sx={{ width: 16, height: "1px", bgcolor: "rgba(201, 169, 110, 0.15)" }} />
            </Box>
            <Typography
              variant="caption"
              sx={{ color: "rgba(201, 169, 110, 0.25)", textAlign: "center", fontSize: "0.68rem" }}
            >
              본 운세는 재미를 위한 것이며, 실제 사주 풀이와 다를 수 있습니다.
              <br />
              입력된 개인정보는 저장되지 않습니다.
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
        message="공유 링크가 클립보드에 복사되었습니다"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{
          "& .MuiSnackbarContent-root": {
            bgcolor: "rgba(20, 18, 36, 0.95)",
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