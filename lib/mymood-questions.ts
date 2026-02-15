/**
 * 감정 점수화 컨텐츠 - 질문 데이터 및 점수 계산
 *
 * - 40개 질문 중 10개를 랜덤 선택
 * - 각 질문은 4지선다
 * - 5가지 감정 카테고리: 기쁨, 피로, 스트레스, 평온, 설렘
 */

import { ALL_QUESTIONS } from "@/data/mymood-questions";

// ─── 감정 점수 타입 ───
export interface EmotionScores {
  joy: number;        // 기쁨
  fatigue: number;    // 피로
  stress: number;     // 스트레스
  calm: number;       // 평온
  excitement: number; // 설렘
}

// ─── 질문 옵션 타입 ───
export interface QuestionOption {
  label: string;
  scores: EmotionScores;
}

// ─── 질문 타입 ───
export interface Question {
  id: number;
  text: string;
  options: QuestionOption[];
}

// ─── 감정 카테고리 메타데이터 ───
export const EMOTION_META = {
  joy: { label: "기쁨", emoji: "😊", color: "#FFB347", colorLight: "rgba(255, 179, 71, 0.2)" },
  fatigue: { label: "피로", emoji: "😴", color: "#7B8CDE", colorLight: "rgba(123, 140, 222, 0.2)" },
  stress: { label: "스트레스", emoji: "😤", color: "#FF6B6B", colorLight: "rgba(255, 107, 107, 0.2)" },
  calm: { label: "평온", emoji: "😌", color: "#69D2A0", colorLight: "rgba(105, 210, 160, 0.2)" },
  excitement: { label: "설렘", emoji: "💫", color: "#E891CF", colorLight: "rgba(232, 145, 207, 0.2)" },
} as const;

// ─── 감정 키 순서 (인코딩/디코딩 시 사용) ───
const EMOTION_KEYS: (keyof EmotionScores)[] = ["joy", "fatigue", "stress", "calm", "excitement"];

