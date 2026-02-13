# OpenGraph 설정 가이드 (심랩 프로젝트)

## 1. OpenGraph란?

카카오톡, 페이스북, 트위터 등에서 링크를 공유할 때 나타나는 미리보기(썸네일, 제목, 설명)를 결정하는 메타 태그.

```html
<!-- 실제 렌더링되는 HTML -->
<meta property="og:title" content="사주/미니 운세 | 심랩" />
<meta property="og:description" content="AI가 분석한 오늘의 운세..." />
<meta property="og:image" content="https://simlab.kr/og/fortune.png" />
<meta property="og:url" content="https://simlab.kr/fortune/input" />
```

---

## 2. Next.js에서 OG 설정 방법

### 2-1. 정적 메타데이터 (대부분의 페이지)

`layout.tsx` 또는 `page.tsx`에서 `metadata` 객체를 export.

```tsx
// app/fortune/input/layout.tsx
export const metadata: Metadata = {
  title: "사주/미니 운세 | 심랩",
  description: "생년월일로 나의 사주를 풀어보세요.",
  openGraph: {
    title: "사주/미니 운세 | 심랩",
    description: "생년월일로 나의 사주를 풀어보세요.",
    type: "website",
    locale: "ko_KR",
    siteName: "심랩",
    url: "https://simlab.kr/fortune/input",
    images: [
      {
        url: "/og/fortune-input.png",   // public/og/fortune-input.png
        width: 1200,
        height: 630,
        alt: "심랩 사주 운세",
      },
    ],
  },
};
```

### 2-2. 동적 메타데이터 (URL 파라미터에 따라 변하는 페이지)

`generateMetadata()` 함수를 export. 현재 결과 공유 페이지에서 사용 중.

```tsx
// app/fortune/result/page.tsx
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const name = extractNameFromShare(params.s);

  return {
    title: `${name}님의 사주 운세 | 심랩`,
    openGraph: {
      title: `${name}님의 사주 운세 | 심랩`,
      description: `${name}님의 운세를 AI가 분석했습니다.`,
      // ...
    },
  };
}
```

---

## 3. 메타데이터 상속/오버라이드 규칙

Next.js는 **하위 경로의 metadata가 상위를 덮어씁니다.**

```
app/layout.tsx          → 전역 기본값 (fallback)
  └─ app/fortune/
       ├─ input/layout.tsx  → fortune input 전용 OG (전역 OG 무시됨)
       └─ result/page.tsx   → fortune result 전용 OG (전역 OG 무시됨)
```

| 속성 | 동작 |
|------|------|
| `title` | 하위에서 정의하면 **완전 교체** |
| `openGraph` | 하위에서 정의하면 **완전 교체** (merge 아님!) |
| `openGraph.images` | 하위에서 정의하지 않으면 상위 것이 상속됨 |

**주의:** `openGraph` 전체를 다시 써야 합니다. 일부만 쓰면 나머지가 누락될 수 있음.

---

## 4. 심랩 컨텐츠별 OG 설정 현황

| 경로 | OG title | 파일 위치 | 방식 |
|------|----------|-----------|------|
| `/` | 심랩 \| 가볍게 즐기는 심리 테스트 | `app/layout.tsx` | 정적 (전역 fallback) |
| `/fortune/input` | 사주/미니 운세 \| 심랩 | `app/fortune/input/layout.tsx` | 정적 |
| `/fortune/result` | 사주/미니 운세 결과 \| 심랩 | `app/fortune/result/page.tsx` | 동적 (`generateMetadata`) |
| `/fortune/result?s=...` | {이름}님의 사주 운세 \| 심랩 | 위와 동일 | 동적 (공유 링크) |

---

## 5. 새 컨텐츠 추가 시 OG 설정 템플릿

새 컨텐츠를 만들 때 아래 구조를 따르면 됩니다.

### 5-1. 입력 페이지 (정적 OG)

```
app/{content-name}/input/layout.tsx
```

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "{컨텐츠명} | 심랩",
  description: "{컨텐츠 설명}",
  openGraph: {
    title: "{컨텐츠명} | 심랩",
    description: "{컨텐츠 설명 - 짧게}",
    type: "website",
    locale: "ko_KR",
    siteName: "심랩",
    // url: "https://simlab.kr/{content-name}/input",
    // images: [{ url: "/og/{content-name}-input.png", width: 1200, height: 630 }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

### 5-2. 결과 페이지 (동적 OG - 공유 대응)

```
app/{content-name}/result/page.tsx
```

```tsx
import type { Metadata } from "next";

interface Props {
  searchParams: Promise<{ s?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const shareParam = params.s;

  if (shareParam) {
    const name = extractNameFromShare(shareParam); // 컨텐츠별 구현
    if (name) {
      return {
        title: `${name}님의 {컨텐츠명} 결과 | 심랩`,
        description: `${name}님의 {컨텐츠명} 결과를 확인해보세요!`,
        openGraph: {
          title: `${name}님의 {컨텐츠명} 결과 | 심랩`,
          description: `${name}님의 {컨텐츠명} 결과를 확인해보세요!`,
          type: "website",
          locale: "ko_KR",
          siteName: "심랩",
          // images: [{ url: "/og/{content-name}-result.png", width: 1200, height: 630 }],
        },
      };
    }
  }

  return {
    title: "{컨텐츠명} 결과 | 심랩",
    description: "{기본 결과 설명}",
    openGraph: {
      title: "{컨텐츠명} 결과 | 심랩",
      description: "{기본 결과 설명}",
      type: "website",
      locale: "ko_KR",
      siteName: "심랩",
    },
  };
}
```

---

## 6. OG 이미지 규격

| 항목 | 권장값 |
|------|--------|
| 크기 | **1200 x 630px** (필수) |
| 포맷 | PNG 또는 JPG |
| 파일 크기 | 300KB 이하 권장 |
| 저장 위치 | `public/og/{content-name}.png` |

카카오톡은 이미지 비율이 맞지 않으면 잘리므로 1.91:1 비율 엄수.

---

## 7. OG 디버깅/테스트 방법

| 플랫폼 | 도구 URL |
|--------|----------|
| 카카오톡 | https://developers.kakao.com/tool/debugger/sharing |
| 페이스북 | https://developers.facebook.com/tools/debug/ |
| 트위터 | https://cards-dev.twitter.com/validator |
| 일반 | https://www.opengraph.xyz/ |

**카카오톡 캐시 초기화:** 카카오 디버거에서 URL 입력 후 "캐시 초기화" 버튼 클릭. 변경 후 반드시 실행해야 반영됨.

---

## 8. 체크리스트 (컨텐츠 추가 시)

- [ ] `input/layout.tsx`에 정적 `metadata` + `openGraph` 정의
- [ ] `result/page.tsx`에 `generateMetadata()` 정의 (공유 링크 대응)
- [ ] OG title에 다른 컨텐츠와 겹치지 않는 고유 이름 사용
- [ ] OG image 1200x630px 준비 후 `public/og/`에 배치
- [ ] 배포 후 카카오 디버거에서 미리보기 확인 + 캐시 초기화
- [ ] 공유 링크(`?s=...`)로도 OG가 정상 노출되는지 확인