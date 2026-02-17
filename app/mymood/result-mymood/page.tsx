import type { Metadata } from "next";
import { Suspense } from "react";
import MymoodResultClient from "./MymoodResultClient";

/**
 * 감정 점수화 결과 페이지 (서버 컴포넌트)
 * - sessionStorage 또는 URL 쿼리 파라미터에서 결과를 로드
 * - 공유: URL 인코딩 방식 (data 쿼리 파라미터)
 */

export const metadata: Metadata = {
  title: "감정 점수화 결과 | 심랩",
  description:
    "오늘의 감정 상태를 숫자로 확인해보세요. 기쁨, 피로, 스트레스, 평온, 설렘.",
  openGraph: {
    title: "감정 점수화 결과 | 심랩",
    description: "오늘의 감정 상태를 숫자로 확인해보세요.",
    type: "website",
    locale: "ko_KR",
    siteName: "심랩",
    images: [
      {
        url: "/og/simlab-default-og.png",
        width: 1200,
        height: 630,
        alt: "심랩 - 감정 점수화 결과",
      },
    ],
  },
};

export default function MymoodResultPage() {
  return (
    <Suspense>
      <MymoodResultClient />
    </Suspense>
  );
}