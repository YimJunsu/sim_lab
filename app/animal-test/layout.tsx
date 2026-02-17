import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "동물상 테스트 | 심랩",
  description:
    "그/그녀와 닮은 동물은? 5가지 성향으로 알아보는 동물상 테스트.",
  openGraph: {
    title: "동물상 테스트 | 심랩",
    description: "그/그녀와 닮은 동물은? 동물상 테스트로 알아보세요.",
    type: "website",
    locale: "ko_KR",
    siteName: "심랩",
    images: [
      {
        url: "/og/simlab-default-og.png",
        width: 1200,
        height: 630,
        alt: "심랩 - 동물상 테스트",
      },
    ],
  },
};

export default function AnimalTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
