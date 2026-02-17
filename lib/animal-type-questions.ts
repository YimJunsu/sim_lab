/**
 * 동물상 테스트 - 스코어링, 동물 프로필, 유틸 함수
 *
 * 5가지 성향 축: warmth(다정함), energy(활력), wit(재치), calm(차분함), charm(매력)
 * 성별별 12마리 동물, 코사인 유사도로 최적 매칭
 */

import { ALL_ANIMAL_QUESTIONS } from "@/data/animal-type-questions";

// ─── 성향 점수 타입 ───
export interface AnimalScores {
  warmth: number;   // 다정함
  energy: number;   // 활력
  wit: number;      // 재치
  calm: number;     // 차분함
  charm: number;    // 매력
}

// ─── 성별 타입 ───
export type AnimalGender = "female" | "male";

// ─── 질문 옵션 타입 ───
export interface AnimalQuestionOption {
  label: string;
  scores: AnimalScores;
}

// ─── 질문 타입 ───
export interface AnimalQuestionItem {
  id: number;
  text: string;
  gender: AnimalGender;
  options: AnimalQuestionOption[];
}

// ─── 동물 프로필 타입 ───
export interface AnimalProfile {
  name: string;
  emoji: string;
  description: string;
  detail: string;
  profile: AnimalScores; // 정규화된 성향 벡터
}

// ─── 성향 메타데이터 ───
export const ANIMAL_TYPE_META = {
  warmth: { label: "다정함", emoji: "💛", color: "#F0A500", colorLight: "rgba(240, 165, 0, 0.2)" },
  energy: { label: "활력", emoji: "⚡", color: "#FF6B6B", colorLight: "rgba(255, 107, 107, 0.2)" },
  wit: { label: "재치", emoji: "✨", color: "#2ECC71", colorLight: "rgba(46, 204, 113, 0.2)" },
  calm: { label: "차분함", emoji: "🌿", color: "#5DADE2", colorLight: "rgba(93, 173, 226, 0.2)" },
  charm: { label: "매력", emoji: "💎", color: "#AF7AC5", colorLight: "rgba(175, 122, 197, 0.2)" },
} as const;

// ─── 성향 키 순서 (인코딩/디코딩) ───
const SCORE_KEYS: (keyof AnimalScores)[] = ["warmth", "energy", "wit", "calm", "charm"];

// ─── 동물 프로필 데이터 ───

