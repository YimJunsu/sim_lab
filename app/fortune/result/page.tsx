import type { Metadata } from "next";
import { decodeShareData, extractNameFromShare } from "@/lib/fortune-share";
import FortuneResultClient from "./FortuneResultClient";

/**
 * 사주/운세 결과 페이지 (서버 컴포넌트)
 * - 공유 링크의 ?s= 파라미터를 읽어 동적 OG 메타데이터 생성
 * - 클라이언트 컴포넌트에 초기 공유 데이터를 전달
 */

interface Props {
  searchParams: Promise<{ s?: string }>;
}

// 동적 OG 메타데이터 생성
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const shareParam = params.s;

  // 공유 링크인 경우 → 동적 OG 태그
  if (shareParam) {
    const name = extractNameFromShare(shareParam);
    if (name) {
      return {
        title: `${name}님의 사주 운세 | 심랩`,
        description: `${name}님의 사주팔자를 AI가 분석한 오늘의 운세입니다. 나도 확인해보세요!`,
        openGraph: {
          title: `${name}님의 사주 운세 | 심랩`,
          description: `${name}님의 사주팔자를 AI가 분석한 오늘의 운세입니다. 나도 확인해보세요!`,
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
    }
  }

  // 일반 결과 페이지
  return {
    title: "사주/미니 운세 결과 | 심랩",
    description:
      "AI가 분석한 오늘의 사주 운세를 확인하세요. 종합운, 연애운, 재물운, 건강운을 한눈에.",
    openGraph: {
      title: "사주/미니 운세 결과 | 심랩",
      description:
        "AI가 분석한 오늘의 사주 운세를 확인하세요.",
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
}

export default async function FortuneResultPage({ searchParams }: Props) {
  const params = await searchParams;
  const shareParam = params.s || null;

  // 공유 데이터가 있으면 서버에서 미리 디코딩
  let sharedData = null;
  if (shareParam) {
    sharedData = decodeShareData(shareParam);
  }

  return (
    <FortuneResultClient
      sharedData={sharedData}
    />
  );
}