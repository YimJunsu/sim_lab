import { promises as fs } from "fs";
import path from "path";

/**
 * 파일 기반 레이트 리미터 (Vercel 서버리스)
 * - /tmp에 파일 저장 (Vercel은 /tmp만 쓰기 가능)
 * - IP별 일일 제한 + 전체 일일 제한
 */

const RATE_DIR = path.join("/tmp", "rate-limit");

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

function getNextMidnight(): number {
  const now = new Date();
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  return next.getTime();
}

async function ensureDir() {
  await fs.mkdir(RATE_DIR, { recursive: true });
}

/** 특정 키의 레이트 리밋 파일 읽기 */
async function readEntry(key: string): Promise<RateLimitEntry | null> {
  const safe = key.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = path.join(RATE_DIR, `${safe}.json`);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const entry: RateLimitEntry = JSON.parse(raw);
    // 리셋 시간 경과 시 만료 처리
    if (Date.now() > entry.resetAt) {
      await fs.unlink(filePath).catch(() => {});
      return null;
    }
    return entry;
  } catch {
    return null;
  }
}

/** 특정 키의 레이트 리밋 파일 쓰기 */
async function writeEntry(key: string, entry: RateLimitEntry): Promise<void> {
  const safe = key.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = path.join(RATE_DIR, `${safe}.json`);
  await fs.writeFile(filePath, JSON.stringify(entry), "utf-8");
}

/**
 * 레이트 리밋 체크
 * @returns allowed: 요청 허용 여부, remaining: 남은 횟수
 */
export async function checkRateLimit(ip: string): Promise<{ allowed: boolean; remaining: number }> {
  await ensureDir();

  const perIpLimit = Number(process.env.per_ip_daily_limit) || 5;
  const dailyLimit = Number(process.env.daily_request_limit) || 150;
  const resetAt = getNextMidnight();

  // 전체 일일 제한 체크
  const globalEntry = await readEntry("_global");
  const globalCount = globalEntry?.count ?? 0;
  if (globalCount >= dailyLimit) {
    return { allowed: false, remaining: 0 };
  }

  // IP별 제한 체크
  const ipEntry = await readEntry(`ip_${ip}`);
  const ipCount = ipEntry?.count ?? 0;
  if (ipCount >= perIpLimit) {
    return { allowed: false, remaining: 0 };
  }

  // 허용 → 카운터 증가
  await writeEntry("_global", { count: globalCount + 1, resetAt });
  await writeEntry(`ip_${ip}`, { count: ipCount + 1, resetAt });

  return { allowed: true, remaining: perIpLimit - (ipCount + 1) };
}