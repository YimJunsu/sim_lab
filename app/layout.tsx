import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import Script from "next/script";
import ThemeProvider from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://simlab.kr"),
  title: {
    template: "%s | 심랩",
    default: "심랩 | 심심할때 즐기는 여러가지 컨텐츠",
  },
  description:
    "오늘의 메뉴 추천, 감정 점수화, 이상형 테스트, 사주/운세, 동물상 테스트까지! 심랩에서 나를 알아가는 시간을 가져보세요.",
  keywords: [
    "심랩",
    "simlab",
    "심심할때",
    "재미있는 테스트",
    "무료 테스트",
    "온라인 테스트",
    "성격 테스트",
    "메뉴 추천",
    "사주",
    "운세",
    "이상형 테스트",
    "동물상 테스트",
    "감정 테스트",
    "마법의 책",
  ],
  authors: [{ name: "심랩", url: "https://simlab.kr" }],
  creator: "심랩",
  publisher: "심랩",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "심랩 | 심심할때 즐기는 여러가지 컨텐츠",
    description:
      "오늘의 메뉴 추천, 감정 점수화, 이상형 테스트, 운세, 동물상 테스트까지! 심랩에서 나를 알아가는 시간을 가져보세요.",
    url: "https://simlab.kr",
    type: "website",
    locale: "ko_KR",
    siteName: "심랩",
    images: [
      {
        url: "/og/simlab-default-og.png",
        width: 1200,
        height: 630,
        alt: "심랩 - 심심할때 즐기는 여러가지 컨텐츠",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "심랩 | 심심할때 즐기는 여러가지 컨텐츠",
    description:
      "오늘의 메뉴 추천, 감정 점수화, 이상형 테스트, 운세, 동물상 테스트까지!",
    images: ["/og/simlab-default-og.png"],
  },
  verification: {
    google: "ShjJ5SL16VVAty2nkHinvAAQAwX5gDXHP395YuRYNn0",
  },
  other: {
    "google-adsense-account": "ca-pub-9691519911667390",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKr.variable}`}>
        <ThemeProvider>
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9691519911667390"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
