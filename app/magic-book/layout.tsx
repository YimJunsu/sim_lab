import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "마법의 책 | 심랩",
  description:
    "고대 유적지에서 발견된 마법의 책. 속마음으로 질문을 생각하고 책에게 물어보세요. O, X, 혹은 특별한 행운의 답이 기다립니다.",
  openGraph: {
    title: "마법의 책 | 심랩",
    description: "마법의 책에게 질문을 던져보세요. 당신의 질문에 답이 있을지도 모릅니다.",
    type: "website",
    locale: "ko_KR",
    siteName: "심랩",
    images: [
      {
        url: "/og/simlab-default-og.png",
        width: 1200,
        height: 630,
        alt: "심랩 - 마법의 책",
      },
    ],
  },
};

export default function MagicBookLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}