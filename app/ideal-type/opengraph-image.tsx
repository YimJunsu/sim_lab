import { ImageResponse } from "next/og";
import { loadKoreanFont } from "@/lib/og-font";

export const alt = "심랩 - 이상형 성향 테스트";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

const TEXT = "이상형성향테스트나의연애을알아보세요당신이끌리는타입은무엇인가요simlab.kr";

export default async function Image() {
  const font = await loadKoreanFont(TEXT);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #1a1a2e 0%, #E84393 100%)",
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
              "radial-gradient(circle at 30% 70%, rgba(232,67,147,0.4) 0%, transparent 60%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background: "rgba(232,67,147,0.15)",
            display: "flex",
          }}
        />

        {/* 태그 */}
        <div
          style={{
            position: "absolute",
            top: "48px",
            left: "64px",
            background: "rgba(232,67,147,0.3)",
            border: "1px solid rgba(232,67,147,0.5)",
            borderRadius: "6px",
            padding: "8px 20px",
            color: "#ffb3d9",
            fontSize: "18px",
            fontWeight: 600,
            letterSpacing: "0.1em",
            display: "flex",
          }}
        >
          IDEAL TYPE TEST
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
            💕
          </div>
          <div
            style={{
              color: "#ffffff",
              fontSize: "58px",
              fontWeight: 700,
              marginBottom: "16px",
              textShadow: "0 2px 20px rgba(232,67,147,0.4)",
            }}
          >
            이상형 성향 테스트
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "28px",
              marginBottom: "32px",
            }}
          >
            나의 연애 성향과 이상형을 알아보세요
          </div>
          <div
            style={{
              background: "rgba(232,67,147,0.3)",
              borderRadius: "40px",
              padding: "12px 32px",
              color: "#ffb3d9",
              fontSize: "22px",
              fontWeight: 600,
              border: "1px solid rgba(232,67,147,0.5)",
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