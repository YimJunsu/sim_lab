/**
 * 감정 점수화 컨텐츠 - 질문 데이터 및 점수 계산
 *
 * - 40개 질문 중 10개를 랜덤 선택
 * - 각 질문은 4지선다
 * - 5가지 감정 카테고리: 기쁨, 피로, 스트레스, 평온, 설렘
 */

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

// ─── 점수 배분 패턴 (5가지) ───
const SCORE_PATTERNS: EmotionScores[][] = [
  // 패턴 1: A=기쁨, B=스트레스+피로, C=평온, D=설렘
  [
    { joy: 3, fatigue: 0, stress: 0, calm: 1, excitement: 1 },
    { joy: 0, fatigue: 2, stress: 2, calm: 0, excitement: 1 },
    { joy: 1, fatigue: 0, stress: 1, calm: 3, excitement: 0 },
    { joy: 1, fatigue: 1, stress: 0, calm: 0, excitement: 3 },
  ],
  // 패턴 2: A=평온, B=스트레스, C=기쁨, D=피로
  [
    { joy: 0, fatigue: 1, stress: 0, calm: 3, excitement: 1 },
    { joy: 0, fatigue: 1, stress: 3, calm: 0, excitement: 1 },
    { joy: 3, fatigue: 0, stress: 0, calm: 1, excitement: 1 },
    { joy: 1, fatigue: 3, stress: 0, calm: 0, excitement: 1 },
  ],
  // 패턴 3: A=설렘, B=평온, C=피로, D=스트레스
  [
    { joy: 1, fatigue: 0, stress: 0, calm: 1, excitement: 3 },
    { joy: 2, fatigue: 0, stress: 1, calm: 2, excitement: 0 },
    { joy: 0, fatigue: 3, stress: 1, calm: 0, excitement: 1 },
    { joy: 0, fatigue: 0, stress: 3, calm: 1, excitement: 1 },
  ],
  // 패턴 4: A=피로, B=평온, C=스트레스, D=설렘
  [
    { joy: 0, fatigue: 3, stress: 1, calm: 0, excitement: 1 },
    { joy: 1, fatigue: 0, stress: 0, calm: 3, excitement: 1 },
    { joy: 0, fatigue: 1, stress: 3, calm: 0, excitement: 1 },
    { joy: 1, fatigue: 0, stress: 0, calm: 1, excitement: 3 },
  ],
  // 패턴 5: A=설렘, B=스트레스, C=기쁨, D=평온
  [
    { joy: 1, fatigue: 0, stress: 0, calm: 0, excitement: 4 },
    { joy: 0, fatigue: 2, stress: 2, calm: 1, excitement: 0 },
    { joy: 3, fatigue: 0, stress: 0, calm: 1, excitement: 1 },
    { joy: 0, fatigue: 1, stress: 0, calm: 3, excitement: 1 },
  ],
];

// ─── 40개 질문 (placeholder: 숫자로 대체) ───
const ALL_QUESTIONS: Question[] = Array.from({ length: 40 }, (_, i) => {
  const qNum = i + 1;
  const pattern = SCORE_PATTERNS[i % SCORE_PATTERNS.length];

  return {
    id: qNum,
    text: `질문 ${qNum}`,
    options: [
      { label: `${qNum}-A`, scores: pattern[0] },
      { label: `${qNum}-B`, scores: pattern[1] },
      { label: `${qNum}-C`, scores: pattern[2] },
      { label: `${qNum}-D`, scores: pattern[3] },
    ],
  };
});

/** 40개 중 10개 랜덤 선택 (Fisher-Yates shuffle) */
export function getRandomQuestions(count = 10): Question[] {
  const shuffled = [...ALL_QUESTIONS];
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
    // 가장 큰 값에 보정
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

/** 결과에 따른 한 줄 코멘트 */
export function getEmotionComment(scores: EmotionScores): string {
  const dominant = getDominantEmotion(scores);

  const comments: Record<keyof EmotionScores, string[]> = {
    joy: [
      "오늘은 기쁨이 가득한 하루! 이 에너지를 주변에 나눠보세요.",
      "행복한 감정이 넘치는 날이에요. 좋은 일이 더 생길 거예요!",
    ],
    fatigue: [
      "조금 지쳐있는 것 같아요. 따뜻한 차 한잔으로 쉬어가는 건 어떨까요?",
      "오늘은 충분한 휴식이 필요한 날이에요. 자신에게 좀 더 너그러워지세요.",
    ],
    stress: [
      "스트레스가 좀 쌓여있네요. 잠시 깊은 호흡을 해보는 건 어떨까요?",
      "긴장을 풀어줄 시간이 필요해요. 좋아하는 음악을 들어보세요.",
    ],
    calm: [
      "마음이 평온한 상태예요. 이 고요함을 즐겨보세요.",
      "안정적인 감정 상태가 돋보이네요. 명상이나 산책이 잘 어울려요.",
    ],
    excitement: [
      "설레는 마음이 가득하네요! 새로운 도전을 시작하기 좋은 날이에요.",
      "두근거리는 에너지가 느껴져요. 오늘 특별한 일이 있을지도?",
    ],
  };

  const options = comments[dominant];
  return options[Math.floor(Math.random() * options.length)];
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
        href: "/ideal-type/test",
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
}