import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "사주/미니 운세",
  description:
    "생년월일과 태어난 시간으로 나의 사주를 풀어보세요. AI가 분석한 오늘의 종합운, 연애운, 재물운, 건강운을 확인할 수 있습니다.",
  keywords: [
    "사주",
    "미니 운세",
    "오늘의 운세",
    "사주풀이",
    "무료 사주",
    "사주팔자",
    "AI 운세",
    "사주 보기",
    "운세 보기",
    "생년월일 운세",
    "오늘 운세",
    "연애운",
    "재물운",
    "건강운",
    "심랩 운세",
  ],
  alternates: {
    canonical: "https://simlab.kr/fortune/input",
  },
  openGraph: {
    title: "사주/미니 운세 | 심랩",
    description:
      "생년월일과 태어난 시간으로 나의 사주를 풀어보세요. AI가 분석한 오늘의 운세를 확인해보세요.",
    url: "https://simlab.kr/fortune/input",
    type: "website",
    locale: "ko_KR",
    siteName: "심랩",
    images: [
      {
        url: "/og/saju-result-og.png",
        width: 1200,
        height: 630,
        alt: "심랩 사주 운세 - AI가 분석하는 오늘의 운세",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "사주/미니 운세 | 심랩",
    description:
      "생년월일과 태어난 시간으로 나의 사주를 풀어보세요. AI가 분석한 오늘의 운세를 확인해보세요.",
    images: ["/og/saju-result-og.png"],
  },
};

const fortuneJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "사주/미니 운세 | 심랩",
  description:
    "생년월일과 태어난 시간으로 나의 사주를 풀어보세요. AI가 분석한 오늘의 종합운, 연애운, 재물운, 건강운을 확인할 수 있습니다.",
  url: "https://simlab.kr/fortune/input",
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
        name: "사주/미니 운세",
        item: "https://simlab.kr/fortune/input",
      },
    ],
  },
};

export default function FortuneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={fortuneJsonLd} />
      {children}
    </>
  );
}