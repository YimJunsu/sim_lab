import { ImageResponse } from "next/og";
import { loadKoreanFont } from "@/lib/og-font";

export const alt = "심랩 - 동물상 테스트";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

const TEXT = "동물상테스트나와닮은은무엇일까요simlab.kr";

export default async function Image() {
  const font = await loadKoreanFont(TEXT);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          position: "relative",
          fontFamily: "Noto Sans KR, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 70% 30%, rgba(56,239,125,0.15) 0%, transparent 50%)",
            display: "flex",
          }}
        />

        {/* 상단 레이블 */}
        <div
          style={{
            position: "absolute",
            top: "48px",
            left: "64px",
            background: "rgba(56,239,125,0.15)",
            border: "1px solid rgba(56,239,125,0.3)",
            borderRadius: "6px",
            padding: "8px 20px",
            color: "#38EF7D",
            fontSize: "18px",
            fontWeight: 600,
            letterSpacing: "0.1em",
            display: "flex",
          }}
        >
          ANIMAL TYPE TEST
        </div>

        {/* 동물 이모지 행 */}
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            display: "flex",
            gap: "16px",
            fontSize: "36px",
            opacity: 0.4,
          }}
        >
          <span>🐶</span>
          <span>🐱</span>
          <span>🐰</span>
          <span>🐻</span>
          <span>🦊</span>
          <span>🐺</span>
        </div>

        {/* 메인 콘텐츠 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 1,
          }}
        >
          <div style={{ fontSize: "88px", lineHeight: 1, marginBottom: "24px" }}>
            🦁
          </div>
          <div
            style={{
              color: "#ffffff",
              fontSize: "60px",
              fontWeight: 700,
              marginBottom: "16px",
            }}
          >
            동물상 테스트
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: "28px",
              marginBottom: "32px",
            }}
          >
            나와 닮은 동물은 무엇일까요?
          </div>
          <div
            style={{
              background: "rgba(56,239,125,0.15)",
              borderRadius: "40px",
              padding: "12px 32px",
              color: "#38EF7D",
              fontSize: "22px",
              fontWeight: 600,
              border: "1px solid rgba(56,239,125,0.3)",
            }}
          >
            simlab.kr
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font
        ? [{ name: "Noto Sans KR", data: font, style: "normal", weight: 700 }]
        : [],
    }
  );
}
