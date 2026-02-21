"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { keyframes } from "@mui/material/styles";
import { Shuffle, ChefHat } from "lucide-react";
import {
  MOOD_OPTIONS,
  CATEGORY_OPTIONS,
  type MoodId,
  type CategoryId,
  getMenusByMood,
  getMenusByCategory,
  pickRandomMenu,
  MENU_ITEMS,
} from "@/data/menu-items";

// ─── 컬러 팔레트 ───
// 기존 컨텐츠(다크 배경)와 대비되는 밝고 생동감 있는 Food Pop 감성
const PALETTE = {
  bg: "#FFFBF2",
  heroBg: "linear-gradient(145deg, #FF6B35 0%, #FF9A00 60%, #FFC107 100%)",
  accent: "#FF6B35",
  accentDeep: "#E85520",
  tabActive: "#FF6B35",
  tabBg: "rgba(255,107,53,0.08)",
  cardBorder: "#F0E8D8",
  cardBg: "#FFFFFF",
  cardSelected: "rgba(255,107,53,0.06)",
  cardSelectedBorder: "#FF6B35",
  text: "#1C0A00",
  textMid: "#7A4A2A",
  textLight: "#B08060",
};

// ─── 애니메이션 ───
const floatIn = keyframes`
  0%   { opacity: 0; transform: translateY(28px) scale(0.96); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
`;

const heroEntrance = keyframes`
  0%   { opacity: 0; transform: translateY(-12px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const emojiPop = keyframes`
  0%   { transform: scale(1); }
  30%  { transform: scale(1.22) rotate(-5deg); }
  60%  { transform: scale(0.95) rotate(3deg); }
  100% { transform: scale(1) rotate(0deg); }
`;

const spinRoll = keyframes`
  0%   { transform: rotate(0deg) scale(1); }
  50%  { transform: rotate(180deg) scale(1.15); }
  100% { transform: rotate(360deg) scale(1); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 4px 24px rgba(255,107,53,0.35); }
  50%       { box-shadow: 0 8px 40px rgba(255,107,53,0.55); }
`;

// 배경 떠다니는 음식 이모지 (퍼포먼스 위해 절대위치 고정)
const BG_FOODS = [
  { emoji: "🍕", top: "8%",  left: "5%",  size: "2.2rem", opacity: 0.07, dur: 7 },
  { emoji: "🍜", top: "14%", right: "6%", size: "1.8rem", opacity: 0.07, dur: 9 },
  { emoji: "🥗", top: "30%", left: "3%",  size: "1.6rem", opacity: 0.06, dur: 8 },
  { emoji: "🍣", top: "42%", right: "4%", size: "2rem",   opacity: 0.07, dur: 10 },
  { emoji: "🍔", top: "58%", left: "6%",  size: "1.8rem", opacity: 0.06, dur: 7.5 },
  { emoji: "🥡", top: "70%", right: "7%", size: "1.6rem", opacity: 0.06, dur: 9.5 },
  { emoji: "🍰", top: "82%", left: "4%",  size: "1.7rem", opacity: 0.06, dur: 8.5 },
  { emoji: "🍲", top: "88%", right: "5%", size: "2rem",   opacity: 0.07, dur: 11 },
];

const bgDrift = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50%       { transform: translateY(-16px) rotate(8deg); }
`;

type TabMode = "mood" | "category";

