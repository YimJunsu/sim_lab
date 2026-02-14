import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

/**
 * 공유 데이터 서버 저장소 (Vercel 서버리스)
 * - /tmp에 파일 저장 (Vercel은 /tmp만 쓰기 가능)
 * - 짧은 ID로 공유 데이터를 저장/조회
 * - 12시간 TTL: 만료된 데이터는 조회 시 삭제 + 주기적 정리
 */

const SHARES_DIR = path.join("/tmp", "shares");
const SHARE_TTL_MS = 12 * 60 * 60 * 1000; // 12시간

interface StoredShare {
  createdAt: number;
  data: unknown;
}

/** 저장 디렉토리 생성 (없으면) */
async function ensureDir() {
  await fs.mkdir(SHARES_DIR, { recursive: true });
}

/** 랜덤 8자리 ID 생성 (base62) */
function generateId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = crypto.randomBytes(8);
  let id = "";
  for (const byte of bytes) {
    id += chars[byte % chars.length];
  }
  return id;
}

/** 공유 데이터 저장 → 짧은 ID 반환 */
export async function saveShareData(data: unknown): Promise<string> {
  await ensureDir();
  const id = generateId();
  const filePath = path.join(SHARES_DIR, `${id}.json`);
  const stored: StoredShare = { createdAt: Date.now(), data };
  await fs.writeFile(filePath, JSON.stringify(stored), "utf-8");

  // 비동기로 만료 파일 정리 (응답 차단하지 않음)
  cleanupExpired().catch(() => {});

  return id;
}

/** ID로 공유 데이터 조회 (없거나 만료 시 null) */
export async function getShareData(id: string): Promise<unknown | null> {
  // ID 형식 검증 (보안: path traversal 방지)
  if (!/^[A-Za-z0-9]{8}$/.test(id)) return null;

  const filePath = path.join(SHARES_DIR, `${id}.json`);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const stored: StoredShare = JSON.parse(raw);

    // 12시간 만료 체크
    if (Date.now() - stored.createdAt > SHARE_TTL_MS) {
      // 만료 → 삭제 후 null 반환
      fs.unlink(filePath).catch(() => {});
      return null;
    }

    return stored.data;
  } catch {
    return null;
  }
}

/** 만료된 공유 파일 일괄 정리 */
async function cleanupExpired(): Promise<void> {
  try {
    const files = await fs.readdir(SHARES_DIR);
    const now = Date.now();

    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      const filePath = path.join(SHARES_DIR, file);
      try {
        const raw = await fs.readFile(filePath, "utf-8");
        const stored: StoredShare = JSON.parse(raw);
        if (now - stored.createdAt > SHARE_TTL_MS) {
          await fs.unlink(filePath);
        }
      } catch {
        // 파싱 실패 파일도 삭제
        await fs.unlink(filePath).catch(() => {});
      }
    }
  } catch {
    // 정리 실패는 무시
  }
}