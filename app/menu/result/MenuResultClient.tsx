"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import { keyframes } from "@mui/material/styles";
import { RotateCcw, Share2, MapPin, Star, Clock } from "lucide-react";
import { findMenuById } from "@/data/menu-items";
import { copyToClipboard } from "@/lib/clipboard";

/**
 * 오늘의 메뉴 추천 결과 페이지
 * - Food Pop 감성: 밝고 생동감 있는 크림/오렌지 테마
 * - 기존 다크 배경 컨텐츠들과 완전히 차별화된 디자인
 */

// ─── 컬러 팔레트 ───
const PALETTE = {
  bg: "#FFFBF2",
  heroBg: "linear-gradient(145deg, #FF6B35 0%, #FF9A00 60%, #FFC107 100%)",
  accent: "#FF6B35",
  accentDeep: "#E85520",
  text: "#1C0A00",
  textMid: "#7A4A2A",
  textLight: "#B08060",
  cardBg: "#FFFFFF",
  cardBorder: "#F0E8D8",
  nutritionColors: {
    calories: { bg: "#FFF3E0", text: "#E65100", bar: "#FF6B35" },
    protein:  { bg: "#E8F5E9", text: "#2E7D32", bar: "#43A047" },
    fat:      { bg: "#FFF8E1", text: "#F57F17", bar: "#FBC02D" },
    carbs:    { bg: "#E3F2FD", text: "#1565C0", bar: "#1E88E5" },
  },
};

