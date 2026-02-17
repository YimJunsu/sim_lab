import type { Metadata } from "next";

export const metadata: Metadata = {
  openGraph: {
    images: [
      {
        url: "/og/saju-result-og.png",
        width: 1200,
        height: 630,
        alt: "심랩 - 사주/미니 운세",
      },
    ],
  },
};

export default function FortuneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}