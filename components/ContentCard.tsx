"use client";

import { type ReactNode } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { ArrowRight } from "lucide-react";
import { UtensilsCrossed, Smile, Heart, Sparkles, PawPrint } from "lucide-react";

interface ContentItem {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
  tag: string;
}

const ICON_SIZE = 22;
const ICON_COLOR = "#1e3a5f";

const contents: ContentItem[] = [
  {
    icon: <UtensilsCrossed size={ICON_SIZE} color={ICON_COLOR} />,
    title: "오늘의 메뉴 추천",
    description: "기분과 취향에 딱 맞는 메뉴를 골라드려요.",
    href: "/menu/select",
    tag: "추천",
  },
  {
    icon: <Smile size={ICON_SIZE} color={ICON_COLOR} />,
    title: "감정 점수화",
    description: "지금 내 감정 상태를 숫자로 확인해봐요.",
    href: "/mymood/question",
    tag: "셀프체크",
  },
  {
    icon: <Heart size={ICON_SIZE} color={ICON_COLOR} />,
    title: "이상형 성향 테스트",
    description: "나의 연애 성향과 이상형을 알아봐요.",
    href: "/ideal-type/test",
    tag: "테스트",
  },
  {
    icon: <Sparkles size={ICON_SIZE} color={ICON_COLOR} />,
    title: "사주/미니 운세",
    description: "오늘의 운세를 간단하게 확인해봐요.",
    href: "/fortune/input",
    tag: "운세",
  },
  {
    icon: <PawPrint size={ICON_SIZE} color={ICON_COLOR} />,
    title: "동물상 테스트",
    description: "그/그녀와 닮은 동물은 무엇일까요?",
    href: "/animal-test/input",
    tag: "테스트",
  },
];

export default function ContentCards() {
  return (
    <Container id="contents" sx={{ py: { xs: 4, sm: 8 } }}>
      <Box sx={{ width: { sm: "100%", md: "60%" }, mb: { xs: 2, sm: 4 } }}>
        <Typography
          component="h2"
          variant="h4"
          gutterBottom
          sx={{ color: "text.primary", fontWeight: 700 }}
        >
          콘텐츠
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          다양한 심리 테스트와 재미있는 콘텐츠를 만나보세요.
        </Typography>
      </Box>
      <Grid container spacing={2.5}>
        {contents.map((item, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <Card
              variant="outlined"
              sx={{
                p: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "border-color 0.2s, box-shadow 0.2s",
                "&:hover": {
                  borderColor: "grey.300",
                  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
                },
                "&:hover .arrow-icon": {
                  transform: "translateX(6px)",
                  opacity: 1,
                },
                "&:active .arrow-icon": {
                  transform: "translateX(80px)",
                  opacity: 0,
                  transition: "transform 0.5s cubic-bezier(0.2, 0, 0, 1), opacity 0.3s ease-out",
                },
              }}
            >
              <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: "grey.50",
                      border: "1px solid",
                      borderColor: "grey.200",
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      bgcolor: "grey.100",
                      color: "text.secondary",
                      px: 1,
                      py: 0.25,
                      borderRadius: 1,
                      fontWeight: 500,
                      fontSize: "0.7rem",
                    }}
                  >
                    {item.tag}
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "text.primary" }}
                >
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {item.description}
                </Typography>
              </Stack>
              <Button
                href={item.href}
                size="small"
                sx={{
                  mt: 2,
                  alignSelf: "flex-start",
                  color: "#3d5a99",
                  fontWeight: 600,
                  gap: 0.5,
                  "&:hover": {
                    bgcolor: "rgba(61, 90, 153, 0.06)",
                  },
                }}
              >
                시작하기
                <Box
                  className="arrow-icon"
                  component="span"
                  sx={{
                    display: "inline-flex",
                    transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease",
                    opacity: 0.7,
                  }}
                >
                  <ArrowRight size={16} />
                </Box>
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
