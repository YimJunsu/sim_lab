"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { keyframes } from "@mui/material/styles";
import {
  getRandomAnimalQuestions,
  calculateAnimalScores,
  matchAnimal,
  getAnimalCommentWithIndex,
  type AnimalQuestionItem,
  type AnimalScores,
  type AnimalGender,
} from "@/lib/animal-type-questions";

/**
 * 동물상 테스트 - 테스트 페이지
 * 차별점: 카드형 질문, 2×2 그리드 옵션, 발자국 프로그레스, 반딧불 배경
 */

// ─── 애니메이션 ───
const cardEnter = keyframes`
  0%   { opacity: 0; transform: scale(0.95) translateY(20px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
`;

const cardExit = keyframes`
  0%   { opacity: 1; transform: scale(1) translateX(0); }
  100% { opacity: 0; transform: scale(0.9) translateX(-40px); }
`;

const optionPop = keyframes`
  0%   { opacity: 0; transform: scale(0.85); }
  100% { opacity: 1; transform: scale(1); }
`;

const selectPulse = keyframes`
  0%   { box-shadow: 0 0 0 0 rgba(46, 204, 113, 0.4); }
  70%  { box-shadow: 0 0 0 10px rgba(46, 204, 113, 0); }
  100% { box-shadow: 0 0 0 0 rgba(46, 204, 113, 0); }
`;

const firefly = keyframes`
  0%, 100% { opacity: 0; }
  30%      { opacity: 0.6; }
  70%      { opacity: 0.4; }
`;

const fireflyDrift = keyframes`
  0%   { transform: translate(0, 0); }
  33%  { transform: translate(8px, -12px); }
  66%  { transform: translate(-6px, -4px); }
  100% { transform: translate(0, 0); }
`;

const pawBounce = keyframes`
  0%   { transform: scale(0); }
  60%  { transform: scale(1.3); }
  100% { transform: scale(1); }
`;

const MAIN_COLOR = "#2ECC71";

const OPTION_EMOJIS = ["🅰️", "🅱️", "🅲", "🅳"];

const FIREFLIES = [
  { left: "5%", top: "25%", delay: 0, dur: 5 },
  { left: "90%", top: "18%", delay: 1.5, dur: 4.5 },
  { left: "12%", top: "65%", delay: 2.8, dur: 5.2 },
  { left: "82%", top: "55%", delay: 0.6, dur: 4.8 },
  { left: "50%", top: "80%", delay: 3.5, dur: 5.5 },
];

