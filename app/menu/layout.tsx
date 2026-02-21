import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "오늘의 메뉴 추천 | 심랩",
  description:
    "지금 내 기분에 딱 맞는 메뉴를 찾아드려요. 기분으로 추천받거나 원하는 음식 카테고리를 직접 선택해보세요!",
  openGraph: {
    title: "오늘의 메뉴 추천 | 심랩",
    description: "기분에 딱 맞는 오늘의 메뉴를 추천받아보세요.",
    type: "website",
    locale: "ko_KR",
    siteName: "심랩",
    images: [
      {
        url: "/og/simlab-default-og.png",
        width: 1200,
        height: 630,
        alt: "심랩 - 오늘의 메뉴 추천",
      },
    ],
  },
};

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}