// ─── 애니메이션 ───
const fadeUp = keyframes`
  0%   { opacity: 0; transform: translateY(24px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const emojiBounce = keyframes`
  0%   { opacity: 0; transform: scale(0.3) rotate(-15deg); }
  50%  { transform: scale(1.15) rotate(5deg); }
  70%  { transform: scale(0.9) rotate(-3deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
`;

const ringPulse = keyframes`
  0%   { opacity: 0.6; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.6); }
`;

const slideBarIn = keyframes`
  0%   { width: 0; }
  100% { width: var(--bar-w); }
`;

const tagFloat = keyframes`
  0%   { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
`;

// ─── 목데이터: 주변 식당 ───
// TODO: Kakao Map API + 브라우저 Geolocation으로 실제 주변 식당 데이터 교체 예정
// 실제 구현 시: navigator.geolocation.getCurrentPosition() → Kakao 로컬 API 검색 → 거리순 정렬 → 상위 3개 표시
const MOCK_RESTAURANTS = [
  {
    id: 1,
    name: "여기 맛집",
    distance: "182m",
    rating: 4.8,
    reviewCount: 234,
    status: "영업중" as const,
    hours: "11:00 - 21:30",
    priceRange: "1~2만원",
  },
  {
    id: 2,
    name: "동네 식당",
    distance: "350m",
    rating: 4.6,
    reviewCount: 158,
    status: "영업중" as const,
    hours: "10:00 - 22:00",
    priceRange: "~1만원",
  },
  {
    id: 3,
    name: "우리동네 밥집",
    distance: "520m",
    rating: 4.5,
    reviewCount: 92,
    status: "영업중" as const,
    hours: "11:30 - 20:30",
    priceRange: "1~2만원",
  },
];

// 영양 항목 설정
const NUTRITION_KEYS = [
  { key: "calories" as const, label: "칼로리", unit: "kcal", max: 800 },
  { key: "protein" as const,  label: "단백질", unit: "g",    max: 60 },
  { key: "fat" as const,      label: "지방",   unit: "g",    max: 60 },
  { key: "carbs" as const,    label: "탄수화물", unit: "g",  max: 120 },
];

export default function MenuResultClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const menuId = searchParams.get("menu");

  const menu = menuId ? findMenuById(menuId) : null;

  const [showSnack, setShowSnack] = useState(false);
  const [barReady, setBarReady] = useState(false);

  // 영양 바 애니메이션 딜레이
  useEffect(() => {
    const t = setTimeout(() => setBarReady(true), 700);
    return () => clearTimeout(t);
  }, []);

  // 유효하지 않은 메뉴 ID 처리
  useEffect(() => {
    if (menuId !== null && !menu) {
      router.replace("/menu/select");
    }
  }, [menu, menuId, router]);

  if (!menu) return null;

  // 공유 핸들러
  const handleShare = async () => {
    const url = `${window.location.origin}/menu/result?menu=${menu.id}`;
    const text = `오늘의 추천 메뉴: ${menu.name} ${menu.emoji}\n\n${menu.description}\n\n심랩에서 확인해보세요!`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `오늘의 메뉴: ${menu.name}`, text, url });
      } catch { /* 취소 무시 */ }
    } else {
      const ok = await copyToClipboard(url);
      if (ok) setShowSnack(true);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: PALETTE.bg,
        position: "relative",
        overflow: "hidden",
        pb: { xs: 10, sm: 12 },
      }}
    >
      {/* ─── 히어로 섹션 ─── */}
      <Box
        sx={{
          background: PALETTE.heroBg,
          pt: { xs: "80px", sm: "96px" },
          pb: { xs: "80px", sm: "96px" },
          clipPath: "ellipse(130% 100% at 50% 0%)",
          position: "relative",
          textAlign: "center",
        }}
      >
        {/* 배지 */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.8,
            bgcolor: "rgba(255,255,255,0.22)",
            borderRadius: 99,
            px: 2,
            py: 0.6,
            mb: 3,
            animation: `${fadeUp} 0.4s ease-out both`,
          }}
        >
          <Typography
            sx={{
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.72rem",
              letterSpacing: "0.12em",
            }}
          >
            ✨ 오늘의 추천 메뉴
          </Typography>
        </Box>

        {/* 음식 이모지 (메인 히어로) */}
        <Box
          sx={{
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          {/* 퍼지는 링 */}
          {[0, 1].map((i) => (
            <Box
              key={i}
              sx={{
                position: "absolute",
                width: 140,
                height: 140,
                borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.35)",
                animation: `${ringPulse} 2s ease-out ${i * 0.8}s infinite`,
              }}
            />
          ))}
          {/* 이모지 원 배경 */}
          <Box
            sx={{
              width: { xs: 130, sm: 150 },
              height: { xs: 130, sm: 150 },
              borderRadius: "50%",
              bgcolor: "rgba(255,255,255,0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: `${emojiBounce} 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both`,
            }}
          >
            <Typography
              sx={{ fontSize: { xs: "4.5rem", sm: "5.5rem" }, lineHeight: 1 }}
            >
              {menu.emoji}
            </Typography>
          </Box>
        </Box>

        {/* 음식 이름 */}
        <Box sx={{ animation: `${fadeUp} 0.5s ease-out 0.3s both` }}>
          <Typography
            variant="h4"
            sx={{
              color: "#fff",
              fontWeight: 800,
              fontSize: { xs: "2rem", sm: "2.5rem" },
              textShadow: "0 2px 12px rgba(0,0,0,0.15)",
              mb: 0.5,
            }}
          >
            {menu.name}
          </Typography>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.8)",
              fontSize: { xs: "0.88rem", sm: "0.95rem" },
              px: 3,
              lineHeight: 1.65,
            }}
          >
            {menu.description}
          </Typography>
        </Box>

        {/* 태그 */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            justifyContent: "center",
            mt: 2,
            flexWrap: "wrap",
            gap: 0.8,
            px: 2,
          }}
        >
          {menu.tags.map((tag, i) => (
            <Box
              key={tag}
              sx={{
                bgcolor: "rgba(255,255,255,0.22)",
                borderRadius: 99,
                px: 1.5,
                py: 0.4,
                animation: `${tagFloat} 0.4s ease-out ${0.4 + i * 0.07}s both`,
              }}
            >
              <Typography
                sx={{ color: "#fff", fontSize: "0.75rem", fontWeight: 600 }}
              >
                {tag}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* ─── 본문 ─── */}
      <Container maxWidth="sm" sx={{ mt: -3, position: "relative", zIndex: 1 }}>

        {/* ── 영양 정보 카드 ── */}
        <Box
          sx={{
            bgcolor: PALETTE.cardBg,
            borderRadius: 4,
            border: `1px solid ${PALETTE.cardBorder}`,
            p: { xs: 2.5, sm: 3 },
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            animation: `${fadeUp} 0.5s ease-out 0.5s both`,
            mb: 2,
          }}
        >
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2.5 }}>
            <Typography sx={{ fontSize: "1.2rem" }}>🥗</Typography>
            <Typography
              sx={{
                fontWeight: 700,
                color: PALETTE.text,
                fontSize: "0.95rem",
              }}
            >
              영양 정보
            </Typography>
            <Typography
              sx={{
                fontSize: "0.68rem",
                color: PALETTE.textLight,
                bgcolor: "#F5F0E8",
                px: 1,
                py: 0.3,
                borderRadius: 99,
              }}
            >
              1인분 기준
            </Typography>
          </Stack>

          {/* 칼로리 메인 표시 */}
          <Box
            sx={{
              textAlign: "center",
              mb: 3,
              py: 2,
              borderRadius: 3,
              bgcolor: PALETTE.nutritionColors.calories.bg,
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "2.4rem", sm: "2.8rem" },
                fontWeight: 900,
                color: PALETTE.nutritionColors.calories.text,
                lineHeight: 1,
              }}
            >
              {menu.nutrition.calories}
            </Typography>
            <Typography
              sx={{
                color: PALETTE.nutritionColors.calories.text,
                fontSize: "0.8rem",
                fontWeight: 600,
                opacity: 0.7,
                mt: 0.3,
              }}
            >
              kcal
            </Typography>
          </Box>

          {/* PFC 바 차트 */}
          <Stack spacing={2}>
            {NUTRITION_KEYS.filter((n) => n.key !== "calories").map((item) => {
              const value = menu.nutrition[item.key];
              const pct = Math.min((value / item.max) * 100, 100);
              const color = PALETTE.nutritionColors[item.key];
              return (
                <Box key={item.key}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ mb: 0.6 }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: color.text,
                      }}
                    >
                      {item.label}
                    </Typography>
                    <Typography
                      sx={{ fontSize: "0.8rem", fontWeight: 700, color: color.text }}
                    >
                      {value}
                      <Box component="span" sx={{ fontWeight: 400, opacity: 0.7 }}>
                        {item.unit}
                      </Box>
                    </Typography>
                  </Stack>
                  {/* 프로그레스 바 */}
                  <Box
                    sx={{
                      height: 8,
                      borderRadius: 99,
                      bgcolor: color.bg,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        borderRadius: 99,
                        bgcolor: color.bar,
                        width: barReady ? `${pct}%` : "0%",
                        transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
                      }}
                    />
                  </Box>
                </Box>
              );
            })}
          </Stack>

          <Typography
            sx={{
              color: PALETTE.textLight,
              fontSize: "0.63rem",
              mt: 2,
              textAlign: "center",
              lineHeight: 1.6,
            }}
          >
            * 영양 정보는 공공데이터포털 기반 참고값으로 실제와 다를 수 있습니다.
          </Typography>
        </Box>

        {/* ── 주변 식당 섹션 ── */}
        <Box
          sx={{
            bgcolor: PALETTE.cardBg,
            borderRadius: 4,
            border: `1px solid ${PALETTE.cardBorder}`,
            p: { xs: 2.5, sm: 3 },
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            animation: `${fadeUp} 0.5s ease-out 0.65s both`,
            mb: 3,
          }}
        >
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 0.5 }}>
            <Typography sx={{ fontSize: "1.2rem" }}>📍</Typography>
            <Typography sx={{ fontWeight: 700, color: PALETTE.text, fontSize: "0.95rem" }}>
              내 주변 식당 TOP 3
            </Typography>
          </Stack>

          {/* TODO: Kakao Map API + Geolocation 연동 예정 안내 */}
          <Box
            sx={{
              bgcolor: "#FFF8EC",
              border: "1px solid #FFE4B5",
              borderRadius: 2,
              px: 2,
              py: 1.2,
              mb: 2.5,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography sx={{ fontSize: "1rem" }}>🚧</Typography>
            <Typography
              sx={{ fontSize: "0.72rem", color: "#9A6400", lineHeight: 1.5 }}
            >
              위치 기반 식당 검색 기능은 업데이트 예정입니다.
              <br />
              현재는 예시 데이터가 표시됩니다.
            </Typography>
          </Box>

          {/* 식당 카드 목록 */}
          <Stack spacing={1.5}>
            {MOCK_RESTAURANTS.map((restaurant, i) => (
              <Box
                key={restaurant.id}
                sx={{
                  border: `1px solid ${PALETTE.cardBorder}`,
                  borderRadius: 3,
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  bgcolor: PALETTE.bg,
                  animation: `${fadeUp} 0.4s ease-out ${0.7 + i * 0.1}s both`,
                  transition: "box-shadow 0.2s ease",
                  "&:hover": {
                    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                  },
                }}
              >
                {/* 순위 배지 */}
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    bgcolor:
                      i === 0
                        ? "#FF6B35"
                        : i === 1
                        ? "#FF9A00"
                        : "#FFC107",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Typography
                    sx={{ color: "#fff", fontWeight: 800, fontSize: "0.8rem" }}
                  >
                    {i + 1}
                  </Typography>
                </Box>

                {/* 식당 정보 */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" spacing={0.8} alignItems="center">
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.88rem",
                        color: PALETTE.text,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {menu.name} {restaurant.name}
                    </Typography>
                    <Box
                      sx={{
                        flexShrink: 0,
                        bgcolor:
                          restaurant.status === "영업중"
                            ? "rgba(46,204,113,0.12)"
                            : "#F5F0E8",
                        borderRadius: 99,
                        px: 0.8,
                        py: 0.2,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.62rem",
                          fontWeight: 700,
                          color:
                            restaurant.status === "영업중"
                              ? "#2ECC71"
                              : PALETTE.textLight,
                        }}
                      >
                        {restaurant.status}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1.2} sx={{ mt: 0.4 }}>
                    <Stack direction="row" spacing={0.3} alignItems="center">
                      <Star size={11} color="#FFC107" fill="#FFC107" />
                      <Typography sx={{ fontSize: "0.73rem", color: PALETTE.textMid }}>
                        {restaurant.rating}
                      </Typography>
                      <Typography sx={{ fontSize: "0.68rem", color: PALETTE.textLight }}>
                        ({restaurant.reviewCount})
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.3} alignItems="center">
                      <MapPin size={11} color={PALETTE.textLight} />
                      <Typography sx={{ fontSize: "0.73rem", color: PALETTE.textLight }}>
                        {restaurant.distance}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.3} alignItems="center">
                      <Clock size={11} color={PALETTE.textLight} />
                      <Typography sx={{ fontSize: "0.73rem", color: PALETTE.textLight }}>
                        {restaurant.hours}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>

                {/* 가격대 */}
                <Typography
                  sx={{
                    fontSize: "0.7rem",
                    color: PALETTE.textLight,
                    flexShrink: 0,
                    fontWeight: 600,
                  }}
                >
                  {restaurant.priceRange}
                </Typography>
              </Box>
            ))}
          </Stack>

          <Typography
            sx={{
              color: PALETTE.textLight,
              fontSize: "0.63rem",
              mt: 1.5,
              textAlign: "center",
              lineHeight: 1.6,
            }}
          >
            * 거리 및 식당 위치 정보는 정확하지 않을 수 있습니다.
            <br />
            * 위치 정보는 Kakao Map API를 통해 검색되며 서버에 저장되지 않습니다.
          </Typography>
        </Box>

        {/* ── 버튼 그룹 ── */}
        <Stack
          spacing={1.5}
          sx={{ animation: `${fadeUp} 0.5s ease-out 0.8s both` }}
        >
          {/* 공유하기 */}
          <Button
            onClick={handleShare}
            fullWidth
            size="large"
            startIcon={<Share2 size={18} />}
            sx={{
              py: 1.7,
              borderRadius: 99,
              fontWeight: 700,
              fontSize: "0.95rem",
              textTransform: "none",
              background: "linear-gradient(135deg, #FF6B35 0%, #FF9A00 100%)",
              color: "#fff",
              boxShadow: "0 4px 20px rgba(255,107,53,0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #E85520 0%, #E88A00 100%)",
                boxShadow: "0 6px 28px rgba(255,107,53,0.4)",
                transform: "translateY(-1px)",
              },
              "&:active": { transform: "scale(0.98)" },
            }}
          >
            이 메뉴 공유하기
          </Button>

          {/* 다시 뽑기 */}
          <Button
            onClick={() => router.push("/menu/select")}
            fullWidth
            size="large"
            variant="outlined"
            startIcon={<RotateCcw size={18} />}
            sx={{
              py: 1.7,
              borderRadius: 99,
              fontWeight: 700,
              fontSize: "0.95rem",
              textTransform: "none",
              borderColor: "#F0E0C8",
              color: PALETTE.textMid,
              bgcolor: PALETTE.cardBg,
              "&:hover": {
                borderColor: PALETTE.accent,
                color: PALETTE.accent,
                bgcolor: "rgba(255,107,53,0.04)",
              },
            }}
          >
            다시 뽑기
          </Button>
        </Stack>
      </Container>

      {/* ─── 복사 완료 스낵바 ─── */}
      <Snackbar
        open={showSnack}
        autoHideDuration={2200}
        onClose={() => setShowSnack(false)}
        message="링크가 복사되었어요!"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{
          "& .MuiSnackbarContent-root": {
            borderRadius: 3,
            bgcolor: "#1C0A00",
            color: "#fff",
            fontWeight: 600,
            fontSize: "0.85rem",
            mb: 7,
          },
        }}
      />
    </Box>
  );
}