export default function AnimalTypeTestPage() {
  const router = useRouter();

  const [gender, setGender] = useState<AnimalGender | null>(null);
  const [questions, setQuestions] = useState<AnimalQuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnimalScores[]>([]);
  const [transitioning, setTransitioning] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("animalTestGender");
    if (stored === "female" || stored === "male") {
      setGender(stored);
      setQuestions(getRandomAnimalQuestions(stored, 12));
    } else {
      router.replace("/animal-test/input");
    }
  }, [router]);

  const currentQuestion: AnimalQuestionItem | undefined = questions[currentIndex];
  const total = questions.length;

  const handleSelect = useCallback(
    (optionIndex: number, scores: AnimalScores) => {
      if (transitioning || !gender) return;

      setSelectedOption(optionIndex);
      setTransitioning(true);

      setTimeout(() => {
        const newAnswers = [...answers, scores];
        setAnswers(newAnswers);

        if (currentIndex + 1 >= questions.length) {
          const result = calculateAnimalScores(newAnswers);
          const { animal, index: animalIdx } = matchAnimal(result, gender);
          const { comment, commentIdx } = getAnimalCommentWithIndex(animal.name, gender);
          const today = new Date().toISOString().slice(0, 10);
          sessionStorage.setItem(
            "animalTestResult",
            JSON.stringify({ scores: result, gender, animalIdx, comment, commentIdx, date: today })
          );
          router.push("/animal-test/result");
        } else {
          setCurrentIndex((prev) => prev + 1);
          setSelectedOption(null);
          setTransitioning(false);
        }
      }, 500);
    },
    [transitioning, answers, currentIndex, questions.length, router, gender]
  );

  if (!currentQuestion) return null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0A1F0D 0%, #071207 50%, #0D1B0E 100%)",
        pt: { xs: 12, sm: 10 },
        pb: { xs: 6, sm: 10 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ─── 반딧불 ─── */}
      {FIREFLIES.map((f, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            left: f.left,
            top: f.top,
            width: 3,
            height: 3,
            borderRadius: "50%",
            bgcolor: "#7CFC00",
            boxShadow: "0 0 8px 3px rgba(124, 252, 0, 0.25)",
            animation: `${firefly} ${f.dur}s ease-in-out ${f.delay}s infinite, ${fireflyDrift} ${f.dur * 1.4}s ease-in-out ${f.delay}s infinite`,
            pointerEvents: "none",
          }}
        />
      ))}

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        {/* ─── 발자국 프로그레스 ─── */}
        <Box sx={{ mb: { xs: 3, sm: 4 } }}>
          {/* 번호 표시 */}
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: "baseline" }}>
              <Typography sx={{ color: MAIN_COLOR, fontSize: "1.2rem", fontWeight: 800 }}>
                {currentIndex + 1}
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.2)", fontSize: "0.75rem", fontWeight: 400 }}>
                / {total}
              </Typography>
            </Stack>
            <Box
              sx={{
                bgcolor: "rgba(46, 204, 113, 0.08)",
                borderRadius: 4,
                px: 1.2,
                py: 0.3,
              }}
            >
              <Typography sx={{ color: "rgba(46, 204, 113, 0.6)", fontSize: "0.68rem", fontWeight: 600 }}>
                {Math.round(((currentIndex + 1) / total) * 100)}%
              </Typography>
            </Box>
          </Stack>

          {/* 발자국 트레일 */}
          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
            {Array.from({ length: total }, (_, i) => {
              const isDone = i < currentIndex;
              const isCurrent = i === currentIndex;
              return (
                <Box
                  key={i}
                  sx={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 20,
                  }}
                >
                  {isDone ? (
                    <Typography
                      sx={{
                        fontSize: "0.65rem",
                        animation: `${pawBounce} 0.3s ease-out both`,
                        filter: "drop-shadow(0 0 3px rgba(46, 204, 113, 0.4))",
                      }}
                    >
                      🐾
                    </Typography>
                  ) : (
                    <Box
                      sx={{
                        width: isCurrent ? 10 : 6,
                        height: isCurrent ? 10 : 6,
                        borderRadius: "50%",
                        bgcolor: isCurrent ? MAIN_COLOR : "rgba(255,255,255,0.08)",
                        boxShadow: isCurrent ? "0 0 8px rgba(46, 204, 113, 0.4)" : "none",
                        transition: "all 0.3s ease",
                      }}
                    />
                  )}
                </Box>
              );
            })}
          </Stack>
        </Box>

        {/* ─── 질문 카드 ─── */}
        <Box
          key={currentQuestion.id}
          sx={{
            animation: transitioning
              ? `${cardExit} 0.35s ease-in forwards`
              : `${cardEnter} 0.4s ease-out both`,
          }}
        >
          {/* 질문 카드 */}
          <Box
            sx={{
              bgcolor: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(46, 204, 113, 0.1)",
              borderRadius: 4,
              p: { xs: 2.5, sm: 3 },
              mb: 3,
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: `linear-gradient(90deg, transparent, ${MAIN_COLOR}40, transparent)`,
              },
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 700,
                fontSize: { xs: "1.05rem", sm: "1.2rem" },
                lineHeight: 1.7,
                textAlign: "center",
              }}
            >
              {currentQuestion.text}
            </Typography>
          </Box>

          {/* ─── 2×2 그리드 옵션 ─── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1.2,
            }}
          >
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === idx;

              return (
                <Box
                  key={idx}
                  onClick={() => !transitioning && handleSelect(idx, option.scores)}
                  sx={{
                    cursor: transitioning ? "default" : "pointer",
                    p: { xs: 1.8, sm: 2 },
                    borderRadius: 3,
                    border: isSelected
                      ? `1.5px solid ${MAIN_COLOR}`
                      : "1px solid rgba(255,255,255,0.06)",
                    bgcolor: isSelected
                      ? "rgba(46, 204, 113, 0.1)"
                      : "rgba(255,255,255,0.02)",
                    color: isSelected ? "#fff" : "rgba(255,255,255,0.65)",
                    transition: "all 0.2s ease",
                    animation: isSelected
                      ? `${selectPulse} 0.5s ease-out`
                      : `${optionPop} 0.3s ease-out ${0.1 + idx * 0.06}s both`,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    minHeight: { xs: 80, sm: 90 },
                    position: "relative",
                    "&:hover": transitioning ? {} : {
                      bgcolor: isSelected
                        ? "rgba(46, 204, 113, 0.12)"
                        : "rgba(255,255,255,0.04)",
                      borderColor: isSelected
                        ? MAIN_COLOR
                        : "rgba(255,255,255,0.12)",
                      transform: "translateY(-2px)",
                    },
                    "&:active": transitioning ? {} : {
                      transform: "scale(0.97)",
                    },
                  }}
                >
                  {/* 뱃지 */}
                  <Box
                    sx={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.6rem",
                      fontWeight: 800,
                      bgcolor: isSelected
                        ? MAIN_COLOR
                        : "rgba(255,255,255,0.06)",
                      color: isSelected
                        ? "#fff"
                        : "rgba(255,255,255,0.3)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {String.fromCharCode(65 + idx)}
                  </Box>

                  <Typography
                    sx={{
                      fontSize: { xs: "0.78rem", sm: "0.84rem" },
                      fontWeight: 500,
                      lineHeight: 1.5,
                      flex: 1,
                    }}
                  >
                    {option.label}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* ─── 안내 ─── */}
        <Typography
          sx={{
            color: "rgba(255,255,255,0.1)",
            textAlign: "center",
            fontSize: "0.62rem",
            mt: 5,
          }}
        >
          본 테스트는 재미를 위한 것이며, 전문적인 심리 진단이 아닙니다.
        </Typography>
      </Container>
    </Box>
  );
}