export const FEMALE_ANIMALS: AnimalProfile[] = [
  { name: "강아지", emoji: "🐶", description: "옆에만 있어도 행복한 순수 에너지", detail: "무조건적인 애정을 주는 타입. 눈만 마주쳐도 꼬리(마음)가 흔들리고, 함께하는 모든 순간이 행복 그 자체인 사람에게 끌려요.", profile: { warmth: 5, energy: 3, wit: 1, calm: 2, charm: 1 } },
  { name: "고양이", emoji: "🐱", description: "밀당의 여왕, 가까이 오면 도망감", detail: "쉽게 다가오지 않지만, 한번 마음을 열면 깊은 유대를 가진 사람. 독립적이면서도 은근한 애정 표현에 심장이 뛰어요.", profile: { warmth: 1, energy: 1, wit: 2, calm: 2, charm: 5 } },
  { name: "토끼", emoji: "🐰", description: "볼살로 세상 정복하는 타입", detail: "부드럽고 포근한 분위기로 주변을 편안하게 만드는 사람. 살짝 수줍지만 다정한 모습에 자꾸만 눈이 가요.", profile: { warmth: 4, energy: 1, wit: 1, calm: 4, charm: 2 } },
  { name: "여우", emoji: "🦊", description: "한 끗 차이로 심장 저격하는 센스", detail: "영리하고 센스 넘치는 타입. 상황 파악이 빠르고, 절묘한 타이밍에 던지는 한마디가 치명적이에요.", profile: { warmth: 1, energy: 2, wit: 5, calm: 1, charm: 4 } },
  { name: "사슴", emoji: "🦌", description: "눈빛만으로 사람 홀리는 청순파", detail: "조용하지만 존재감이 확실한 사람. 맑은 눈빛과 차분한 분위기 속에 숨겨진 매력이 치명적이에요.", profile: { warmth: 2, energy: 1, wit: 1, calm: 4, charm: 5 } },
  { name: "햄스터", emoji: "🐹", description: "작지만 텐션은 우주급", detail: "에너지 넘치고 열정적인 타입. 작은 일에도 크게 기뻐하고, 그 밝은 에너지가 주변까지 행복하게 만들어요.", profile: { warmth: 4, energy: 5, wit: 1, calm: 1, charm: 1 } },
  { name: "수달", emoji: "🦦", description: "장난기 폭발, 같이 있으면 시간순삭", detail: "유쾌하고 장난기 넘치는 사람. 센스 있는 유머와 활발한 에너지로 함께하는 시간이 순식간에 지나가요.", profile: { warmth: 2, energy: 4, wit: 4, calm: 1, charm: 1 } },
  { name: "백조", emoji: "🦢", description: "우아함 속에 반전 매력", detail: "겉으로는 우아하고 차분하지만, 알고 보면 의외의 반전 매력이 있는 사람. 품격과 귀여움을 동시에 가졌어요.", profile: { warmth: 1, energy: 1, wit: 2, calm: 4, charm: 5 } },
  { name: "펭귄", emoji: "🐧", description: "뒤뚱뒤뚱 귀여움 폭격기", detail: "서툴지만 진심인 모습이 매력적인 사람. 열심히 다가오는 귀여움과 따뜻한 마음이 동시에 느껴져요.", profile: { warmth: 4, energy: 4, wit: 1, calm: 2, charm: 1 } },
  { name: "나비", emoji: "🦋", description: "가볍게 날아와서 깊이 빠지게 만드는", detail: "가벼워 보이지만 깊이가 있는 사람. 자유로운 매력으로 다가왔다가 어느새 마음 깊이 자리잡아요.", profile: { warmth: 1, energy: 2, wit: 4, calm: 1, charm: 5 } },
  { name: "돌고래", emoji: "🐬", description: "밝은 에너지로 주변을 물들이는", detail: "지적이면서도 밝은 에너지의 소유자. 재치 있는 대화와 활발한 성격으로 주변을 환하게 만들어요.", profile: { warmth: 2, energy: 4, wit: 4, calm: 1, charm: 2 } },
  { name: "판다", emoji: "🐼", description: "존재 자체가 힐링, 곁에 있으면 평화", detail: "함께 있으면 마음이 편해지는 사람. 느긋하고 다정한 분위기가 지친 일상의 쉼터 같아요.", profile: { warmth: 4, energy: 1, wit: 1, calm: 5, charm: 2 } },
];

