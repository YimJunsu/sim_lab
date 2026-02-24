import { ImageResponse } from "next/og";
import { loadKoreanFont } from "@/lib/og-font";

export const alt = "심랩 - 마법의 책";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

const TEXT = "마법의책당신질문에답이있을지도모릅니다simlab.kr";

export default async function Image() {
  const font = await loadKoreanFont(TEXT);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #0D0D0D 0%, #1a1a2e 50%, #2C2C54 100%)",
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
              "radial-gradient(circle at 50% 40%, rgba(99,102,241,0.2) 0%, transparent 60%)",
            display: "flex",
          }}
        />

        {/* 황금빛 테두리 장식 */}
        <div
          style={{
            position: "absolute",
            top: "32px",
            left: "32px",
            right: "32px",
            bottom: "32px",
            border: "1px solid rgba(212,175,55,0.2)",
            borderRadius: "16px",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: "40px",
            right: "40px",
            bottom: "40px",
            border: "1px solid rgba(212,175,55,0.1)",
            borderRadius: "12px",
            display: "flex",
          }}
        />

        {/* 상단 레이블 */}
        <div
          style={{
            position: "absolute",
            top: "60px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(212,175,55,0.1)",
            border: "1px solid rgba(212,175,55,0.3)",
            borderRadius: "6px",
            padding: "8px 24px",
            color: "#D4AF37",
            fontSize: "16px",
            fontWeight: 600,
            letterSpacing: "0.2em",
            display: "flex",
          }}
        >
          THE MAGIC BOOK
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
            📖
          </div>
          <div
            style={{
              color: "#D4AF37",
              fontSize: "60px",
              fontWeight: 700,
              marginBottom: "16px",
              textShadow: "0 0 40px rgba(212,175,55,0.4)",
            }}
          >
            마법의 책
          </div>
          <div
            style={{
              color: "rgba(212,175,55,0.6)",
              fontSize: "26px",
              marginBottom: "32px",
              letterSpacing: "0.05em",
            }}
          >
            당신의 질문에 답이 있을지도 모릅니다
          </div>
          <div
            style={{
              background: "rgba(212,175,55,0.1)",
              borderRadius: "40px",
              padding: "12px 32px",
              color: "#D4AF37",
              fontSize: "22px",
              fontWeight: 600,
              border: "1px solid rgba(212,175,55,0.3)",
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
