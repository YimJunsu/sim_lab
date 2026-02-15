"use client";

import { useState, useCallback, useMemo } from "react";
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
  getEmotionCommentWithIndex,
  type Question,
  type EmotionScores,
} from "@/lib/mymood-questions";

/**
 * 감정 점수화 - 테스트 페이지
 * 인사이드아웃 감성: 감정 구슬, 그라데이션, 라운드 UI
 */

// ─── 감정 컬러 팔레트 (인사이드아웃) ───
const EMOTION_COLORS = ["#FFD93D", "#7B8CDE", "#FF6B6B", "#69D2A0", "#E891CF"];

// 진행도에 따라 그라데이션 색상 변화
function getProgressGradient(progress: number) {
  if (progress < 20) return { from: "#FFD93D", to: "#FFE066" };
  if (progress < 40) return { from: "#7B8CDE", to: "#9BA8E8" };
  if (progress < 60) return { from: "#FF6B6B", to: "#FF8585" };
  if (progress < 80) return { from: "#69D2A0", to: "#8DDDB8" };
  return { from: "#E891CF", to: "#F0A8DD" };
}

// ─── 애니메이션 ───
const fadeSlideIn = keyframes`
  0%   { opacity: 0; transform: translateY(24px) scale(0.96); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
`;

const fadeSlideOut = keyframes`
  0%   { opacity: 1; transform: translateY(0) scale(1); }
  100% { opacity: 0; transform: translateY(-20px) scale(0.96); }
`;

const orbBounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-8px); }
`;

const bubbleDrift = keyframes`
  0%   { transform: translate(0, 0) scale(1); }
  25%  { transform: translate(30px, -20px) scale(1.08); }
  50%  { transform: translate(-10px, -40px) scale(0.95); }
  75%  { transform: translate(-30px, -15px) scale(1.05); }
  100% { transform: translate(0, 0) scale(1); }
`;

const optionPop = keyframes`
  0%   { opacity: 0; transform: translateX(-12px) scale(0.95); }
  100% { opacity: 1; transform: translateX(0) scale(1); }