export const MALE_ANIMALS: AnimalProfile[] = [
  { name: "호랑이", emoji: "🐯", description: "카리스마 폭발, 눈만 마주쳐도 심쿵", detail: "강렬한 존재감과 카리스마의 소유자. 자신감 넘치는 모습과 에너지에 눈을 뗄 수 없어요.", profile: { warmth: 1, energy: 4, wit: 1, calm: 1, charm: 5 } },
  { name: "곰", emoji: "🐻", description: "덩치는 크지만 속은 젤리", detail: "겉으로는 듬직하지만 속은 한없이 부드러운 사람. 묵묵한 다정함과 안정감이 최고의 매력이에요.", profile: { warmth: 4, energy: 1, wit: 1, calm: 5, charm: 1 } },
  { name: "강아지", emoji: "🐶", description: "꼬리 흔들며 달려오는 순정파", detail: "숨김없이 감정을 표현하는 순수한 사람. 온 마음을 다해 좋아하는 모습이 세상에서 제일 설레요.", profile: { warmth: 5, energy: 4, wit: 1, calm: 1, charm: 1 } },
  { name: "늑대", emoji: "🐺", description: "쿨한 척하지만 은근 로맨틱", detail: "겉으로는 쿨하고 무심해 보이지만, 사실은 깊은 감성을 가진 로맨티스트. 가끔 보여주는 다정함이 치명적이에요.", profile: { warmth: 1, energy: 2, wit: 4, calm: 2, charm: 5 } },
  { name: "사자", emoji: "🦁", description: "왕의 포스, 듬직한 리더", detail: "리더십과 포용력을 동시에 가진 사람. 앞에서 이끄는 당당함과 뒤에서 챙기는 따뜻함이 공존해요.", profile: { warmth: 2, energy: 4, wit: 1, calm: 2, charm: 5 } },
  { name: "독수리", emoji: "🦅", description: "높은 곳에서 모든 걸 꿰뚫는 눈", detail: "분석력과 통찰력이 뛰어난 사람. 차분하게 상황을 파악하고 정확한 판단을 내리는 모습이 매력적이에요.", profile: { warmth: 1, energy: 1, wit: 5, calm: 4, charm: 1 } },
  { name: "돌고래", emoji: "🐬", description: "유쾌함으로 무장한 분위기 메이커", detail: "어디서든 분위기를 밝히는 에너지의 소유자. 재치 있는 말과 행동으로 주변을 항상 즐겁게 만들어요.", profile: { warmth: 2, energy: 4, wit: 4, calm: 1, charm: 2 } },
  { name: "오랑우탄", emoji: "🦧", description: "엉뚱한 매력의 소유자", detail: "예측 불가능한 엉뚱함 속에 따뜻한 마음을 가진 사람. 독특한 시선과 센스가 중독성 있어요.", profile: { warmth: 4, energy: 2, wit: 4, calm: 1, charm: 2 } },
  { name: "판다", emoji: "🐼", description: "존재 자체가 힐링, 곁에 있으면 평화", detail: "함께 있으면 마음이 편해지는 사람. 느긋하고 다정한 분위기가 지친 일상의 쉼터 같아요.", profile: { warmth: 4, energy: 1, wit: 1, calm: 5, charm: 2 } },
  { name: "돼지", emoji: "🐷", description: "솔직하고 먹성 좋은 행복 전도사", detail: "꾸밈없이 솔직하고 긍정적인 사람. 함께 맛있는 거 먹으며 웃는 소소한 행복이 최고라고 믿어요.", profile: { warmth: 4, energy: 4, wit: 1, calm: 2, charm: 1 } },
  { name: "펭귄", emoji: "🐧", description: "서툴지만 진심인 일편단심", detail: "표현은 서툴지만 한 사람만을 향한 진심이 느껴지는 사람. 꾸준하고 변함없는 마음이 최고의 매력이에요.", profile: { warmth: 4, energy: 1, wit: 1, calm: 4, charm: 2 } },
  { name: "여우", emoji: "🦊", description: "영리하면서도 은근 다정한 반전 매력", detail: "머리 회전이 빠르고 센스 넘치는 사람. 쿨한 겉모습 속에 숨겨진 다정함을 발견하면 빠져나올 수 없어요.", profile: { warmth: 2, energy: 2, wit: 5, calm: 1, charm: 4 } },
];

