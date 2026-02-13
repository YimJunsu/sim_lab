/**
 * 운세 결과 캐싱 유틸리티
 *
 * - localStorage에 운세 결과를 저장하고, 동일 입력 + 12시간 이내 요청 시 캐시 반환
 * - 캐시 키: 입력값(이름, 성별, 생년월일, 시간) + 날짜 기반
 * - 날짜를 포함해 "오늘의 운세"가 매일 바뀌도록 보장
 */

const CACHE_PREFIX = "fortune_cache_";
const CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12시간

interface FortuneInput {
  name: string;
  gender: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number | null;
}

interface CacheEntry {
  timestamp: number;
  data: unknown; // API 응답 전체 (fortune + saju)
}

/**
 * 입력값으로부터 캐시 키를 생성
 * 같은 날 + 같은 입력 = 같은 키
 */
function buildCacheKey(input: FortuneInput): string {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const raw = `${input.name}_${input.gender}_${input.birthYear}_${input.birthMonth}_${input.birthDay}_${input.birthHour}_${today}`;
  return CACHE_PREFIX + raw;
}

/**
 * 캐시에서 운세 결과를 조회
 * - 12시간 이내의 유효한 캐시가 있으면 반환
 * - 없거나 만료되었으면 null 반환
 */
export function getCachedFortune(input: FortuneInput): unknown | null {
  if (typeof window === "undefined") return null;

  try {
    const key = buildCacheKey(input);
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const entry: CacheEntry = JSON.parse(raw);
    const age = Date.now() - entry.timestamp;

    if (age > CACHE_TTL_MS) {
      // 만료된 캐시 삭제
      localStorage.removeItem(key);
      return null;
    }

    return entry.data;
  } catch {
    return null;
  }
}

/**
 * 운세 결과를 캐시에 저장
 */
export function setCachedFortune(input: FortuneInput, data: unknown): void {
  if (typeof window === "undefined") return;

  try {
    const key = buildCacheKey(input);
    const entry: CacheEntry = {
      timestamp: Date.now(),
      data,
    };
    localStorage.setItem(key, JSON.stringify(entry));

    // 오래된 캐시 항목 정리 (최대 10개 유지)
    cleanupOldCaches();
  } catch {
    // localStorage 용량 초과 등의 에러 무시
  }
}

/**
 * 오래된 캐시 항목 정리
 * fortune_cache_ 접두사를 가진 항목 중 만료된 것을 삭제
 */
function cleanupOldCaches(): void {
  try {
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith(CACHE_PREFIX)) continue;

      try {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const entry: CacheEntry = JSON.parse(raw);
        if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
          keysToRemove.push(key);
        }
      } catch {
        keysToRemove.push(key!);
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch {
    // 정리 실패는 무시
  }
}
