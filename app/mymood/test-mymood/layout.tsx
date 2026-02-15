import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "감정 점수화 | 심랩",
  description:
    "간단한 설문으로 오늘의 감정 상태를 숫자로 확인해보세요. 기쁨, 피로, 스트레스, 평온, 설렘 — 지금 나의 마음은?",
  openGraph: {
    title: "감정 점수화 | 심랩",
    description:
      "간단한 설문으로 오늘의 감정 상태를 숫자로 확인해보세요.",
    type: "website",
    locale: "ko_KR",
    siteName: "심랩",
  },
};

export default function MymoodQuestionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}