// ─── 코멘트 데이터 (동물별) ───
const ANIMAL_COMMENTS: Record<string, string[]> = {
  // 여자 동물
  "F_강아지": ["순수한 애정에 약한 타입이네요. 진심이 느껴지면 마음이 무장해제!", "맑은 눈빛에 꼬리 흔드는 강아지 같은 사람에게 끌려요.", "조건 없는 사랑이 최고라고 믿는 당신, 역시 강아지상이 딱!"],
  "F_고양이": ["도도하지만 가끔 보여주는 애교에 심장 폭발하는 타입.", "쉽게 다가오지 않는 사람일수록 더 끌리는 성향이에요.", "고양이 같은 밀당에 약한 당신, 츤데레가 찐이상형!"],
  "F_토끼": ["포근하고 부드러운 분위기에 마음이 녹는 타입이에요.", "살짝 수줍은 모습에 자꾸 눈이 가는 당신!", "편안하고 다정한 토끼상이 당신의 힐링 포인트."],
  "F_여우": ["센스 있는 한마디에 심장이 뛰는 타입!", "영리하고 눈치 빠른 사람에게 묘하게 끌려요.", "절묘한 타이밍의 매력에 빠지는 당신, 여우상이 답!"],
  "F_사슴": ["말없이 눈빛으로 소통하는 사람에게 끌리는 타입.", "청순하면서도 신비로운 분위기에 마음을 빼앗겨요.", "조용한 매력에 빠지는 당신, 사슴상이 이상형!"],
  "F_햄스터": ["에너지 넘치고 텐션 높은 사람에게 끌리는 타입!", "작은 일에도 크게 기뻐하는 모습이 너무 사랑스러워요.", "밝은 에너지로 하루를 채워주는 햄스터상이 딱!"],
  "F_수달": ["장난기 넘치고 유쾌한 사람과 함께하고 싶은 타입.", "같이 있으면 시간이 순삭되는 사람이 이상형이에요.", "재미와 센스를 겸비한 수달상에 빠졌어요!"],
  "F_백조": ["우아한 겉모습 속 반전 매력에 끌리는 타입!", "품격 있으면서도 귀여운 사람이 찐 이상형.", "겉과 속의 갭에 설레는 당신, 백조상이 답!"],
  "F_펭귄": ["서툴지만 열심히 다가오는 모습에 마음이 무너지는 타입.", "귀엽고 따뜻한 조합이 최강이라고 믿는 당신!", "진심 어린 노력에 감동받는 당신에게 펭귄상이 딱!"],
  "F_나비": ["자유롭지만 깊이 있는 사람에게 끌리는 타입.", "가볍게 다가왔다가 깊이 빠지게 만드는 매력이 최고!", "미스터리한 매력에 빠지는 당신, 나비상이 이상형!"],
  "F_돌고래": ["밝고 똑똑한 사람에게 끌리는 타입이에요!", "재치 있는 대화와 활발한 에너지의 조합이 최고.", "함께하면 빛나는 돌고래상이 당신의 이상형!"],
  "F_판다": ["곁에 있으면 편안해지는 사람이 최고라고 믿는 타입.", "느긋하고 다정한 분위기에 마음이 쉬어가요.", "일상의 쉼터 같은 판다상이 딱 이상형!"],
  // 남자 동물
  "M_호랑이": ["카리스마와 자신감에 끌리는 타입이에요!", "강렬한 존재감에 눈을 뗄 수 없는 당신.", "리드해주는 호랑이상이 심장을 뛰게 만들어요!"],
  "M_곰": ["듬직하고 따뜻한 사람에게 마음이 가는 타입.", "묵묵한 다정함이 최고의 매력이라고 믿어요.", "곰처럼 포근한 안정감이 당신의 이상형!"],
  "M_강아지": ["순수하게 좋아하는 모습에 설레는 타입!", "온 마음을 다해 표현하는 사람에게 끌려요.", "꼬리 흔들며 달려오는 강아지상이 찐이상형!"],
  "M_늑대": ["쿨한 겉모습 속 로맨틱한 반전에 끌리는 타입.", "무심한 듯 다정한 사람이 치명적이에요.", "늑대 같은 갭 매력에 빠진 당신!"],
  "M_사자": ["리더십과 포용력을 동시에 가진 사람이 이상형!", "당당하면서도 따뜻한 사람에게 끌려요.", "왕의 포스를 가진 사자상이 딱!"],
  "M_독수리": ["분석력과 지적인 매력에 끌리는 타입이에요.", "차분하게 꿰뚫어보는 눈에 마음을 빼앗겨요.", "통찰력 있는 독수리상이 당신의 이상형!"],
  "M_돌고래": ["유쾌하고 센스 넘치는 사람에게 끌리는 타입!", "분위기를 밝히는 에너지가 최고의 매력.", "함께하면 항상 즐거운 돌고래상이 답!"],
  "M_오랑우탄": ["엉뚱하지만 따뜻한 사람에게 끌리는 타입.", "예측 불가능한 매력에 중독되는 당신!", "독특한 시선의 오랑우탄상이 이상형!"],
  "M_판다": ["곁에 있으면 편안해지는 사람이 이상형!", "느긋하고 다정한 분위기에 힐링되는 타입.", "존재 자체가 쉼터인 판다상에 끌려요!"],
  "M_돼지": ["솔직하고 긍정적인 사람에게 끌리는 타입!", "함께 맛있는 거 먹으며 웃는 게 행복이에요.", "꾸밈없는 행복 에너지의 돼지상이 딱!"],
  "M_펭귄": ["서툴지만 한결같은 진심에 끌리는 타입.", "변함없는 마음이 최고의 매력이라고 믿어요.", "일편단심 펭귄상이 당신의 이상형!"],
  "M_여우": ["영리하면서도 다정한 반전에 끌리는 타입!", "쿨한 겉모습 속 숨겨진 다정함이 치명적.", "센스와 다정함을 겸비한 여우상이 답!"],
};

