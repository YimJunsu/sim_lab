import type { Metadata } from "next";
import FortuneResultClient from "./FortuneResultClient";

/**
 * 사주/운세 결과 페이지 (서버 컴포넌트)
 * - sessionStorage에서 본인 결과를 로드
 * - 공유: 스크린샷 캡쳐 + 입력 페이지 링크
 */

export const metadata: Metadata = {
  title: "사주/미니 운세 결과 | 심랩",
  description:
    "AI가 분석한 오늘의 사주 운세를 확인하세요. 종합운, 연애운, 재물운, 건강운을 한눈에.",
  openGraph: {
    title: "사주/미니 운세 결과 | 심랩",
    description: "AI가 분석한 오늘의 사주 운세를 확인하세요.",
    type: "website",
    locale: "ko_KR",
    siteName: "심랩",
    images: [
      {
        url: "/og/saju-result-og.png",
        width: 1200,
        height: 630,
        alt: "심랩 사주 운세 결과",
      },
    ],
  },
};

export default function FortuneResultPage() {
  return <FortuneResultClient />;
}