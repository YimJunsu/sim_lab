"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { keyframes } from "@mui/material/styles";
import {
  getRandomQuestions,
  calculateTypeScores,
  getTypeCommentWithIndex,
  type IdealTypeQuestionItem,
  type IdealTypeScores,
} from "@/lib/ideal-type-questions";

/**
 * 이상형 성향 테스트 - 테스트 페이지
 * 디자인: 미니멀 다크 (#111), 세그먼트 프로그레스, 넘버 뱃지 옵션
 * mymood(보라+몽환+오브+구슬)와 완전 차별화
 */

// ─── 애니메이션 ───
const fadeIn = keyframes`
  0%   { opacity: 0; transform: translateY(16px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const fadeOut = keyframes`
  0%   { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-12px); }
`;

const optionEnter = keyframes`
  0%   { opacity: 0; transform: translateY(8px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const selectFlash = keyframes`
  0%   { background-color: var(--sel-color); }
  100% { background-color: transparent; }
`;

const OPTION_LABELS = ["A", "B", "C", "D"];

export default function IdealTypeTestPage() {
  const router = useRouter();

  const questions = useMemo(() => getRandomQuestions(20), []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<IdealTypeScores[]>([]);
  const [transitioning, setTransitioning] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const currentQuestion: IdealTypeQuestionItem | undefined = questions[currentIndex];
  const total = questions.length;
  const progress = ((currentIndex + 1) / total) * 100;

  const handleSelect = useCallback(
    (optionIndex: number, scores: IdealTypeScores) => {
      if (transitioning) return;

      setSelectedOption(optionIndex);
      setTransitioning(true);

      setTimeout(() => {
        const newAnswers = [...answers, scores];
        setAnswers(newAnswers);

        if (currentIndex + 1 >= questions.length) {
          const result = calculateTypeScores(newAnswers);
          const { comment, commentIdx } = getTypeCommentWithIndex(result);
          const today = new Date().toISOString().slice(0, 10);
          sessionStorage.setItem("idealTypeResult", JSON.stringify({ scores: result, comment, date: today, commentIdx }));
          router.push("/ideal-type/result");
        } else {
          setCurrentIndex((prev) => prev + 1);
          setSelectedOption(null);
          setTransitioning(false);
        }
      }, 400);
    },
    [transitioning, answers, currentIndex, questions.length, router]
  );

  if (!currentQuestion) return null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#111",
        pt: { xs: 14, sm: 12 },
        pb: { xs: 6, sm: 10 },
      }}
    >
      <Container maxWidth="sm">
        {/* ─── 프로그레스 ─── */}
        <Box sx={{ animation: `${fadeIn} 0.3s ease-out both`, mb: { xs: 4, sm: 5 } }}>
          {/* 번호 / 총수 */}
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "baseline", mb: 1 }}>
            <Typography sx={{ color: "#E84393", fontSize: "0.85rem", fontWeight: 700 }}>
              {currentIndex + 1}
              <Box component="span" sx={{ color: "rgba(255,255,255,0.25)", fontWeight: 400 }}>
                {" "}/ {total}
              </Box>
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.2)", fontSize: "0.72rem" }}>
              {Math.round(progress)}%
            </Typography>
          </Stack>

          {/* 세그먼트 프로그레스 바 */}
          <Stack direction="row" spacing={0.4}>
            {Array.from({ length: total }, (_, i) => (
              <Box
                key={i}
                sx={{
                  flex: 1,
                  height: 3,
                  borderRadius: 1,
                  bgcolor: i < currentIndex
                    ? "#E84393"
                    : i === currentIndex
                      ? "rgba(232,67,147,0.5)"
                      : "rgba(255,255,255,0.06)",
                  transition: "background-color 0.3s ease",
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* ─── 질문 + 선택지 ─── */}
        <Box
          key={currentQuestion.id}
          sx={{
            animation: transitioning
              ? `${fadeOut} 0.25s ease-in forwards`
              : `${fadeIn} 0.35s ease-out both`,
          }}
        >
          {/* 질문 */}
          <Box sx={{ mb: 3.5 }}>
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 700,
                fontSize: { xs: "1.15rem", sm: "1.3rem" },
                lineHeight: 1.7,
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
                    py: { xs: 1.5, sm: 1.7 },
                    px: 2,
                    borderRadius: 2,
                    border: isSelected
                      ? "1px solid #E84393"
                      : "1px solid rgba(255,255,255,0.08)",
                    bgcolor: isSelected ? "rgba(232,67,147,0.1)" : "transparent",
                    color: isSelected ? "#fff" : "rgba(255,255,255,0.7)",
                    textAlign: "left",
                    justifyContent: "flex-start",
                    fontWeight: 500,
                    fontSize: { xs: "0.88rem", sm: "0.92rem" },
                    textTransform: "none",
                    transition: "all 0.2s ease",
                    animation: `${optionEnter} 0.3s ease-out ${0.05 + idx * 0.05}s both`,
                    "--sel-color": "rgba(232,67,147,0.15)",
                    ...(isSelected && {
                      animation: `${selectFlash} 0.4s ease-out`,
                    }),
                    "&:hover": {
                      bgcolor: isSelected ? "rgba(232,67,147,0.12)" : "rgba(255,255,255,0.04)",
                      borderColor: isSelected ? "#E84393" : "rgba(255,255,255,0.15)",
                    },
                    "&:disabled": {
                      color: isSelected ? "#fff" : "rgba(255,255,255,0.35)",
                    },
                  }}
                >
                  {/* 넘버 뱃지 */}
                  <Box
                    component="span"
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: 1,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      mr: 1.5,
                      flexShrink: 0,
                      bgcolor: isSelected ? "#E84393" : "rgba(255,255,255,0.06)",
                      color: isSelected ? "#fff" : "rgba(255,255,255,0.35)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {OPTION_LABELS[idx]}
                  </Box>
                  {option.label}
                </Button>
              );
            })}
          </Stack>
        </Box>

        {/* ─── 안내 ─── */}
        <Typography
          sx={{
            color: "rgba(255,255,255,0.12)",
            textAlign: "center",
            fontSize: "0.65rem",
            mt: 5,
            animation: `${fadeIn} 0.3s ease-out 0.3s both`,
          }}
        >
          본 테스트는 재미를 위한 것이며, 전문적인 심리 진단이 아닙니다.
        </Typography>
      </Container>
    </Box>
  );
}
