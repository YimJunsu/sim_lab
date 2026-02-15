/**
 * 이상형 성향 테스트 - 질문 데이터 및 점수 계산
 *
 * - 40개 질문 중 20개를 랜덤 선택
 * - 각 질문은 4지선다
 * - 5가지 성향 카테고리: 리더형, 감성형, 안정형, 유머형, 지적형
 */

import { ALL_QUESTIONS } from "@/data/ideal-type-questions";

// ─── 성향 점수 타입 ───
export interface IdealTypeScores {
  leader: number;      // 리더형
  romantic: number;    // 감성형
  stable: number;      // 안정형
  humorous: number;    // 유머형
  intellectual: number; // 지적형
}

// ─── 질문 옵션 타입 ───
export interface IdealTypeQuestionOption {
  label: string;
  scores: IdealTypeScores;
}

// ─── 질문 타입 ───
export interface IdealTypeQuestionItem {
  id: number;
  text: string;
  options: IdealTypeQuestionOption[];
}

// ─── 성향 카테고리 메타데이터 ───
export const TYPE_META = {
  leader: { label: "리더형", emoji: "🔥", color: "#FF6B35", colorLight: "rgba(255, 107, 53, 0.2)", description: "끌고 가는 매력, 결정장애 치료제 같은 사람" },
  romantic: { label: "감성형", emoji: "🌹", color: "#E84393", colorLight: "rgba(232, 67, 147, 0.2)", description: "분위기 장인, 일상을 특별하게 만드는 사람" },
  stable: { label: "안정형", emoji: "🏔️", color: "#0984E3", colorLight: "rgba(9, 132, 227, 0.2)", description: "흔들리지 않는 편안함, 곁에 있으면 안심되는 사람" },
  humorous: { label: "유머형", emoji: "😄", color: "#FDCB6E", colorLight: "rgba(253, 203, 110, 0.2)", description: "같이 있으면 시간 순삭, 웃음 충전소 같은 사람" },
  intellectual: { label: "지적형", emoji: "📚", color: "#6C5CE7", colorLight: "rgba(108, 92, 231, 0.2)", description: "대화하면 빠져드는 매력, 생각의 깊이가 다른 사람" },
} as const;

// ─── 성향 키 순서 (인코딩/디코딩 시 사용) ───
const TYPE_KEYS: (keyof IdealTypeScores)[] = ["leader", "romantic", "stable", "humorous", "intellectual"];