export default function MenuSelectPage() {
  const router = useRouter();
  const [tab, setTab] = useState<TabMode>("mood");
  const [selectedMood, setSelectedMood] = useState<MoodId | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);
  const [isPicking, setIsPicking] = useState(false);

  const isReady =
    tab === "mood" ? selectedMood !== null : selectedCategory !== null;

  // 메뉴 뽑기 핸들러
  const handlePick = useCallback(() => {
    if (!isReady || isPicking) return;

    let pool = MENU_ITEMS;

    if (tab === "mood" && selectedMood) {
      pool = getMenusByMood(selectedMood);
    } else if (tab === "category" && selectedCategory) {
      if (selectedCategory === "random") {
        pool = MENU_ITEMS;
      } else {
        pool = getMenusByCategory(selectedCategory);
      }
    }

    if (pool.length === 0) pool = MENU_ITEMS;

    const picked = pickRandomMenu(pool);

    setIsPicking(true);
    // 짧은 딜레이로 뽑기 연출 후 결과 페이지 이동
    setTimeout(() => {
      router.push(`/menu/result?menu=${picked.id}`);
    }, 900);
  }, [isReady, isPicking, tab, selectedMood, selectedCategory, router]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: PALETTE.bg,
        position: "relative",
        overflow: "hidden",
        pb: { xs: 12, sm: 14 },
      }}
    >
      {/* ─── 배경 음식 이모지 ─── */}
      {BG_FOODS.map((f, i) => (
        <Box
          key={i}
          sx={{
            position: "fixed",
            top: f.top,
            left: f.left,
            right: f.right,
            fontSize: f.size,
            opacity: f.opacity,
            animation: `${bgDrift} ${f.dur}s ease-in-out ${i * 0.6}s infinite`,
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 0,
          }}
        >
          {f.emoji}
        </Box>
      ))}

      {/* ─── 히어로 배너 ─── */}
      <Box
        sx={{
          background: PALETTE.heroBg,
          pt: { xs: "80px", sm: "96px" },
          pb: { xs: "56px", sm: "64px" },
          clipPath: "ellipse(120% 100% at 50% 0%)",
          position: "relative",
          zIndex: 1,
          animation: `${heroEntrance} 0.5s ease-out both`,
        }}
      >
        <Container maxWidth="sm" sx={{ textAlign: "center" }}>
          <Typography
            sx={{
              fontSize: { xs: "4rem", sm: "5rem" },
              lineHeight: 1,
              mb: 2,
              animation: `${emojiPop} 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both`,
            }}
          >
            🍽️
          </Typography>
          <Typography
            variant="h4"
            sx={{
              color: "#fff",
              fontWeight: 800,
              fontSize: { xs: "1.75rem", sm: "2.2rem" },
              lineHeight: 1.25,
              mb: 1,
              textShadow: "0 2px 12px rgba(0,0,0,0.15)",
            }}
          >
            오늘 뭐 먹지?
          </Typography>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.85)",
              fontSize: { xs: "0.9rem", sm: "1rem" },
              lineHeight: 1.6,
            }}
          >
            기분에 딱 맞는 메뉴를 찾아드릴게요
          </Typography>
        </Container>
      </Box>

      {/* ─── 본문 ─── */}
      <Container
        maxWidth="sm"
        sx={{ position: "relative", zIndex: 1, mt: { xs: -2, sm: -2 } }}
      >
        {/* ── 탭 스위처 ── */}
        <Box
          sx={{
            animation: `${floatIn} 0.5s ease-out 0.15s both`,
            mb: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              bgcolor: "rgba(255,107,53,0.06)",
              borderRadius: 99,
              p: 0.5,
              border: "1px solid rgba(255,107,53,0.12)",
            }}
          >
            {(["mood", "category"] as TabMode[]).map((t) => (
              <Box
                key={t}
                onClick={() => setTab(t)}
                sx={{
                  flex: 1,
                  py: 1.2,
                  textAlign: "center",
                  borderRadius: 99,
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: { xs: "0.85rem", sm: "0.92rem" },
                  transition: "all 0.22s ease",
                  bgcolor: tab === t ? PALETTE.accent : "transparent",
                  color: tab === t ? "#fff" : PALETTE.textMid,
                  boxShadow: tab === t ? "0 2px 12px rgba(255,107,53,0.3)" : "none",
                  userSelect: "none",
                }}
              >
                {t === "mood" ? "😤 기분으로 추천" : "🍽️ 카테고리 선택"}
              </Box>
            ))}
          </Box>
        </Box>

        {/* ── 기분 선택 ── */}
        {tab === "mood" && (
          <Box sx={{ animation: `${floatIn} 0.4s ease-out both` }}>
            <Typography
              sx={{
                color: PALETTE.textMid,
                fontSize: "0.8rem",
                fontWeight: 600,
                mb: 2,
                letterSpacing: "0.04em",
              }}
            >
              지금 어떤 기분이에요?
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 1.5,
              }}
            >
              {MOOD_OPTIONS.map((mood, i) => {
                const isSelected = selectedMood === mood.id;
                return (
                  <Box
                    key={mood.id}
                    onClick={() => setSelectedMood(mood.id)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      p: { xs: 1.6, sm: 2 },
                      borderRadius: 3,
                      border: "1.5px solid",
                      borderColor: isSelected
                        ? PALETTE.cardSelectedBorder
                        : PALETTE.cardBorder,
                      bgcolor: isSelected ? PALETTE.cardSelected : PALETTE.cardBg,
                      cursor: "pointer",
                      transition: "all 0.18s ease",
                      boxShadow: isSelected
                        ? "0 2px 14px rgba(255,107,53,0.18)"
                        : "0 1px 4px rgba(0,0,0,0.04)",
                      animation: `${floatIn} 0.4s ease-out ${i * 0.04}s both`,
                      "&:hover": {
                        borderColor: PALETTE.accent,
                        boxShadow: "0 2px 14px rgba(255,107,53,0.18)",
                        transform: "translateY(-1px)",
                      },
                      "&:active": { transform: "scale(0.97)" },
                    }}
                  >
                    <Typography sx={{ fontSize: "1.8rem", lineHeight: 1, flexShrink: 0 }}>
                      {mood.emoji}
                    </Typography>
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.88rem",
                          color: isSelected ? PALETTE.accent : PALETTE.text,
                          lineHeight: 1.3,
                        }}
                      >
                        {mood.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.72rem",
                          color: PALETTE.textLight,
                          lineHeight: 1.4,
                          mt: 0.2,
                        }}
                      >
                        {mood.desc}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}

        {/* ── 카테고리 선택 ── */}
        {tab === "category" && (
          <Box sx={{ animation: `${floatIn} 0.4s ease-out both` }}>
            <Typography
              sx={{
                color: PALETTE.textMid,
                fontSize: "0.8rem",
                fontWeight: 600,
                mb: 2,
                letterSpacing: "0.04em",
              }}
            >
              어떤 음식이 먹고 싶어요?
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 1.5,
              }}
            >
              {CATEGORY_OPTIONS.map((cat, i) => {
                const isSelected = selectedCategory === cat.id;
                const isRandom = cat.id === "random";
                return (
                  <Box
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 0.8,
                      py: { xs: 2.2, sm: 2.5 },
                      px: 1,
                      borderRadius: 3,
                      border: "1.5px solid",
                      borderColor: isSelected
                        ? isRandom
                          ? "#7B61FF"
                          : PALETTE.cardSelectedBorder
                        : PALETTE.cardBorder,
                      bgcolor: isSelected
                        ? isRandom
                          ? "rgba(123,97,255,0.06)"
                          : PALETTE.cardSelected
                        : PALETTE.cardBg,
                      cursor: "pointer",
                      transition: "all 0.18s ease",
                      boxShadow: isSelected
                        ? isRandom
                          ? "0 2px 14px rgba(123,97,255,0.18)"
                          : "0 2px 14px rgba(255,107,53,0.18)"
                        : "0 1px 4px rgba(0,0,0,0.04)",
                      animation: `${floatIn} 0.4s ease-out ${i * 0.05}s both`,
                      "&:hover": {
                        borderColor: isRandom ? "#7B61FF" : PALETTE.accent,
                        transform: "translateY(-2px)",
                        boxShadow: isRandom
                          ? "0 4px 16px rgba(123,97,255,0.2)"
                          : "0 4px 16px rgba(255,107,53,0.2)",
                      },
                      "&:active": { transform: "scale(0.96)" },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "2.2rem",
                        lineHeight: 1,
                        animation: isSelected
                          ? `${emojiPop} 0.4s cubic-bezier(0.22,1,0.36,1) both`
                          : "none",
                      }}
                    >
                      {cat.emoji}
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.82rem",
                        color: isSelected
                          ? isRandom
                            ? "#7B61FF"
                            : PALETTE.accent
                          : PALETTE.text,
                      }}
                    >
                      {cat.label}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}

        {/* ── 뽑기 안내 문구 ── */}
        {!isReady && (
          <Typography
            sx={{
              textAlign: "center",
              color: PALETTE.textLight,
              fontSize: "0.78rem",
              mt: 3,
              animation: `${floatIn} 0.4s ease-out 0.5s both`,
            }}
          >
            {tab === "mood" ? "기분을 선택하면 버튼이 활성화돼요 👆" : "카테고리를 선택하면 버튼이 활성화돼요 👆"}
          </Typography>
        )}
      </Container>

      {/* ─── 하단 고정 뽑기 버튼 ─── */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          px: 2,
          pb: { xs: 3, sm: 4 },
          pt: 2,
          background: "linear-gradient(to top, rgba(255,251,242,1) 60%, rgba(255,251,242,0) 100%)",
        }}
      >
        <Box sx={{ maxWidth: 480, mx: "auto" }}>
          <Button
            onClick={handlePick}
            disabled={!isReady || isPicking}
            fullWidth
            size="large"
            startIcon={
              isPicking ? (
                <Box
                  sx={{
                    fontSize: "1.3rem",
                    animation: `${spinRoll} 0.8s linear infinite`,
                    display: "inline-flex",
                  }}
                >
                  🎲
                </Box>
              ) : (
                <ChefHat size={20} />
              )
            }
            sx={{
              py: 1.9,
              borderRadius: 99,
              fontSize: "1.05rem",
              fontWeight: 800,
              textTransform: "none",
              letterSpacing: "0.01em",
              background: isReady
                ? "linear-gradient(135deg, #FF6B35 0%, #FF9A00 100%)"
                : "#E8DDD0",
              color: isReady ? "#fff" : "#B0A090",
              transition: "all 0.25s ease",
              animation: isReady && !isPicking ? `${pulseGlow} 2s ease-in-out infinite` : "none",
              "&:hover": isReady
                ? {
                    background: "linear-gradient(135deg, #E85520 0%, #E88A00 100%)",
                    transform: "translateY(-1px)",
                  }
                : {},
              "&:active": { transform: "scale(0.98)" },
              "&.Mui-disabled": {
                background: "#E8DDD0",
                color: "#B0A090",
              },
            }}
          >
            {isPicking ? "메뉴 고르는 중..." : "메뉴 뽑기! 🎯"}
          </Button>

          {/* 법적 고지 */}
          <Stack spacing={0.3} sx={{ mt: 1.5, textAlign: "center" }}>
            <Typography sx={{ color: "#C0A890", fontSize: "0.65rem" }}>
              영양 정보는 공공데이터 기반 참고값으로 실제와 다를 수 있습니다.
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}