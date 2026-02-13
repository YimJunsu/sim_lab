/**
 * 운세 공유 URL 인코딩/디코딩 유틸리티
 *
 * - 운세 결과를 URL-safe base64로 인코딩하여 공유 링크 생성
 * - 키 이름을 최소화하여 URL 길이 절약
 * - 서버/클라이언트 양쪽에서 사용 가능 (generateMetadata + 클라이언트 디코딩)
 */

// ─── 공유 데이터 타입 (축약 키) ───
interface CompactShareData {
  n: string;           // name
  g: "m" | "f";        // gender
  y: number;           // birthYear
  mo: number;          // birthMonth
  d: number;           // birthDay
  h: number | null;    // birthHour
  // saju pillars (hanja)
  yp: string;
  mp: string;
  dp: string;
  hp: string | null;
  // saju pillars (korean)
  yk: string;
  mk: string;
  dk: string;
  hk: string | null;
  // saju meta
  a: string;           // animal
  de: string;          // dominantElement
  eb: Record<string, number>; // elementBalance
  yb: [number, number]; // [yang, yin]
  // fortune
  fo: string;          // overall
  fl: string;          // love
  fw: string;          // wealth
  fh: string;          // health
  fa: string;          // advice
  lc: string;          // lucky color
  ln: string;          // lucky number
  ld: string;          // lucky direction
}

// ─── 원본 데이터 타입 (결과 페이지에서 사용하는 형태) ───
export interface ShareableFortuneData {
  input: {
    name: string;
    gender: string;
    birthYear: number;
    birthMonth: number;
    birthDay: number;
    birthHour: number | null;
  };
  saju: {
    yearPillar: string;
    monthPillar: string;
    dayPillar: string;
    hourPillar: string | null;
    yearPillarHanja: string;
    monthPillarHanja: string;
    dayPillarHanja: string;
    hourPillarHanja: string | null;
    animal: string;
    dominantElement: string;
    elementBalance: Record<string, number>;
    yinYangBalance: { yin: number; yang: number };
  };
  fortune: {
    overall: string;
    love: string;
    wealth: string;
    health: string;
    advice: string;
    lucky: { color: string; number: string; direction: string };
  };
}

// ─── UTF-8 <-> Base64URL 변환 ───

/** UTF-8 문자열을 base64url로 인코딩 */
function utf8ToBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  const b64 = btoa(binary);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** base64url을 UTF-8 문자열로 디코딩 */
function base64UrlToUtf8(b64url: string): string {
  let b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  const binary = atob(b64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

// ─── 데이터 압축/복원 ───

/** 원본 → 축약 */
function compact(data: ShareableFortuneData): CompactShareData {
  return {
    n: data.input.name,
    g: data.input.gender === "male" ? "m" : "f",
    y: data.input.birthYear,
    mo: data.input.birthMonth,
    d: data.input.birthDay,
    h: data.input.birthHour,
    yp: data.saju.yearPillarHanja,
    mp: data.saju.monthPillarHanja,
    dp: data.saju.dayPillarHanja,
    hp: data.saju.hourPillarHanja,
    yk: data.saju.yearPillar,
    mk: data.saju.monthPillar,
    dk: data.saju.dayPillar,
    hk: data.saju.hourPillar,
    a: data.saju.animal,
    de: data.saju.dominantElement,
    eb: data.saju.elementBalance,
    yb: [data.saju.yinYangBalance.yang, data.saju.yinYangBalance.yin],
    fo: data.fortune.overall,
    fl: data.fortune.love,
    fw: data.fortune.wealth,
    fh: data.fortune.health,
    fa: data.fortune.advice,
    lc: data.fortune.lucky.color,
    ln: data.fortune.lucky.number,
    ld: data.fortune.lucky.direction,
  };
}

/** 축약 → 원본 */
function expand(c: CompactShareData): ShareableFortuneData {
  return {
    input: {
      name: c.n,
      gender: c.g === "m" ? "male" : "female",
      birthYear: c.y,
      birthMonth: c.mo,
      birthDay: c.d,
      birthHour: c.h,
    },
    saju: {
      yearPillar: c.yk,
      monthPillar: c.mk,
      dayPillar: c.dk,
      hourPillar: c.hk,
      yearPillarHanja: c.yp,
      monthPillarHanja: c.mp,
      dayPillarHanja: c.dp,
      hourPillarHanja: c.hp,
      animal: c.a,
      dominantElement: c.de,
      elementBalance: c.eb,
      yinYangBalance: { yang: c.yb[0], yin: c.yb[1] },
    },
    fortune: {
      overall: c.fo,
      love: c.fl,
      wealth: c.fw,
      health: c.fh,
      advice: c.fa,
      lucky: { color: c.lc, number: c.ln, direction: c.ld },
    },
  };
}

// ─── 공개 API ───

/**
 * 운세 결과를 공유용 URL 파라미터 문자열로 인코딩
 */
export function encodeShareData(data: ShareableFortuneData): string {
  const compacted = compact(data);
  const json = JSON.stringify(compacted);
  return utf8ToBase64Url(json);
}

/**
 * 공유 URL 파라미터를 운세 결과로 디코딩
 * 파싱 실패 시 null 반환
 */
export function decodeShareData(encoded: string): ShareableFortuneData | null {
  try {
    const json = base64UrlToUtf8(encoded);
    const compacted: CompactShareData = JSON.parse(json);

    // 필수 필드 최소 검증
    if (!compacted.n || !compacted.g || !compacted.y || !compacted.fo) {
      return null;
    }

    return expand(compacted);
  } catch {
    return null;
  }
}

/**
 * 서버사이드에서 공유 데이터의 이름을 빠르게 추출 (OG 태그용)
 * 전체 디코딩 없이 이름만 가져옴
 */
export function extractNameFromShare(encoded: string): string | null {
  try {
    const json = base64UrlToUtf8(encoded);
    const parsed = JSON.parse(json);
    return parsed.n || null;
  } catch {
    return null;
  }
}
