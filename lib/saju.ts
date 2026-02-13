/**
 * 사주팔자 (Four Pillars of Destiny) 계산 모듈
 *
 * 천간(Heavenly Stems) 10개 + 지지(Earthly Branches) 12개를 기반으로
 * 연주, 월주, 일주, 시주를 계산합니다.
 */

// 천간 (Heavenly Stems) - 10개
export const HEAVENLY_STEMS = [
  { name: "갑", hanja: "甲", element: "목(木)", yinYang: "양" },
  { name: "을", hanja: "乙", element: "목(木)", yinYang: "음" },
  { name: "병", hanja: "丙", element: "화(火)", yinYang: "양" },
  { name: "정", hanja: "丁", element: "화(火)", yinYang: "음" },
  { name: "무", hanja: "戊", element: "토(土)", yinYang: "양" },
  { name: "기", hanja: "己", element: "토(土)", yinYang: "음" },
  { name: "경", hanja: "庚", element: "금(金)", yinYang: "양" },
  { name: "신", hanja: "辛", element: "금(金)", yinYang: "음" },
  { name: "임", hanja: "壬", element: "수(水)", yinYang: "양" },
  { name: "계", hanja: "癸", element: "수(水)", yinYang: "음" },
] as const;

// 지지 (Earthly Branches) - 12개
export const EARTHLY_BRANCHES = [
  { name: "자", hanja: "子", animal: "쥐", element: "수(水)", yinYang: "양" },
  { name: "축", hanja: "丑", animal: "소", element: "토(土)", yinYang: "음" },
  { name: "인", hanja: "寅", animal: "호랑이", element: "목(木)", yinYang: "양" },
  { name: "묘", hanja: "卯", animal: "토끼", element: "목(木)", yinYang: "음" },
  { name: "진", hanja: "辰", animal: "용", element: "토(土)", yinYang: "양" },
  { name: "사", hanja: "巳", animal: "뱀", element: "화(火)", yinYang: "음" },
  { name: "오", hanja: "午", animal: "말", element: "화(火)", yinYang: "양" },
  { name: "미", hanja: "未", animal: "양", element: "토(土)", yinYang: "음" },
  { name: "신", hanja: "申", animal: "원숭이", element: "금(金)", yinYang: "양" },
  { name: "유", hanja: "酉", animal: "닭", element: "금(金)", yinYang: "음" },
  { name: "술", hanja: "戌", animal: "개", element: "토(土)", yinYang: "양" },
  { name: "해", hanja: "亥", animal: "돼지", element: "수(水)", yinYang: "음" },
] as const;

// 오행 (Five Elements) 상생/상극 관계
export const FIVE_ELEMENTS = {
  "목(木)": { generates: "화(火)", overcomes: "토(土)", color: "청색(靑)" },
  "화(火)": { generates: "토(土)", overcomes: "금(金)", color: "적색(赤)" },
  "토(土)": { generates: "금(金)", overcomes: "수(水)", color: "황색(黃)" },
  "금(金)": { generates: "수(水)", overcomes: "목(木)", color: "백색(白)" },
  "수(水)": { generates: "목(木)", overcomes: "화(火)", color: "흑색(黑)" },
} as const;

export interface Pillar {
  stem: (typeof HEAVENLY_STEMS)[number];
  branch: (typeof EARTHLY_BRANCHES)[number];
  label: string;
}

export interface SajuResult {
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar: Pillar | null;
  elementBalance: Record<string, number>;
  dominantElement: string;
  yinYangBalance: { yin: number; yang: number };
}

export interface UserInput {
  name: string;
  gender: "male" | "female";
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number | null; // null = 모름
}

/**
 * 연주(年柱) 계산
 * 기준: 갑자년(甲子年)은 서기 4년
 */
function calcYearPillar(year: number): Pillar {
  const stemIdx = (year - 4) % 10;
  const branchIdx = (year - 4) % 12;

  return {
    stem: HEAVENLY_STEMS[(stemIdx + 10) % 10],
    branch: EARTHLY_BRANCHES[(branchIdx + 12) % 12],
    label: "연주(年柱)",
  };
}

/**
 * 월주(月柱) 계산
 * 월건(月建): 인월(寅月)이 1월(음력 정월)에 해당
 * 월간(月干): 연간에 따라 결정 (연간×2 + 월 기본값)
 */
function calcMonthPillar(year: number, month: number): Pillar {
  // 월지: 1월=인(寅, idx 2)부터 시작
  const branchIdx = (month + 1) % 12;

  // 월간: 연간 기반 공식
  const yearStemIdx = (year - 4) % 10;
  // 갑/기년 → 병인월, 을/경년 → 무인월 ...
  const monthStemBase = (yearStemIdx % 5) * 2 + 2;
  const stemIdx = (monthStemBase + month - 1) % 10;

  return {
    stem: HEAVENLY_STEMS[(stemIdx + 10) % 10],
    branch: EARTHLY_BRANCHES[(branchIdx + 12) % 12],
    label: "월주(月柱)",
  };
}

