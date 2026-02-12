"use client";

export default function GlobalError() {
  return (
    <html lang="ko">
      <body style={{ margin: 0, fontFamily: '"Noto Sans KR", system-ui, sans-serif' }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            textAlign: "center",
            padding: "0 24px",
          }}
        >
          <p style={{ color: "#6b7280", marginBottom: 32 }}>
            문제가 발생했어요. 잠시 후 다시 시도해주세요.
          </p>
          <a
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 24px",
              backgroundColor: "#3d5a99",
              color: "white",
              borderRadius: 12,
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            홈으로 돌아가기
          </a>
        </div>
      </body>
    </html>
  );
}
