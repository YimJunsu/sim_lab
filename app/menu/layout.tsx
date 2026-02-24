import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "오늘의 메뉴 추천",
  description:
    "뭐 먹을지 모르겠을 때! 지금 내 기분에 딱 맞는 메뉴를 추천받아보세요. 기분으로 추천받거나 원하는 음식 카테고리를 직접 선택해보세요.",
  keywords: [
    "오늘의 메뉴 추천",
    "점심 메뉴 추천",
    "저녁 메뉴 추천",
    "메뉴 고르기",
    "뭐 먹을까",
    "음식 추천",
    "메뉴 추천",
    "오늘 뭐 먹지",
    "점심 뭐 먹지",
    "저녁 뭐 먹지",
    "랜덤 메뉴",
    "메뉴 결정",
    "식사 메뉴",
    "심랩 메뉴",
  ],
  alternates: {
    canonical: "https://simlab.kr/menu/select",
  },
  openGraph: {
    title: "오늘의 메뉴 추천 | 심랩",
    description:
      "뭐 먹을지 모르겠을 때! 기분에 딱 맞는 오늘의 메뉴를 추천받아보세요.",
    url: "https://simlab.kr/menu/select",
    type: "website",
    locale: "ko_KR",
    siteName: "심랩",
  },
  twitter: {
    card: "summary_large_image",
    title: "오늘의 메뉴 추천 | 심랩",
    description:
      "뭐 먹을지 모르겠을 때! 기분에 딱 맞는 오늘의 메뉴를 추천받아보세요.",
  },
};

const menuJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "오늘의 메뉴 추천 | 심랩",
  description:
    "뭐 먹을지 모르겠을 때! 지금 내 기분에 딱 맞는 메뉴를 추천받아보세요.",
  url: "https://simlab.kr/menu/select",
  inLanguage: "ko-KR",
  isPartOf: {
    "@type": "WebSite",
    name: "심랩",
    url: "https://simlab.kr",
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "홈",
        item: "https://simlab.kr",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "오늘의 메뉴 추천",
        item: "https://simlab.kr/menu/select",
      },
    ],
  },
};

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={menuJsonLd} />
      {children}
    </>
  );
}