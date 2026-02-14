import type { Metadata } from "next";
import { decodeShareData, extractNameFromShare } from "@/lib/fortune-share";
import { getShareData } from "@/lib/fortune-store";
import FortuneResultClient from "./FortuneResultClient";

/**
 * 사주/운세 결과 페이지 (서버 컴포넌트)
 * - ?id= : 서버 저장 방식 공유 링크 (짧은 URL)
 * - ?s=  : 레거시 base64 인코딩 방식 (하위 호환)
 */

interface Props {
  searchParams: Promise<{ id?: string; s?: string }>;
}

/** 서버 저장소에서 공유 데이터 + 이름 추출 */
async function resolveShareData(params: { id?: string; s?: string }) {
  // 1) 짧은 ID 방식 (신규)
  if (params.id) {
    const data = await getShareData(params.id);
    if (data && typeof data === "object" && "input" in (data as Record<string, unknown>)) {
      const typed = data as { input: { name: string }; saju: unknown; fortune: unknown };
      return { name: typed.input.name, sharedData: data, expired: false };
    }
    // id가 있었지만 데이터 없음 = 만료 또는 잘못된 링크
    return { name: null, sharedData: null, expired: true };
  }

  // 2) 레거시 base64 방식 (하위 호환)
  if (params.s) {
    const name = extractNameFromShare(params.s);
    const sharedData = decodeShareData(params.s);
    if (!sharedData) return { name: null, sharedData: null, expired: true };
    return { name, sharedData, expired: false };
  }

  return { name: null, sharedData: null, expired: false };
}

// 동적 OG 메타데이터 생성
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const { name } = await resolveShareData(params);

  // 공유 링크인 경우 → 동적 OG 태그
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
  const { sharedData, expired } = await resolveShareData(params);

  return (
    <FortuneResultClient
      sharedData={sharedData as import("@/lib/fortune-share").ShareableFortuneData | null}
      expiredShare={expired}
    />
  );
}