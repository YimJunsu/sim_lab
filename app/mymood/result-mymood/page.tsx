import type { Metadata } from "next";
import { getShareData } from "@/lib/fortune-store";
import MymoodResultClient from "./MymoodResultClient";

/**
 * 감정 점수화 결과 페이지 (서버 컴포넌트)
 * - ?id= : 서버 저장 방식 공유 링크
 */

interface Props {
  searchParams: Promise<{ id?: string }>;
}

/** 공유 데이터 검증 */
function isValidMoodShareData(data: unknown): data is {
  scores: { joy: number; fatigue: number; stress: number; calm: number; excitement: number };
  comment: string;
  date: string;
} {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  const s = d.scores as Record<string, unknown> | undefined;
  if (!s || typeof s.joy !== "number" || typeof s.fatigue !== "number") return false;
  if (typeof d.comment !== "string" || typeof d.date !== "string") return false;
  return true;
}

/** 서버 저장소에서 공유 데이터 조회 */
async function resolveShareData(params: { id?: string }) {
  if (params.id) {
    const data = await getShareData(params.id);
    if (isValidMoodShareData(data)) {
      return { sharedData: data, expired: false };
    }
    return { sharedData: null, expired: true };
  }
  return { sharedData: null, expired: false };
}

// 동적 OG 메타데이터 생성
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;

  // 공유 링크인 경우 → 동적 OG
  if (params.id) {
    const { sharedData } = await resolveShareData(params);
    if (sharedData) {
      return {
        title: "감정 점수화 결과 | 심랩",
        description: `${sharedData.comment} — 나도 오늘의 감정을 확인해보세요!`,
        openGraph: {
          title: "감정 점수화 결과 | 심랩",
          description: `${sharedData.comment} — 나도 오늘의 감정을 확인해보세요!`,
          type: "website",
          locale: "ko_KR",
          siteName: "심랩",
        },
      };
    }
  }

  // 일반 결과 페이지
  return {
    title: "감정 점수화 결과 | 심랩",
    description:
      "오늘의 감정 상태를 숫자로 확인해보세요. 기쁨, 피로, 스트레스, 평온, 설렘.",
    openGraph: {
      title: "감정 점수화 결과 | 심랩",
      description: "오늘의 감정 상태를 숫자로 확인해보세요.",
      type: "website",
      locale: "ko_KR",
      siteName: "심랩",
    },
  };
}

export default async function MymoodResultPage({ searchParams }: Props) {
  const params = await searchParams;
  const { sharedData, expired } = await resolveShareData(params);

  return (
    <MymoodResultClient
      sharedData={sharedData}
      expiredShare={expired}
    />
  );
}