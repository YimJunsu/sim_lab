import { readFileSync } from "fs";
import { join } from "path";

let localFontCache: ArrayBuffer | null | undefined = undefined;

/**
 * 로컬 폰트 파일을 로드합니다.
 * /public/fonts/NotoSansKR-Bold.ttf 파일이 필요합니다.
 *
 * 폰트 설치: https://fonts.google.com/noto/specimen/Noto+Sans+KR
 * → Download family → NotoSansKR-Bold.ttf → public/fonts/ 에 복사
 */
async function loadLocalFont(): Promise<ArrayBuffer | null> {
  if (localFontCache !== undefined) return localFontCache;
  try {
    const buf = readFileSync(join(process.cwd(), "public/fonts/NotoSansKR-Bold.ttf"));
    localFontCache = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
    return localFontCache;
  } catch {
    localFontCache = null;
    return null;
  }
}

/**
 * Google Fonts CDN에서 Noto Sans KR 폰트를 가져옵니다.
 * `text` 파라미터로 필요한 글자만 서브셋하여 크기를 최소화합니다.
 * satori는 woff2를 지원하지 않으므로 Safari 5.x UA로 woff를 요청합니다.
 */
async function fetchGoogleFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700&text=${encodeURIComponent(text)}&display=block`,
      {
        headers: {
          // Safari 5.x UA → woff 형식 반환 (satori는 woff2 미지원)
          "User-Agent":
            "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
        },
      }
    ).then((r) => r.text());

    const woffUrl = css.match(/src: url\((.+?)\) format\('woff'\)/)?.[1];
    if (!woffUrl) return null;

    return fetch(woffUrl).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

/**
 * Noto Sans KR Bold 폰트를 로드합니다.
 * 우선순위: 로컬 파일 → Google Fonts CDN
 *
 * @param text OG 이미지에 표시될 한글 텍스트 (서브셋 최적화용)
 */
export async function loadKoreanFont(text: string): Promise<ArrayBuffer | null> {
  const local = await loadLocalFont();
  if (local) return local;
  return fetchGoogleFont(text);
}
