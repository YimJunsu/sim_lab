"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { keyframes } from "@mui/material/styles";
import { getCachedFortune, setCachedFortune } from "@/lib/fortune-cache";

/**
 * 사주/운세 입력 페이지
 * - 동양 전통 사주 컨셉 디자인 (금색 + 짙은 남색 + 붉은 계열)
 * - 필드가 하나씩 순차적으로 나타나며, 현재 필드 입력 완료 후 다음 필드가 표시됩니다.
 * - 동일 입력에 대해 12시간 이내 재요청 시 캐시된 결과를 반환 (API 비용 절약)
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

const gentleFloat = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

const inkSpread = keyframes`
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
`;

// ─── 입력 단계 ───
type Step = "name" | "gender" | "birthDate" | "birthHour";

// 시간 옵션 (12지지 시간대)
const HOUR_OPTIONS = [
  { value: 0, label: "子 자시", sub: "23~01시" },
  { value: 2, label: "丑 축시", sub: "01~03시" },
  { value: 4, label: "寅 인시", sub: "03~05시" },
  { value: 6, label: "卯 묘시", sub: "05~07시" },
  { value: 8, label: "辰 진시", sub: "07~09시" },
  { value: 10, label: "巳 사시", sub: "09~11시" },
  { value: 12, label: "午 오시", sub: "11~13시" },
  { value: 14, label: "未 미시", sub: "13~15시" },
  { value: 16, label: "申 신시", sub: "15~17시" },
  { value: 18, label: "酉 유시", sub: "17~19시" },
  { value: 20, label: "戌 술시", sub: "19~21시" },
  { value: 22, label: "亥 해시", sub: "21~23시" },
];

// 공통 텍스트필드 sx
const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    color: T.cream,
    bgcolor: "rgba(201, 169, 110, 0.04)",
    borderRadius: 1.5,
    fontSize: "0.95rem",
    "& fieldset": { borderColor: T.border },
    "&:hover fieldset": { borderColor: T.borderHover },
    "&.Mui-focused fieldset": { borderColor: T.gold },
  },
  "& .MuiInputBase-input::placeholder": { color: T.goldDim },
};

// 애니메이션 래퍼
function Animated({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <Box sx={{ animation: `${fadeSlideIn} 0.45s ease-out ${delay}s both` }}>
      {children}
    </Box>
  );
}

export default function FortuneInputPage() {
  const router = useRouter();

  // 입력 상태
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthHour, setBirthHour] = useState<number | null>(null);
  const [unknownTime, setUnknownTime] = useState(false);

  // UI 상태
  const [currentStep, setCurrentStep] = useState<Step>("name");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 완료 여부
  const isNameComplete = name.trim().length >= 1;
  const isGenderComplete = gender !== "";
  const isBirthDateComplete =
    birthYear.length === 4 &&
    Number(birthYear) >= 1900 &&
    Number(birthYear) <= new Date().getFullYear() &&
    birthMonth !== "" &&
    Number(birthMonth) >= 1 &&
    Number(birthMonth) <= 12 &&
    birthDay !== "" &&
    Number(birthDay) >= 1 &&
    Number(birthDay) <= 31;
  const isBirthHourComplete = unknownTime || birthHour !== null;

  // 다음 단계 전환
  const advanceStep = useCallback(() => {
    if (currentStep === "name" && isNameComplete) setCurrentStep("gender");
    else if (currentStep === "gender" && isGenderComplete) setCurrentStep("birthDate");
    else if (currentStep === "birthDate" && isBirthDateComplete) setCurrentStep("birthHour");
  }, [currentStep, isNameComplete, isGenderComplete, isBirthDateComplete]);

  // 성별 선택 시 자동 진행
  useEffect(() => {
    if (currentStep === "gender" && isGenderComplete) {
      const timer = setTimeout(() => setCurrentStep("birthDate"), 300);
      return () => clearTimeout(timer);
    }
  }, [gender, currentStep, isGenderComplete]);

  // 운세 요청 (캐시 우선 확인 → 없으면 API 호출)
  const handleSubmit = async () => {
    if (!isNameComplete || !isGenderComplete || !isBirthDateComplete || !isBirthHourComplete) return;

    setLoading(true);
    setError("");

    const inputData = {
      name: name.trim(),
      gender,
      birthYear: Number(birthYear),
      birthMonth: Number(birthMonth),
      birthDay: Number(birthDay),
      birthHour: unknownTime ? null : birthHour,
    };

    try {
      // 1) 캐시 확인 (12시간 이내 동일 입력 → 캐시 반환)
      const cached = getCachedFortune(inputData);
      if (cached) {
        sessionStorage.setItem("fortuneResult", JSON.stringify(cached));
        sessionStorage.setItem("fortuneInput", JSON.stringify(inputData));
        router.push("/fortune/result");
        return;
      }

      // 2) 캐시 미스 → API 호출
      const response = await fetch("/api/fortune", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "오류가 발생했습니다.");
        return;
      }

      // 3) 결과를 캐시에 저장 + sessionStorage에 저장
      setCachedFortune(inputData, data);
      sessionStorage.setItem("fortuneResult", JSON.stringify(data));
      sessionStorage.setItem("fortuneInput", JSON.stringify(inputData));
      router.push("/fortune/result");
    } catch {
      setError("서버와 통신할 수 없습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = isNameComplete && isGenderComplete && isBirthDateComplete && isBirthHourComplete;
  const pastName = currentStep !== "name";
  const pastGender = currentStep === "birthDate" || currentStep === "birthHour";
  const atHour = currentStep === "birthHour";

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
      {/* ─── 배경 장식: 전통 문양 느낌의 원형 ─── */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: "6%", sm: "8%" },
          left: "50%",
          transform: "translateX(-50%)",
          width: { xs: 260, sm: 340 },
          height: { xs: 260, sm: 340 },
          borderRadius: "50%",
          border: `1px solid ${T.goldFaint}`,
          pointerEvents: "none",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 20,
            borderRadius: "50%",
            border: `1px solid rgba(201, 169, 110, 0.08)`,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 44,
            borderRadius: "50%",
            border: `1px dashed rgba(201, 169, 110, 0.06)`,
          },
        }}
      />

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        {/* ─── 헤더 ─── */}
        <Animated>
          <Stack spacing={1.2} sx={{ alignItems: "center", mb: { xs: 4, sm: 5 } }}>
            {/* 한자 장식 */}
            <Typography
              sx={{
                fontFamily: "serif",
                fontSize: { xs: "2rem", sm: "2.5rem" },
                color: T.gold,
                letterSpacing: "0.3em",
                animation: `${gentleFloat} 4s ease-in-out infinite`,
                lineHeight: 1,
              }}
            >
              四柱
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: T.cream,
                fontWeight: 700,
                textAlign: "center",
                fontSize: { xs: "1.3rem", sm: "1.6rem" },
                letterSpacing: "0.05em",
              }}
            >
              사주 / 미니 운세
            </Typography>
            {/* 장식 구분선 */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mt: 0.5,
              }}
            >
              <Box sx={{ width: 32, height: "1px", bgcolor: T.goldDim }} />
              <Typography sx={{ color: T.gold, fontSize: "0.65rem", letterSpacing: "0.15em" }}>
                命理
              </Typography>
              <Box sx={{ width: 32, height: "1px", bgcolor: T.goldDim }} />
            </Box>
            <Typography
              sx={{
                color: T.creamDim,
                textAlign: "center",
                fontSize: { xs: "0.82rem", sm: "0.88rem" },
                mt: 0.5,
              }}
            >
              생년월일시를 입력하여 오늘의 운을 살펴보세요
            </Typography>
          </Stack>
        </Animated>

        {/* ─── 입력 폼 ─── */}
        <Box
          sx={{
            animation: `${inkSpread} 0.5s ease-out 0.1s both`,
            bgcolor: T.bgCard,
            backdropFilter: "blur(12px)",
            borderRadius: 3,
            border: `1px solid ${T.border}`,
            p: { xs: 2.5, sm: 3.5 },
            // 상단 금색 라인 장식
            borderTop: `2px solid ${T.gold}`,
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: -1,
              left: "20%",
              right: "20%",
              height: "1px",
              background: `linear-gradient(90deg, transparent, ${T.gold}, transparent)`,
            },
          }}
        >
          <Stack spacing={3}>
            {/* ── Step 1: 이름 ── */}
            <Animated>
              <Stack spacing={0.8}>
                <Typography variant="subtitle2" sx={{ color: T.goldLight, fontWeight: 600, fontSize: "0.85rem" }}>
                  성명 <Typography component="span" sx={{ fontFamily: "serif", color: T.goldDim, fontSize: "0.75rem" }}>姓名</Typography>
                </Typography>
                <TextField
                  fullWidth
                  placeholder="이름을 입력해주세요"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && isNameComplete) advanceStep(); }}
                  inputProps={{ maxLength: 20 }}
                  sx={textFieldSx}
                />
                {currentStep === "name" && isNameComplete && (
                  <Animated>
                    <Button
                      size="small"
                      onClick={advanceStep}
                      sx={{ color: T.gold, alignSelf: "flex-end", fontSize: "0.8rem" }}
                    >
                      다음 &rarr;
                    </Button>
                  </Animated>
                )}
              </Stack>
            </Animated>

            {/* ── Step 2: 성별 ── */}
            {(pastName) && (
              <Animated>
                <Stack spacing={0.8}>
                  <Typography variant="subtitle2" sx={{ color: T.goldLight, fontWeight: 600, fontSize: "0.85rem" }}>
                    성별 <Typography component="span" sx={{ fontFamily: "serif", color: T.goldDim, fontSize: "0.75rem" }}>性別</Typography>
                  </Typography>
                  <ToggleButtonGroup
                    value={gender}
                    exclusive
                    onChange={(_, val) => { if (val) setGender(val); }}
                    fullWidth
                    sx={{
                      "& .MuiToggleButton-root": {
                        color: T.creamDim,
                        borderColor: T.border,
                        py: 1.3,
                        fontSize: "0.92rem",
                        fontWeight: 500,
                        "&.Mui-selected": {
                          bgcolor: T.goldFaint,
                          color: T.goldLight,
                          borderColor: T.gold,
                          "&:hover": { bgcolor: "rgba(201, 169, 110, 0.18)" },
                        },
                        "&:hover": { bgcolor: "rgba(201, 169, 110, 0.06)" },
                      },
                    }}
                  >
                    <ToggleButton value="male">
                      <Stack sx={{ alignItems: "center" }}>
                        <Typography sx={{ fontFamily: "serif", fontSize: "1.1rem", lineHeight: 1 }}>乾</Typography>
                        <Typography sx={{ fontSize: "0.78rem", mt: 0.3 }}>남성</Typography>
                      </Stack>
                    </ToggleButton>
                    <ToggleButton value="female">
                      <Stack sx={{ alignItems: "center" }}>
                        <Typography sx={{ fontFamily: "serif", fontSize: "1.1rem", lineHeight: 1 }}>坤</Typography>
                        <Typography sx={{ fontSize: "0.78rem", mt: 0.3 }}>여성</Typography>
                      </Stack>
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Stack>
              </Animated>
            )}

            {/* ── Step 3: 생년월일 ── */}
            {(pastGender || atHour) && (
              <Animated>
                <Stack spacing={0.8}>
                  <Typography variant="subtitle2" sx={{ color: T.goldLight, fontWeight: 600, fontSize: "0.85rem" }}>
                    생년월일 (양력){" "}
                    <Typography component="span" sx={{ fontFamily: "serif", color: T.goldDim, fontSize: "0.75rem" }}>
                      生年月日
                    </Typography>
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <TextField
                      placeholder="연도"
                      value={birthYear}
                      onChange={(e) => setBirthYear(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      inputProps={{ inputMode: "numeric", maxLength: 4 }}
                      sx={{ flex: 2, ...textFieldSx }}
                    />
                    <TextField
                      placeholder="월"
                      value={birthMonth}
                      onChange={(e) => setBirthMonth(e.target.value.replace(/\D/g, "").slice(0, 2))}
                      inputProps={{ inputMode: "numeric", maxLength: 2 }}
                      sx={{ flex: 1, ...textFieldSx }}
                    />
                    <TextField
                      placeholder="일"
                      value={birthDay}
                      onChange={(e) => setBirthDay(e.target.value.replace(/\D/g, "").slice(0, 2))}
                      inputProps={{ inputMode: "numeric", maxLength: 2 }}
                      sx={{ flex: 1, ...textFieldSx }}
                    />
                  </Stack>
                  {currentStep === "birthDate" && isBirthDateComplete && (
                    <Animated>
                      <Button
                        size="small"
                        onClick={advanceStep}
                        sx={{ color: T.gold, alignSelf: "flex-end", fontSize: "0.8rem" }}
                      >
                        다음 &rarr;
                      </Button>
                    </Animated>
                  )}
                </Stack>
              </Animated>
            )}

            {/* ── Step 4: 태어난 시간 ── */}
            {atHour && (
              <Animated>
                <Stack spacing={1.2}>
                  <Typography variant="subtitle2" sx={{ color: T.goldLight, fontWeight: 600, fontSize: "0.85rem" }}>
                    태어난 시간{" "}
                    <Typography component="span" sx={{ fontFamily: "serif", color: T.goldDim, fontSize: "0.75rem" }}>
                      生時
                    </Typography>
                  </Typography>

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={unknownTime}
                        onChange={(e) => {
                          setUnknownTime(e.target.checked);
                          if (e.target.checked) setBirthHour(null);
                        }}
                        sx={{
                          color: T.goldDim,
                          "&.Mui-checked": { color: T.gold },
                        }}
                      />
                    }
                    label="태어난 시간을 모릅니다"
                    sx={{ color: T.creamDim, "& .MuiTypography-root": { fontSize: "0.83rem" } }}
                  />

                  {unknownTime && (
                    <Animated>
                      <Typography
                        variant="caption"
                        sx={{ color: "rgba(201, 169, 110, 0.55)", display: "block", fontSize: "0.76rem" }}
                      >
                        * 시간 미상 시 시주(時柱)를 제외하여 해석하므로 정확도가 다소 낮아질 수 있습니다.
                      </Typography>
                    </Animated>
                  )}

                  {!unknownTime && (
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "repeat(3, 1fr)", sm: "repeat(4, 1fr)" },
                        gap: 0.8,
                      }}
                    >
                      {HOUR_OPTIONS.map((opt) => {
                        const selected = birthHour === opt.value;
                        return (
                          <Button
                            key={opt.value}
                            onClick={() => setBirthHour(opt.value)}
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 0,
                              py: { xs: 1, sm: 1.2 },
                              px: 0.5,
                              borderRadius: 2,
                              border: `1px solid ${selected ? T.gold : T.border}`,
                              bgcolor: selected ? T.goldFaint : "transparent",
                              color: selected ? T.goldLight : T.creamDim,
                              minWidth: 0,
                              "&:hover": {
                                bgcolor: selected ? "rgba(201, 169, 110, 0.18)" : "rgba(201, 169, 110, 0.06)",
                                borderColor: T.borderHover,
                              },
                            }}
                          >
                            <Typography sx={{ fontFamily: "serif", fontSize: { xs: "0.82rem", sm: "0.88rem" }, fontWeight: 600, lineHeight: 1.2 }}>
                              {opt.label}
                            </Typography>
                            <Typography sx={{ fontSize: "0.62rem", opacity: 0.6, lineHeight: 1 }}>
                              {opt.sub}
                            </Typography>
                          </Button>
                        );
                      })}
                    </Box>
                  )}
                </Stack>
              </Animated>
            )}

            {/* 에러 */}
            {error && (
              <Animated>
                <Alert
                  severity="error"
                  sx={{
                    bgcolor: T.crimsonGlow,
                    color: "#f5a5a5",
                    border: `1px solid rgba(160, 48, 48, 0.4)`,
                    "& .MuiAlert-icon": { color: "#e57373" },
                  }}
                >
                  {error}
                </Alert>
              </Animated>
            )}

            {/* 제출 버튼 */}
            {atHour && isBirthHourComplete && (
              <Animated>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleSubmit}
                  disabled={!canSubmit || loading}
                  sx={{
                    mt: 1,
                    py: 1.6,
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    borderRadius: 2,
                    letterSpacing: "0.1em",
                    background: `linear-gradient(135deg, ${T.crimson} 0%, #c24040 50%, ${T.crimson} 100%)`,
                    color: T.cream,
                    boxShadow: `0 4px 24px ${T.crimsonGlow}`,
                    border: `1px solid rgba(180, 60, 60, 0.3)`,
                    "&:hover": {
                      background: `linear-gradient(135deg, #b03535 0%, #d04545 50%, #b03535 100%)`,
                      boxShadow: `0 6px 28px rgba(160, 48, 48, 0.4)`,
                    },
                    "&:disabled": {
                      background: "rgba(160, 48, 48, 0.25)",
                      color: "rgba(240, 230, 211, 0.4)",
                    },
                  }}
                >
                  {loading ? (
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                      <CircularProgress size={18} sx={{ color: T.cream }} />
                      <span>운명을 풀어보는 중...</span>
                    </Stack>
                  ) : (
                    "운세 보기"
                  )}
                </Button>
              </Animated>
            )}
          </Stack>
        </Box>

        {/* ─── 안내 ─── */}
        <Animated delay={0.3}>
          <Stack spacing={0.5} sx={{ mt: 3, alignItems: "center" }}>
            <Typography
              variant="caption"
              sx={{ color: "rgba(201, 169, 110, 0.3)", textAlign: "center", fontSize: "0.7rem" }}
            >
              본 서비스는 재미를 위한 것이며, 입력된 개인정보는 저장되지 않습니다.
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "rgba(201, 169, 110, 0.22)", textAlign: "center", fontSize: "0.7rem" }}
            >
              AI 기반 해석으로, 실제 사주 풀이와 다를 수 있습니다.
            </Typography>
          </Stack>
        </Animated>
      </Container>
    </Box>
  );
}
