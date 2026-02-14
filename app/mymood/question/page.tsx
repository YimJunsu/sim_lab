"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";
import { keyframes } from "@mui/material/styles";
import {
  getRandomQuestions,
  calculateEmotionScores,
  getEmotionComment,
  type Question,
  type EmotionScores,
} from "@/lib/mymood-questions";

/**
 * 감정 점수화 - 질문 페이지
 * - 40개 중 10개 랜덤 질문
 * - 한 문제씩 표시, 선택 후 자동 진행
 * - 부드러운 전환 애니메이션
 * - 심리 테스트 감성의 보라/인디고 컬러 디자인
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

const fadeSlideOut = keyframes`
  0% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-20px); }
`;

const gentleFloat = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(155, 122, 232, 0.1); }
  50% { box-shadow: 0 0 40px rgba(155, 122, 232, 0.2); }
`;

// 애니메이션 래퍼
function Animated({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <Box sx={{ animation: `${fadeSlideIn} 0.45s ease-out ${delay}s both` }}>
      {children}
    </Box>
  );
}

export default function MymoodQuestionPage() {
  const router = useRouter();

  // 질문 목록 (최초 1회 랜덤 생성)
  const questions = useMemo(() => getRandomQuestions(10), []);

  // 현재 질문 인덱스
  const [currentIndex, setCurrentIndex] = useState(0);
  // 선택한 답변들 (각 질문의 점수)
  const [answers, setAnswers] = useState<EmotionScores[]>([]);
  // 전환 애니메이션 상태
  const [transitioning, setTransitioning] = useState(false);
  // 선택한 옵션 인덱스 (하이라이트용)
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const currentQuestion: Question | undefined = questions[currentIndex];
  const progress = (currentIndex / questions.length) * 100;

  // 옵션 선택 핸들러
  const handleSelect = useCallback(
    (optionIndex: number, scores: EmotionScores) => {
      if (transitioning) return;

      setSelectedOption(optionIndex);
      setTransitioning(true);

      // 짧은 딜레이 후 다음 질문으로 전환
      setTimeout(() => {
        const newAnswers = [...answers, scores];
        setAnswers(newAnswers);

        if (currentIndex + 1 >= questions.length) {
          // 마지막 질문 → 결과 계산 후 이동
          const result = calculateEmotionScores(newAnswers);
          const comment = getEmotionComment(result);
          const today = new Date().toISOString().slice(0, 10);

          // sessionStorage에 결과 저장
          sessionStorage.setItem(
            "mymoodResult",
            JSON.stringify({ scores: result, comment, date: today })
          );

          // localStorage에 날짜별 결과 저장 (어제와 비교용)
          const historyKey = `mymood_${today}`;
          localStorage.setItem(
            historyKey,
            JSON.stringify({ scores: result, comment, date: today })
          );

          router.push("/mymood/result-mymood");
        } else {
          setCurrentIndex((prev) => prev + 1);
          setSelectedOption(null);
          setTransitioning(false);
        }
      }, 400);
    },
    [transitioning, answers, currentIndex, questions.length, router]
  );

  // 질문이 없는 경우 (로딩 안전장치)
  if (!currentQuestion) return null;

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        background: `linear-gradient(175deg, ${T.bgDark} 0%, #120e2a 40%, #1a1035 70%, #0f0b25 100%)`,
        pt: { xs: 11, sm: 13 },
        pb: { xs: 6, sm: 10 },
        overflow: "hidden",
      }}
    >
      {/* ─── 배경 장식 ─── */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: "4%", sm: "6%" },
          left: "50%",
          transform: "translateX(-50%)",
          width: { xs: 240, sm: 320 },
          height: { xs: 240, sm: 320 },
          borderRadius: "50%",
          border: `1px solid ${T.primaryFaint}`,
          pointerEvents: "none",
          animation: `${pulseGlow} 5s ease-in-out infinite`,
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 20,
            borderRadius: "50%",
            border: `1px solid rgba(155, 122, 232, 0.08)`,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 44,
            borderRadius: "50%",
            border: `1px dashed rgba(155, 122, 232, 0.06)`,
          },
        }}
      />

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        {/* ─── 헤더 ─── */}
        <Animated>
          <Stack spacing={1} sx={{ alignItems: "center", mb: { xs: 3, sm: 4 } }}>
            <Typography
              sx={{
                fontSize: { xs: "1.8rem", sm: "2.2rem" },
                color: T.primary,
                letterSpacing: "0.15em",
                animation: `${gentleFloat} 4s ease-in-out infinite`,
                lineHeight: 1,
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
                letterSpacing: "0.05em",
              }}
            >
              오늘 나의 기분은?
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 0.5 }}>
              <Box sx={{ width: 32, height: "1px", bgcolor: T.primaryDim }} />
              <Typography sx={{ color: T.primary, fontSize: "0.65rem", letterSpacing: "0.15em" }}>
                MOOD CHECK
              </Typography>
              <Box sx={{ width: 32, height: "1px", bgcolor: T.primaryDim }} />
            </Box>
          </Stack>
        </Animated>

        {/* ─── 프로그레스 바 ─── */}
        <Animated delay={0.1}>
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" sx={{ justifyContent: "space-between", mb: 0.8 }}>
              <Typography sx={{ color: T.primaryDim, fontSize: "0.75rem" }}>
                Q{currentIndex + 1} / {questions.length}
              </Typography>
              <Typography sx={{ color: T.primaryDim, fontSize: "0.75rem" }}>
                {Math.round(progress)}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: "rgba(155, 122, 232, 0.08)",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 3,
                  background: `linear-gradient(90deg, ${T.primary}, ${T.accent})`,
                  transition: "transform 0.4s ease-out",
                },
              }}
            />
          </Box>
        </Animated>

        {/* ─── 질문 카드 ─── */}
        <Box
          key={currentQuestion.id}
          sx={{
            animation: transitioning
              ? `${fadeSlideOut} 0.3s ease-in forwards`
              : `${fadeSlideIn} 0.4s ease-out both`,
          }}
        >
          {/* 질문 텍스트 */}
          <Box
            sx={{
              bgcolor: T.bgCard,
              backdropFilter: "blur(12px)",
              borderRadius: 3,
              border: `1px solid ${T.border}`,
              borderTop: `2px solid ${T.primary}`,
              p: { xs: 2.5, sm: 3.5 },
              mb: 2,
              textAlign: "center",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: -1,
                left: "20%",
                right: "20%",
                height: "1px",
                background: `linear-gradient(90deg, transparent, ${T.primary}, transparent)`,
              },
            }}
          >
            <Typography
              sx={{
                color: T.primaryDim,
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                mb: 1.5,
              }}
            >
              QUESTION {currentIndex + 1}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: T.cream,
                fontWeight: 600,
                fontSize: { xs: "1.05rem", sm: "1.2rem" },
                lineHeight: 1.6,
              }}
            >
              {currentQuestion.text}
            </Typography>
          </Box>

          {/* 선택지 */}
          <Stack spacing={1.2}>
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              return (
                <Button
                  key={idx}
                  fullWidth
                  onClick={() => handleSelect(idx, option.scores)}
                  disabled={transitioning}
                  sx={{
                    py: { xs: 1.8, sm: 2 },
                    px: 2.5,
                    borderRadius: 2.5,
                    border: `1px solid ${isSelected ? T.primary : T.border}`,
                    bgcolor: isSelected ? T.primaryFaint : T.bgCard,
                    backdropFilter: "blur(8px)",
                    color: isSelected ? T.primaryLight : T.cream,
                    textAlign: "left",
                    justifyContent: "flex-start",
                    fontWeight: 500,
                    fontSize: { xs: "0.9rem", sm: "0.95rem" },
                    letterSpacing: "0.02em",
                    textTransform: "none",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: isSelected ? T.primaryFaint : "rgba(155, 122, 232, 0.08)",
                      borderColor: T.borderHover,
                      transform: "translateY(-1px)",
                    },
                    "&:disabled": {
                      color: isSelected ? T.primaryLight : T.creamDim,
                    },
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      border: `1.5px solid ${isSelected ? T.primary : T.primaryDim}`,
                      bgcolor: isSelected ? T.primary : "transparent",
                      color: isSelected ? "#fff" : T.primaryDim,
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      mr: 1.5,
                      flexShrink: 0,
                      transition: "all 0.2s ease",
                    }}
                  >
                    {String.fromCharCode(65 + idx)}
                  </Box>
                  {option.label}
                </Button>
              );
            })}
          </Stack>
        </Box>

        {/* ─── 안내 ─── */}
        <Animated delay={0.3}>
          <Stack spacing={0.5} sx={{ mt: 4, alignItems: "center" }}>
            <Typography
              variant="caption"
              sx={{ color: "rgba(155, 122, 232, 0.3)", textAlign: "center", fontSize: "0.7rem" }}
            >
              본 테스트는 재미를 위한 것이며, 전문적인 심리 진단이 아닙니다.
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "rgba(155, 122, 232, 0.22)", textAlign: "center", fontSize: "0.7rem" }}
            >
              입력된 정보는 저장되지 않습니다.
            </Typography>
          </Stack>
        </Animated>
      </Container>
    </Box>
  );
}