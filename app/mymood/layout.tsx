import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "감정 점수화",
  description:
    "간단한 설문으로 오늘의 감정 상태를 숫자로 확인해보세요. 기쁨, 피로, 스트레스, 평온, 설렘 — 지금 나의 마음 상태를 점수로 알아보세요.",
  keywords: [
    "감정 점수화",
    "오늘의 감정",
    "감정 테스트",
    "내 감정 확인",
    "감정 분석",
    "기분 테스트",
    "감정 점수",
    "스트레스 측정",
    "기쁨 점수",
    "감정 상태",
    "심리 테스트",
    "오늘 기분",
    "심랩 감정",
  ],
  alternates: {
    canonical: "https://simlab.kr/mymood",
  },
  openGraph: {
    title: "감정 점수화 | 심랩",
    description:
      "간단한 설문으로 오늘의 감정 상태를 숫자로 확인해보세요. 지금 나의 마음은?",
    url: "https://simlab.kr/mymood",
    type: "website",
    locale: "ko_KR",
    siteName: "심랩",
  },
  twitter: {
    card: "summary_large_image",
    title: "감정 점수화 | 심랩",
    description:
      "간단한 설문으로 오늘의 감정 상태를 숫자로 확인해보세요. 지금 나의 마음은?",
  },
};

const mymoodJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "감정 점수화 | 심랩",
  description:
    "간단한 설문으로 오늘의 감정 상태를 숫자로 확인해보세요. 기쁨, 피로, 스트레스, 평온, 설렘 — 지금 나의 마음은?",
  url: "https://simlab.kr/mymood",
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
        name: "감정 점수화",
        item: "https://simlab.kr/mymood",
      },
    ],
  },
};

export default function MymoodLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={mymoodJsonLd} />
      {children}
    </>
  );
}