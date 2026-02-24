import { ImageResponse } from "next/og";
import { loadKoreanFont } from "@/lib/og-font";

export const alt = "심랩 - 오늘의 메뉴 추천";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// 빌드 타임이 아닌 요청 타임에 생성 (폰트 로드를 위해)
export const dynamic = "force-dynamic";

const TEXT = "오늘의메뉴추천뭐먹을지고민될때심랩이골라드려요simlab.kr";

export default async function Image() {
  const font = await loadKoreanFont(TEXT);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #FF6B35 0%, #FF9A00 60%, #FFC107 100%)",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          position: "relative",
          fontFamily: "Noto Sans KR, sans-serif",
        }}
      >
        {/* 배경 패턴 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-80px",
            left: "-80px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-60px",
            right: "-60px",
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            display: "flex",
          }}
        />

        {/* 메인 콘텐츠 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 1,
          }}
        >
          <div style={{ fontSize: "96px", lineHeight: 1, marginBottom: "24px" }}>
            🍽️
          </div>
          <div
            style={{
              color: "#ffffff",
              fontSize: "60px",
              fontWeight: 700,
              marginBottom: "16px",
              textShadow: "0 2px 12px rgba(0,0,0,0.2)",
            }}
          >
            오늘의 메뉴 추천
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: "28px",
              marginBottom: "32px",
            }}
          >
            뭐 먹을지 고민될 때, 심랩이 골라드려요
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.2)",
              borderRadius: "40px",
              padding: "12px 32px",
              color: "#ffffff",
              fontSize: "22px",
              fontWeight: 600,
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