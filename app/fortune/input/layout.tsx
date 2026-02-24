import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "사주/미니 운세",
  description:
    "생년월일과 태어난 시간으로 나의 사주를 풀어보세요. AI가 분석한 오늘의 종합운, 연애운, 재물운, 건강운을 확인할 수 있습니다.",
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
        alt: "심랩 사주 운세",
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

export default function FortuneInputLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}