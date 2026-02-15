import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이상형 성향 테스트 | 심랩",
  description:
    "나의 연애 성향과 이상형을 알아보세요. 리더형, 감성형, 안정형, 유머형, 지적형 — 당신이 끌리는 이상형은?",
  openGraph: {
    title: "이상형 성향 테스트 | 심랩",
    description:
      "나의 연애 성향과 이상형을 알아보세요.",
    type: "website",
    locale: "ko_KR",
    siteName: "심랩",
    images: [
      {
        url: "/og/simlab-default-og.png",
        width: 1200,
        height: 630,
        alt: "심랩 - 이상형 성향 테스트",
      },
    ],
  },
};

export default function IdealTypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