/** 40개 중 10개 랜덤 선택 (Fisher-Yates shuffle) */
export function getRandomQuestions(count = 10): Question[] {
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

/** 답변들로 감정 점수 계산 (백분율) */
export function calculateEmotionScores(answers: EmotionScores[]): EmotionScores {
  const total: EmotionScores = { joy: 0, fatigue: 0, stress: 0, calm: 0, excitement: 0 };

  for (const a of answers) {
    total.joy += a.joy;
    total.fatigue += a.fatigue;
    total.stress += a.stress;
    total.calm += a.calm;
    total.excitement += a.excitement;
  }

  const sum = total.joy + total.fatigue + total.stress + total.calm + total.excitement;
  if (sum === 0) return { joy: 20, fatigue: 20, stress: 20, calm: 20, excitement: 20 };

  // 반올림 후 합계가 100이 되도록 보정
  const raw = {
    joy: (total.joy / sum) * 100,
    fatigue: (total.fatigue / sum) * 100,
    stress: (total.stress / sum) * 100,
    calm: (total.calm / sum) * 100,
    excitement: (total.excitement / sum) * 100,
  };

  const rounded = {
    joy: Math.round(raw.joy),
    fatigue: Math.round(raw.fatigue),
    stress: Math.round(raw.stress),
    calm: Math.round(raw.calm),
    excitement: Math.round(raw.excitement),
  };

  // 합계 보정 (반올림 오차)
  const diff = 100 - (rounded.joy + rounded.fatigue + rounded.stress + rounded.calm + rounded.excitement);
  if (diff !== 0) {
    const dominant = (Object.keys(rounded) as (keyof EmotionScores)[])
      .reduce((a, b) => rounded[a] >= rounded[b] ? a : b);
    rounded[dominant] += diff;
  }

  return rounded;
}

/** 주요 감정 추출 */
export function getDominantEmotion(scores: EmotionScores): keyof EmotionScores {
  return (Object.keys(scores) as (keyof EmotionScores)[])
    .reduce((a, b) => scores[a] > scores[b] ? a : b);
}

// ─── 코멘트 데이터 ───
const EMOTION_COMMENTS: Record<keyof EmotionScores, string[]> = {
  joy: [
    "해달라는거 다 해줄 수 있다.",
    "헤헤헤헤헤헤헤헤헤헤헤",
    "저는 기분이 좋아요"
  ],
  fatigue: [
    "아무도 날 찾지 말아주세요",
    "아무것도 하기 싫어요",
    "모든 연락 무시"
  ],
  stress: [
    "지구 박살내고 싶다",
    "긴급 머리 속 폭풍주의보 발령! 뇌 터질 거 같음",
    "건들지마세요. 물어요"
  ],
  calm: [
    "명상 중… 세계 평화 달성 중",
    "산은 산이고, 물은 물이다.",
    "현재 완전 안정 모드"
  ],
  excitement: [
    "두근거림 폭발! 몸이 말을 안들어~",
    "설렘 MAX! 모든 게 현실을 뚫고 튀어나갈 듯",
    "두 쫀 쿠"
  ],
};

/** 결과에 따른 한 줄 코멘트 + 인덱스 반환 (공유 시 재현 가능) */
export function getEmotionCommentWithIndex(scores: EmotionScores): { comment: string; commentIdx: number } {
  const dominant = getDominantEmotion(scores);
  const options = EMOTION_COMMENTS[dominant];
  const idx = Math.floor(Math.random() * options.length);
  return { comment: options[idx], commentIdx: idx };
}

/** 코멘트 인덱스로 코멘트 텍스트 복원 */
export function getCommentByIndex(dominant: keyof EmotionScores, idx: number): string {
  const options = EMOTION_COMMENTS[dominant];
  return options[idx] ?? options[0];
}

/** 관련 컨텐츠 추천 (주요 감정에 따라) */
export function getRelatedContent(scores: EmotionScores): {
  title: string;
  description: string;
  href: string;
} {
  const dominant = getDominantEmotion(scores);

  switch (dominant) {
    case "joy":
    case "excitement":
      return {
        title: "이상형 성향 테스트",
        description: "기분 좋은 지금, 나의 이상형도 알아볼까요?",
        href: "/ideal-type",
      };
    case "fatigue":
    case "calm":
      return {
        title: "오늘의 메뉴 추천",
        description: "힐링이 필요한 지금, 맛있는 메뉴를 추천해드려요.",
        href: "/menu/select",
      };
    case "stress":
      return {
        title: "사주/미니 운세",
        description: "스트레스 날리기! 오늘의 운세를 확인해보세요.",
        href: "/fortune/input",
      };
    default:
      return {
        title: "동물상 테스트",
        description: "재미있는 동물상 테스트로 기분 전환해보세요!",
        href: "/animal-test/input",
      };
  }
}

// ─── 공유 데이터 타입 ───
export interface ShareableMoodData {
  scores: EmotionScores;
  comment: string;
  date: string; // YYYY-MM-DD
  commentIdx?: number;
}

// ─── Compact URL 인코딩/디코딩 ───
// 형식: {joy_hex}-{fatigue_hex}-{stress_hex}-{calm_hex}-{excitement_hex}-{YYMMDD}-{commentIdx}
// 예: 1E-0A-14-2D-05-260216-0 (~30자)

/** ShareableMoodData → compact string */
export function encodeMoodCompact(data: ShareableMoodData): string {
  const hexScores = EMOTION_KEYS
    .map(k => data.scores[k].toString(16).toUpperCase().padStart(2, "0"))
    .join("-");

  // YYYY-MM-DD → YYMMDD
  const datePart = data.date.replace(/-/g, "").slice(2); // "2026-02-16" → "260216"

  const commentIdx = data.commentIdx ?? 0;

  return `${hexScores}-${datePart}-${commentIdx}`;
}

/** compact string → ShareableMoodData | null */
export function decodeMoodCompact(encoded: string): ShareableMoodData | null {
  try {
    const parts = encoded.split("-");
    if (parts.length !== 7) return null;

    // 처음 5개: 감정 점수 (hex)
    const scores: EmotionScores = { joy: 0, fatigue: 0, stress: 0, calm: 0, excitement: 0 };
    for (let i = 0; i < 5; i++) {
      const val = parseInt(parts[i], 16);
      if (isNaN(val) || val < 0 || val > 100) return null;
      scores[EMOTION_KEYS[i]] = val;
    }

    // 합계 검증 (100 ± 1 허용, 반올림 오차)
    const sum = scores.joy + scores.fatigue + scores.stress + scores.calm + scores.excitement;
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

    const dominant = getDominantEmotion(scores);
    const comment = getCommentByIndex(dominant, commentIdx);

    return { scores, comment, date, commentIdx };
  } catch {
    return null;
  }
}
