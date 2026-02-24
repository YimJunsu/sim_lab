import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "동물상 테스트",
  description:
    "그/그녀와 닮은 동물은? 5가지 성향으로 알아보는 동물상 테스트. 강아지상, 고양이상, 토끼상, 곰상, 여우상, 늑대상 중 어떤 동물과 닮았는지 확인해보세요.",
  keywords: [
    "동물상 테스트",
    "동물상 보기",
    "내 동물상",
    "동물상 찾기",
    "관상 테스트",
    "강아지상",
    "고양이상",
    "토끼상",
    "곰상",
    "여우상",
    "늑대상",
    "동물상 유형",
    "성격 동물",
    "심랩 동물상",
  ],
  alternates: {
    canonical: "https://simlab.kr/animal-test/input",
  },
  openGraph: {
    title: "동물상 테스트 | 심랩",
    description:
      "그/그녀와 닮은 동물은? 동물상 테스트로 나와 닮은 동물을 알아보세요.",
    url: "https://simlab.kr/animal-test/input",
    type: "website",
    locale: "ko_KR",
    siteName: "심랩",
  },
  twitter: {
    card: "summary_large_image",
    title: "동물상 테스트 | 심랩",
    description:
      "그/그녀와 닮은 동물은? 동물상 테스트로 나와 닮은 동물을 알아보세요.",
  },
};

const animalTestJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "동물상 테스트 | 심랩",
  description:
    "그/그녀와 닮은 동물은? 5가지 성향으로 알아보는 동물상 테스트.",
  url: "https://simlab.kr/animal-test/input",
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
        name: "동물상 테스트",
        item: "https://simlab.kr/animal-test/input",
      },
    ],
  },
};

export default function AnimalTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={animalTestJsonLd} />
      {children}
    </>
  );
}