import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "마법의 책",
  description:
    "고대 유적지에서 발견된 마법의 책. 속마음으로 질문을 생각하고 책에게 물어보세요. O, X, 혹은 특별한 행운의 답이 기다립니다.",
  keywords: [
    "마법의 책",
    "운세 보기",
    "점 보기",
    "신탁",
    "오라클",
    "타로카드",
    "예스 노",
    "고민 상담",
    "질문 답변",
    "운세 질문",
    "마법 책",
    "운명의 책",
    "심랩 마법",
  ],
  alternates: {
    canonical: "https://simlab.kr/magic-book",
  },
  openGraph: {
    title: "마법의 책 | 심랩",
    description:
      "고대 유적지에서 발견된 마법의 책에게 질문을 던져보세요. 당신의 질문에 답이 있을지도 모릅니다.",
    url: "https://simlab.kr/magic-book",
    type: "website",
    locale: "ko_KR",
    siteName: "심랩",
  },
  twitter: {
    card: "summary_large_image",
    title: "마법의 책 | 심랩",
    description:
      "고대 유적지에서 발견된 마법의 책에게 질문을 던져보세요. 당신의 질문에 답이 있을지도 모릅니다.",
  },
};

const magicBookJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "마법의 책 | 심랩",
  description:
    "고대 유적지에서 발견된 마법의 책. 속마음으로 질문을 생각하고 책에게 물어보세요.",
  url: "https://simlab.kr/magic-book",
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
        name: "마법의 책",
        item: "https://simlab.kr/magic-book",
      },
    ],
  },
};

export default function MagicBookLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={magicBookJsonLd} />
      {children}
    </>
  );
}