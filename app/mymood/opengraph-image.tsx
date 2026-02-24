import { ImageResponse } from "next/og";
import { loadKoreanFont } from "@/lib/og-font";

export const alt = "심랩 - 감정 점수화";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

const TEXT = "감정점수화오늘내상태를숫자로확인해보세요simlab.kr";

export default async function Image() {
  const font = await loadKoreanFont(TEXT);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #1a0533 0%, #6B21A8 60%, #9333EA 100%)",
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
              "radial-gradient(circle at 20% 80%, rgba(240,147,251,0.3) 0%, transparent 50%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "320px",
            height: "320px",
            borderRadius: "50%",
            background: "rgba(147,51,234,0.3)",
            display: "flex",
          }}
        />

        {/* 감정 이모지 행 */}
        <div
          style={{
            position: "absolute",
            top: "48px",
            display: "flex",
            gap: "20px",
            fontSize: "40px",
            opacity: 0.35,
          }}
        >
          <span>😊</span>
          <span>😴</span>
          <span>😤</span>
          <span>😌</span>
          <span>🥰</span>
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
            💭
          </div>
          <div
            style={{
              color: "#ffffff",
              fontSize: "60px",
              fontWeight: 700,
              marginBottom: "16px",
              textShadow: "0 2px 20px rgba(147,51,234,0.5)",
            }}
          >
            감정 점수화
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "28px",
              marginBottom: "32px",
            }}
          >
            오늘 내 감정 상태를 숫자로 확인해보세요
          </div>
          <div
            style={{
              background: "rgba(147,51,234,0.3)",
              borderRadius: "40px",
              padding: "12px 32px",
              color: "#D8B4FE",
              fontSize: "22px",
              fontWeight: 600,
              border: "1px solid rgba(167,91,234,0.5)",
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