`;

const selectedPulse = keyframes`
  0%   { box-shadow: 0 0 0 0 var(--pulse-color); }
  70%  { box-shadow: 0 0 0 10px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
`;

const QUESTION_EMOJIS = ["😊", "😴", "😤", "😌", "💫", "🌈", "✨", "🎭", "💭", "🔮"];

// 옵션의 대표 감정색 (가장 높은 점수 감정)
const EMOTION_COLOR_MAP: Record<string, string> = {
  joy: "#FFD93D",
  fatigue: "#7B8CDE",
  stress: "#FF6B6B",
  calm: "#69D2A0",
  excitement: "#E891CF",
};

function getOptionAccentColor(scores: EmotionScores) {
  const entries = Object.entries(scores) as [keyof EmotionScores, number][];
  const dominant = entries.reduce((a, b) => (b[1] > a[1] ? b : a));
  return EMOTION_COLOR_MAP[dominant[0]];
}

export default function MymoodTestPage() {
  const router = useRouter();

  const questions = useMemo(() => getRandomQuestions(10), []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<EmotionScores[]>([]);
  const [transitioning, setTransitioning] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const currentQuestion: Question | undefined = questions[currentIndex];
  const progress = (currentIndex / questions.length) * 100;
  const grad = getProgressGradient(progress);
  const questionEmoji = QUESTION_EMOJIS[currentIndex % QUESTION_EMOJIS.length];

  const handleSelect = useCallback(
    (optionIndex: number, scores: EmotionScores) => {
      if (transitioning) return;

      setSelectedOption(optionIndex);
      setTransitioning(true);

      setTimeout(() => {
        const newAnswers = [...answers, scores];
        setAnswers(newAnswers);

        if (currentIndex + 1 >= questions.length) {
          const result = calculateEmotionScores(newAnswers);
          const { comment, commentIdx } = getEmotionCommentWithIndex(result);
          const today = new Date().toISOString().slice(0, 10);

          const moodData = { scores: result, comment, date: today, commentIdx };

          sessionStorage.setItem("mymoodResult", JSON.stringify(moodData));

          const historyKey = `mymood_${today}`;
          localStorage.setItem(historyKey, JSON.stringify(moodData));

          router.push("/mymood/result-mymood");
        } else {
          setCurrentIndex((prev) => prev + 1);
          setSelectedOption(null);
          setTransitioning(false);
        }
      }, 450);
    },
    [transitioning, answers, currentIndex, questions.length, router]
  );

  if (!currentQuestion) return null;

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        background: "linear-gradient(170deg, #1a103d 0%, #251758 35%, #1e1250 65%, #0f0a2e 100%)",
        pt: { xs: 14, sm: 12 },
        pb: { xs: 6, sm: 10 },
        overflow: "hidden",
      }}
    >
      {/* ─── 배경 물방울 (스크린세이버) ─── */}
      {[
        { top: "4%", left: "5%", size: 45, color: "#FFD93D", dur: 8, delay: 0 },
        { top: "10%", right: "8%", size: 60, color: "#FF6B6B", dur: 10, delay: 1 },
        { top: "22%", left: "78%", size: 35, color: "#69D2A0", dur: 7.5, delay: 0.5 },
        { top: "30%", left: "3%", size: 55, color: "#7B8CDE", dur: 9, delay: 2 },
        { top: "45%", right: "5%", size: 40, color: "#E891CF", dur: 11, delay: 0.8 },
        { top: "16%", left: "40%", size: 30, color: "#FFD93D", dur: 12, delay: 3 },
        { top: "55%", left: "8%", size: 38, color: "#FF6B6B", dur: 9.5, delay: 1.5 },
        { top: "65%", right: "12%", size: 50, color: "#69D2A0", dur: 10.5, delay: 2.5 },
        { top: "78%", left: "25%", size: 32, color: "#7B8CDE", dur: 8.5, delay: 0.3 },
        { top: "86%", right: "20%", size: 42, color: "#E891CF", dur: 11.5, delay: 1.8 },
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
            background: `radial-gradient(circle at 40% 40%, ${orb.color}20, ${orb.color}08)`,
            animation: `${bubbleDrift} ${orb.dur}s ease-in-out ${orb.delay}s infinite`,
            pointerEvents: "none",
          }}
        />
      ))}

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        {/* ─── 프로그레스 영역 ─── */}
        <Box sx={{ animation: `${fadeSlideIn} 0.4s ease-out both`, mb: { xs: 3, sm: 4 } }}>
          {/* 감정 구슬 + 이모지 */}
          <Stack direction="row" sx={{ alignItems: "center", justifyContent: "center", mb: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: `radial-gradient(circle at 35% 35%, ${grad.from}cc, ${grad.to}66)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.4rem",
                boxShadow: `0 0 20px ${grad.from}33`,
                animation: `${orbBounce} 3s ease-in-out infinite`,
              }}
            >
              {questionEmoji}
            </Box>
          </Stack>

          {/* 진행 바 */}
          <Stack direction="row" sx={{ justifyContent: "space-between", mb: 0.8 }}>
            <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", fontWeight: 600 }}>
              {currentIndex + 1} / {questions.length}
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", fontWeight: 600 }}>
              {Math.round(progress)}%
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: "rgba(255,255,255,0.06)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 4,
                background: `linear-gradient(90deg, ${grad.from}, ${grad.to})`,
                transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              },
            }}
          />

          {/* 작은 구슬 진행도 */}
          <Stack direction="row" sx={{ justifyContent: "center", gap: 0.8, mt: 1.5 }}>
            {questions.map((_, i) => {
              const done = i < currentIndex;
              const active = i === currentIndex;
              const c = EMOTION_COLORS[i % 5];
              return (
                <Box
                  key={i}
                  sx={{
                    width: active ? 12 : 8,
                    height: active ? 12 : 8,
                    borderRadius: "50%",
                    bgcolor: done ? `${c}aa` : active ? c : "rgba(255,255,255,0.1)",
                    transition: "all 0.3s ease",
                    boxShadow: active ? `0 0 8px ${c}66` : "none",
                  }}
                />
              );
            })}
          </Stack>
        </Box>

        {/* ─── 질문 카드 ─── */}
        <Box
          key={currentQuestion.id}
          sx={{
            animation: transitioning
              ? `${fadeSlideOut} 0.3s ease-in forwards`
              : `${fadeSlideIn} 0.4s ease-out both`,
          }}
        >
          <Box
            sx={{
              bgcolor: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(16px)",
              borderRadius: 5,
              border: "1px solid rgba(255,255,255,0.07)",
              p: { xs: 3, sm: 4 },
              mb: 2.5,
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: `linear-gradient(90deg, ${grad.from}, ${grad.to})`,
                borderRadius: "12px 12px 0 0",
              },
            }}
          >
            <Typography
              sx={{
                color: grad.from,
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                fontWeight: 700,
                mb: 2,
              }}
            >
              QUESTION {currentIndex + 1}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "#fff",
                fontWeight: 600,
                fontSize: { xs: "1.1rem", sm: "1.25rem" },
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
              const accentColor = getOptionAccentColor(option.scores);

              return (
                <Button
                  key={idx}
                  fullWidth
                  onClick={() => handleSelect(idx, option.scores)}
                  disabled={transitioning}
                  sx={{
                    py: { xs: 1.8, sm: 2 },
                    px: 2.5,
                    borderRadius: 3.5,
                    border: `1.5px solid ${isSelected ? accentColor : "rgba(255,255,255,0.06)"}`,
                    bgcolor: isSelected ? `${accentColor}15` : "rgba(255,255,255,0.03)",
                    backdropFilter: "blur(8px)",
                    color: isSelected ? "#fff" : "rgba(255,255,255,0.8)",
                    textAlign: "left",
                    justifyContent: "flex-start",
                    fontWeight: 500,
                    fontSize: { xs: "0.9rem", sm: "0.95rem" },
                    textTransform: "none",
                    transition: "all 0.25s ease",
                    animation: `${optionPop} 0.4s ease-out ${0.05 + idx * 0.08}s both`,
                    "--pulse-color": `${accentColor}44`,
                    ...(isSelected && {
                      animation: `${selectedPulse} 0.6s ease-out`,
                    }),
                    "&:hover": {
                      bgcolor: isSelected ? `${accentColor}20` : "rgba(255,255,255,0.06)",
                      borderColor: isSelected ? accentColor : "rgba(255,255,255,0.15)",
                      transform: "translateX(4px)",
                    },
                    "&:disabled": {
                      color: isSelected ? "#fff" : "rgba(255,255,255,0.5)",
                    },
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: isSelected
                        ? `radial-gradient(circle at 35% 35%, ${accentColor}, ${accentColor}88)`
                        : "rgba(255,255,255,0.06)",
                      border: isSelected ? "none" : "1.5px solid rgba(255,255,255,0.12)",
                      color: isSelected ? "#1a103d" : "rgba(255,255,255,0.5)",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      mr: 1.5,
                      flexShrink: 0,
                      transition: "all 0.25s ease",
                      boxShadow: isSelected ? `0 0 12px ${accentColor}44` : "none",
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
        <Stack spacing={0.5} sx={{ mt: 4, alignItems: "center", animation: `${fadeSlideIn} 0.4s ease-out 0.3s both` }}>
          <Typography
            variant="caption"
            sx={{ color: "rgba(255,255,255,0.2)", textAlign: "center", fontSize: "0.7rem" }}
          >
            본 테스트는 재미를 위한 것이며, 전문적인 심리 진단이 아닙니다.
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "rgba(255,255,255,0.15)", textAlign: "center", fontSize: "0.7rem" }}
          >
            입력된 정보는 저장되지 않습니다.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}