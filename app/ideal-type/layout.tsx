import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "이상형 성향 테스트",
  description:
    "나의 연애 성향과 이상형을 알아보세요. 리더형, 감성형, 안정형, 유머형, 지적형 — 당신이 끌리는 이상형은 어떤 타입인가요?",
  keywords: [
    "이상형 테스트",
    "이상형 성향 테스트",
    "연애 성향 테스트",
    "이상형 찾기",
    "나의 이상형",
    "이상형 성향",
    "연애 테스트",
    "연애 유형",
    "리더형",
    "감성형",
    "안정형",
    "유머형",
    "지적형",
    "심랩 이상형",
  ],
  alternates: {
    canonical: "https://simlab.kr/ideal-type",
  },
  openGraph: {
    title: "이상형 성향 테스트 | 심랩",
    description:
      "나의 연애 성향과 이상형을 알아보세요. 당신이 끌리는 이상형은 어떤 타입인가요?",
    url: "https://simlab.kr/ideal-type",
    type: "website",
    locale: "ko_KR",
    siteName: "심랩",
  },
  twitter: {
    card: "summary_large_image",
    title: "이상형 성향 테스트 | 심랩",
    description:
      "나의 연애 성향과 이상형을 알아보세요. 당신이 끌리는 이상형은 어떤 타입인가요?",
  },
};

const idealTypeJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "이상형 성향 테스트 | 심랩",
  description:
    "나의 연애 성향과 이상형을 알아보세요. 리더형, 감성형, 안정형, 유머형, 지적형 — 당신이 끌리는 이상형은 어떤 타입인가요?",
  url: "https://simlab.kr/ideal-type",
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
        name: "이상형 성향 테스트",
        item: "https://simlab.kr/ideal-type",
      },
    ],
  },
};

export default function IdealTypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={idealTypeJsonLd} />
      {children}
    </>
  );
}