/**
 * 일주(日柱) 계산
 * 기준일: 2000년 1월 1일 = 갑진일(甲辰日) → stem=0, branch=4 기준으로 계산
 * 실제로는 율리우스 적일(Julian Day Number) 기반으로 계산
 */
function calcDayPillar(year: number, month: number, day: number): Pillar {
  // 율리우스 적일 계산 (그레고리력)
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jdn =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;

  // 기준: JDN 2451545 (2000-01-01) = 갑진일 → stem=0, branch=4
  const diff = jdn - 2451545;
  const stemIdx = ((diff % 10) + 10) % 10;
  const branchIdx = ((diff + 4) % 12 + 12) % 12;

  return {
    stem: HEAVENLY_STEMS[stemIdx],
    branch: EARTHLY_BRANCHES[branchIdx],
    label: "일주(日柱)",
  };
}

/**
 * 시주(時柱) 계산
 * 시간대별 지지 매핑 (2시간 단위)
 * 시간: 23-01=자, 01-03=축, 03-05=인, ...
 */
function calcHourPillar(
  year: number,
  month: number,
  day: number,
  hour: number
): Pillar {
  // 시지(時支): 23~01시=자시(0), 01~03시=축시(1), ...
  const branchIdx = Math.floor(((hour + 1) % 24) / 2);

  // 시간(時干): 일간에 따라 결정
  const dayPillar = calcDayPillar(year, month, day);
  const dayStemIdx = HEAVENLY_STEMS.indexOf(dayPillar.stem);
  const hourStemBase = (dayStemIdx % 5) * 2;
  const stemIdx = (hourStemBase + branchIdx) % 10;

  return {
    stem: HEAVENLY_STEMS[stemIdx],
    branch: EARTHLY_BRANCHES[branchIdx],
    label: "시주(時柱)",
  };
}

/**
 * 오행 분포 계산 - 사주의 8글자에서 각 오행이 몇 번 등장하는지 집계
 */
function calcElementBalance(pillars: (Pillar | null)[]): Record<string, number> {
  const balance: Record<string, number> = {
    "목(木)": 0,
    "화(火)": 0,
    "토(土)": 0,
    "금(金)": 0,
    "수(水)": 0,
  };

  for (const pillar of pillars) {
    if (!pillar) continue;
    balance[pillar.stem.element]++;
    balance[pillar.branch.element]++;
  }

  return balance;
}

/**
 * 메인 사주 계산 함수
 */
export function calculateSaju(input: UserInput): SajuResult {
  const { birthYear, birthMonth, birthDay, birthHour } = input;

  const yearPillar = calcYearPillar(birthYear);
  const monthPillar = calcMonthPillar(birthYear, birthMonth);
  const dayPillar = calcDayPillar(birthYear, birthMonth, birthDay);
  const hourPillar =
    birthHour !== null
      ? calcHourPillar(birthYear, birthMonth, birthDay, birthHour)
      : null;

  const allPillars = [yearPillar, monthPillar, dayPillar, hourPillar];
  const elementBalance = calcElementBalance(allPillars);

  // 가장 많은 오행 찾기
  const dominantElement = Object.entries(elementBalance).reduce((a, b) =>
    a[1] >= b[1] ? a : b
  )[0];

  // 음양 균형 계산
  let yin = 0;
  let yang = 0;
  for (const pillar of allPillars) {
    if (!pillar) continue;
    if (pillar.stem.yinYang === "양") yang++;
    else yin++;
    if (pillar.branch.yinYang === "양") yang++;
    else yin++;
  }

  return {
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    elementBalance,
    dominantElement,
    yinYangBalance: { yin, yang },
  };
}

/**
 * 사주 결과를 AI 프롬프트용 텍스트로 변환
 */
export function sajuToPromptText(input: UserInput, result: SajuResult): string {
  const pillars = [
    result.yearPillar,
    result.monthPillar,
    result.dayPillar,
    result.hourPillar,
  ];

  const pillarText = pillars
    .map((p) => {
      if (!p) return "시주(時柱): 미상";
      return `${p.label}: ${p.stem.name}${p.branch.name} (${p.stem.hanja}${p.branch.hanja}) - 천간 ${p.stem.element} ${p.stem.yinYang}, 지지 ${p.branch.element} ${p.branch.yinYang}`;
    })
    .join("\n");

  const elementText = Object.entries(result.elementBalance)
    .map(([el, count]) => `${el}: ${count}개`)
    .join(", ");

  return `
[사주 정보]
이름: ${input.name}
성별: ${input.gender === "male" ? "남성" : "여성"}
생년월일: ${input.birthYear}년 ${input.birthMonth}월 ${input.birthDay}일
태어난 시간: ${input.birthHour !== null ? `${input.birthHour}시` : "미상"}

[사주팔자]
${pillarText}

[오행 분포]
${elementText}
주도 오행: ${result.dominantElement}

[음양 균형]
양(陽): ${result.yinYangBalance.yang}개, 음(陰): ${result.yinYangBalance.yin}개

[띠]
${result.yearPillar.branch.animal}띠
`.trim();
}