/** 40개 중 count개 랜덤 선택 (Fisher-Yates shuffle) */
export function getRandomQuestions(count = 20): IdealTypeQuestionItem[] {
  const mapped = ALL_QUESTIONS.map(q => ({
    id: q.id,
    text: q.content,
    options: q.options,
  }));
  const shuffled = [...mapped];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

/** 답변들로 성향 점수 계산 (백분율) */
export function calculateTypeScores(answers: IdealTypeScores[]): IdealTypeScores {
  const total: IdealTypeScores = { leader: 0, romantic: 0, stable: 0, humorous: 0, intellectual: 0 };

  for (const a of answers) {
    total.leader += a.leader;
    total.romantic += a.romantic;
    total.stable += a.stable;
    total.humorous += a.humorous;
    total.intellectual += a.intellectual;
  }

  const sum = total.leader + total.romantic + total.stable + total.humorous + total.intellectual;
  if (sum === 0) return { leader: 20, romantic: 20, stable: 20, humorous: 20, intellectual: 20 };

  const raw = {
    leader: (total.leader / sum) * 100,
    romantic: (total.romantic / sum) * 100,
    stable: (total.stable / sum) * 100,
    humorous: (total.humorous / sum) * 100,
    intellectual: (total.intellectual / sum) * 100,
  };

  const rounded = {
    leader: Math.round(raw.leader),
    romantic: Math.round(raw.romantic),
    stable: Math.round(raw.stable),
    humorous: Math.round(raw.humorous),
    intellectual: Math.round(raw.intellectual),
  };

  // 합계 보정 (반올림 오차)
  const diff = 100 - (rounded.leader + rounded.romantic + rounded.stable + rounded.humorous + rounded.intellectual);
  if (diff !== 0) {
    const dominant = (Object.keys(rounded) as (keyof IdealTypeScores)[])
      .reduce((a, b) => rounded[a] >= rounded[b] ? a : b);
    rounded[dominant] += diff;
  }

  return rounded;
}

/** 주요 성향 추출 */
export function getDominantType(scores: IdealTypeScores): keyof IdealTypeScores {
  return (Object.keys(scores) as (keyof IdealTypeScores)[])
    .reduce((a, b) => scores[a] > scores[b] ? a : b);
}

// ─── 코멘트 데이터 ───
const TYPE_COMMENTS: Record<keyof IdealTypeScores, string[]> = {
  leader: [
    "우유부단한 건 못 참지. 딱 정해주는 사람한테 약한 편.",
    "내 앞에서 자신감 넘치게 리드하면? 심장 끝.",
    "계획 딱 세우고 이끌어주는 사람 = 심쿵 공식.",
  ],
  romantic: [
    "별거 아닌 하루도 특별하게 만들어주는 사람? 그게 찐이지.",
    "센스 있는 한마디에 녹는 타입. 분위기에 약함 인정.",
    "기념일 안 챙기면 서운한 거 맞고, 챙겨주면 두 배로 좋아함.",
  ],
  stable: [
    "요란한 거 별로. 그냥 옆에 있어주는 게 제일 좋음.",
    "말 안 해도 통하는 편안함이 진짜 사랑이라고 생각하는 편.",
    "연락 패턴 일정하고 약속 잘 지키는 사람이 제일 섹시함.",
  ],
  humorous: [
    "같이 있으면 시간 순삭되는 사람이 내 이상형.",
    "웃기면 반은 먹고 들어간다고 생각하는 타입.",
    "진지한 것도 좋지만, 매일 웃으면서 사는 게 최고 아님?",
  ],
  intellectual: [
    "밤새 이야기해도 안 질리는 사람한테 빠지는 타입.",
    "카톡 세 줄짜리 텍스트보다 한 시간 통화가 더 좋은 편.",
    "생각의 깊이가 느껴지면 외모는 +3 보정 들어감.",
  ],
};

/** 결과에 따른 한 줄 코멘트 + 인덱스 반환 (공유 시 재현 가능) */
export function getTypeCommentWithIndex(scores: IdealTypeScores): { comment: string; commentIdx: number } {
  const dominant = getDominantType(scores);
  const options = TYPE_COMMENTS[dominant];
  const idx = Math.floor(Math.random() * options.length);
  return { comment: options[idx], commentIdx: idx };
}

/** 코멘트 인덱스로 코멘트 텍스트 복원 */
export function getCommentByIndex(dominant: keyof IdealTypeScores, idx: number): string {
  const options = TYPE_COMMENTS[dominant];
  return options[idx] ?? options[0];
}

/** 결과 제목 */
export function getResultTitle(dominant: keyof IdealTypeScores): string {
  const titles: Record<keyof IdealTypeScores, string> = {
    leader: "리드해주는 사람한테 약한 타입",
    romantic: "분위기에 취하는 감성 러버",
    stable: "편안함이 곧 사랑인 타입",
    humorous: "웃음이 곧 사랑인 타입",
    intellectual: "대화에 빠지는 지적 러버",
  };
  return titles[dominant];
}

// ─── 공유 데이터 타입 ───
export interface ShareableIdealTypeData {
  scores: IdealTypeScores;
  comment: string;
  date: string; // YYYY-MM-DD
  commentIdx?: number;
}

// ─── Compact URL 인코딩/디코딩 ───
// 형식: {leader_hex}-{romantic_hex}-{stable_hex}-{humorous_hex}-{intellectual_hex}-{YYMMDD}-{commentIdx}
// 예: 1E-28-0A-14-0A-260217-2

/** ShareableIdealTypeData → compact string */
export function encodeIdealTypeCompact(data: ShareableIdealTypeData): string {
  const hexScores = TYPE_KEYS
    .map(k => data.scores[k].toString(16).toUpperCase().padStart(2, "0"))
    .join("-");

  // YYYY-MM-DD → YYMMDD
  const datePart = data.date.replace(/-/g, "").slice(2);

  const commentIdx = data.commentIdx ?? 0;

  return `${hexScores}-${datePart}-${commentIdx}`;
}

/** compact string → ShareableIdealTypeData | null */
export function decodeIdealTypeCompact(encoded: string): ShareableIdealTypeData | null {
  try {
    const parts = encoded.split("-");
    if (parts.length !== 7) return null;

    // 처음 5개: 성향 점수 (hex)
    const scores: IdealTypeScores = { leader: 0, romantic: 0, stable: 0, humorous: 0, intellectual: 0 };
    for (let i = 0; i < 5; i++) {
      const val = parseInt(parts[i], 16);
      if (isNaN(val) || val < 0 || val > 100) return null;
      scores[TYPE_KEYS[i]] = val;
    }

    // 합계 검증 (100 ± 1 허용, 반올림 오차)
    const sum = scores.leader + scores.romantic + scores.stable + scores.humorous + scores.intellectual;
    if (sum < 99 || sum > 101) return null;

    // 날짜 복원: YYMMDD → YYYY-MM-DD
    const dateStr = parts[5];
    if (dateStr.length !== 6) return null;
    const year = `20${dateStr.slice(0, 2)}`;
    const month = dateStr.slice(2, 4);
    const day = dateStr.slice(4, 6);
    const date = `${year}-${month}-${day}`;

    // 코멘트 복원
    const commentIdx = parseInt(parts[6], 10);
    if (isNaN(commentIdx)) return null;

    const dominant = getDominantType(scores);
    const comment = getCommentByIndex(dominant, commentIdx);

    return { scores, comment, date, commentIdx };
  } catch {
    return null;
  }
}
