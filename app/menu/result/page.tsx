import type { Metadata } from "next";
import { Suspense } from "react";
import MenuResultClient from "./MenuResultClient";

export const metadata: Metadata = {
  title: "오늘의 추천 메뉴 | 심랩",
  description:
    "기분에 딱 맞는 오늘의 메뉴가 선택되었어요! 영양 정보와 주변 식당 정보도 확인해보세요.",
  openGraph: {
    title: "오늘의 추천 메뉴 | 심랩",
    description: "오늘 뭐 먹지? 심랩이 기분에 맞는 메뉴를 추천해드렸어요!",
    type: "website",
    locale: "ko_KR",
    siteName: "심랩",
    images: [
      {
        url: "/og/simlab-default-og.png",
        width: 1200,
        height: 630,
        alt: "심랩 - 오늘의 메뉴 추천 결과",
      },
    ],
  },
};

export default function MenuResultPage() {
  return (
    <Suspense>
      <MenuResultClient />
    </Suspense>
  );
}