/** 성별별 동물 리스트 반환 */
export function getAnimalsByGender(gender: AnimalGender): AnimalProfile[] {
  return gender === "female" ? FEMALE_ANIMALS : MALE_ANIMALS;
}

/** 성별 필터 후 count개 랜덤 선택 (Fisher-Yates shuffle) */
export function getRandomAnimalQuestions(gender: AnimalGender, count = 12): AnimalQuestionItem[] {
  const filtered = ALL_ANIMAL_QUESTIONS
    .filter(q => q.gender === gender)
    .map(q => ({ id: q.id, text: q.content, gender: q.gender, options: q.options }));

  const shuffled = [...filtered];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

/** 답변들로 성향 점수 계산 (백분율) */
export function calculateAnimalScores(answers: AnimalScores[]): AnimalScores {
  const total: AnimalScores = { warmth: 0, energy: 0, wit: 0, calm: 0, charm: 0 };

  for (const a of answers) {
    total.warmth += a.warmth;
    total.energy += a.energy;
    total.wit += a.wit;
    total.calm += a.calm;
    total.charm += a.charm;
  }

  const sum = total.warmth + total.energy + total.wit + total.calm + total.charm;
  if (sum === 0) return { warmth: 20, energy: 20, wit: 20, calm: 20, charm: 20 };

  const raw = {
    warmth: (total.warmth / sum) * 100,
    energy: (total.energy / sum) * 100,
    wit: (total.wit / sum) * 100,
    calm: (total.calm / sum) * 100,
    charm: (total.charm / sum) * 100,
  };

  const rounded = {
    warmth: Math.round(raw.warmth),
    energy: Math.round(raw.energy),
    wit: Math.round(raw.wit),
    calm: Math.round(raw.calm),
    charm: Math.round(raw.charm),
  };

  // 합계 보정 (반올림 오차)
  const diff = 100 - (rounded.warmth + rounded.energy + rounded.wit + rounded.calm + rounded.charm);
  if (diff !== 0) {
    const dominant = (Object.keys(rounded) as (keyof AnimalScores)[])
      .reduce((a, b) => rounded[a] >= rounded[b] ? a : b);
    rounded[dominant] += diff;
  }

  return rounded;
}

/** 코사인 유사도 계산 */
function cosineSimilarity(a: AnimalScores, b: AnimalScores): number {
  const keys = SCORE_KEYS;
  let dot = 0, magA = 0, magB = 0;
  for (const k of keys) {
    dot += a[k] * b[k];
    magA += a[k] * a[k];
    magB += b[k] * b[k];
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
}

/** 점수 분포에 가장 유사한 동물 매칭 */
export function matchAnimal(scores: AnimalScores, gender: AnimalGender): { animal: AnimalProfile; index: number } {
  const animals = getAnimalsByGender(gender);
  let bestIdx = 0;
  let bestSim = -1;

  for (let i = 0; i < animals.length; i++) {
    const sim = cosineSimilarity(scores, animals[i].profile);
    if (sim > bestSim) {
      bestSim = sim;
      bestIdx = i;
    }
  }

  return { animal: animals[bestIdx], index: bestIdx };
}

/** 동물 코멘트 + 인덱스 반환 */
export function getAnimalCommentWithIndex(animalName: string, gender: AnimalGender): { comment: string; commentIdx: number } {
  const key = `${gender === "female" ? "F" : "M"}_${animalName}`;
  const options = ANIMAL_COMMENTS[key] ?? ["당신의 이상형을 찾았어요!"];
  const idx = Math.floor(Math.random() * options.length);
  return { comment: options[idx], commentIdx: idx };
}

/** 코멘트 인덱스로 복원 */
export function getAnimalCommentByIndex(animalName: string, gender: AnimalGender, idx: number): string {
  const key = `${gender === "female" ? "F" : "M"}_${animalName}`;
  const options = ANIMAL_COMMENTS[key] ?? ["당신의 이상형을 찾았어요!"];
  return options[idx] ?? options[0];
}

// ─── 공유 데이터 타입 ───
export interface ShareableAnimalData {
  scores: AnimalScores;
  gender: AnimalGender;
  animalIdx: number;
  comment: string;
  commentIdx: number;
  date: string; // YYYY-MM-DD
}

// ─── Compact URL 인코딩/디코딩 ───
// 형식: {warmth_hex}-{energy_hex}-{wit_hex}-{calm_hex}-{charm_hex}-{gender_char}-{YYMMDD}-{animalIdx}-{commentIdx}

/** ShareableAnimalData → compact string */
export function encodeAnimalCompact(data: ShareableAnimalData): string {
  const hexScores = SCORE_KEYS
    .map(k => data.scores[k].toString(16).toUpperCase().padStart(2, "0"))
    .join("-");

  const genderChar = data.gender === "female" ? "F" : "M";
  const datePart = data.date.replace(/-/g, "").slice(2);

  return `${hexScores}-${genderChar}-${datePart}-${data.animalIdx}-${data.commentIdx}`;
}

/** compact string → ShareableAnimalData | null */
export function decodeAnimalCompact(encoded: string): ShareableAnimalData | null {
  try {
    const parts = encoded.split("-");
    if (parts.length !== 9) return null;

    // 처음 5개: 성향 점수 (hex)
    const scores: AnimalScores = { warmth: 0, energy: 0, wit: 0, calm: 0, charm: 0 };
    for (let i = 0; i < 5; i++) {
      const val = parseInt(parts[i], 16);
      if (isNaN(val) || val < 0 || val > 100) return null;
      scores[SCORE_KEYS[i]] = val;
    }

    // 합계 검증 (100 ± 1)
    const sum = scores.warmth + scores.energy + scores.wit + scores.calm + scores.charm;
    if (sum < 99 || sum > 101) return null;

    // 성별
    const genderChar = parts[5];
    if (genderChar !== "F" && genderChar !== "M") return null;
    const gender: AnimalGender = genderChar === "F" ? "female" : "male";

    // 날짜 복원: YYMMDD → YYYY-MM-DD
    const dateStr = parts[6];
    if (dateStr.length !== 6) return null;
    const year = `20${dateStr.slice(0, 2)}`;
    const month = dateStr.slice(2, 4);
    const day = dateStr.slice(4, 6);
    const date = `${year}-${month}-${day}`;

    // 동물 인덱스
    const animalIdx = parseInt(parts[7], 10);
    if (isNaN(animalIdx) || animalIdx < 0 || animalIdx > 11) return null;

    // 코멘트 인덱스
    const commentIdx = parseInt(parts[8], 10);
    if (isNaN(commentIdx)) return null;

    // 코멘트 복원
    const animals = getAnimalsByGender(gender);
    const animal = animals[animalIdx];
    if (!animal) return null;
    const comment = getAnimalCommentByIndex(animal.name, gender, commentIdx);

    return { scores, gender, animalIdx, comment, commentIdx, date };
  } catch {
    return null;
  }
}
