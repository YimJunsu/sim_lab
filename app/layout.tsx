import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
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
  title: "심랩 | 가볍게 즐기는 심리 테스트",
  description:
    "오늘의 메뉴 추천, 감정 점수화, 이상형 테스트, 운세, 동물상 테스트까지! 심랩에서 나를 알아가는 시간을 가져보세요.",
  openGraph: {
    title: "심랩 | 가볍게 즐기는 심리 테스트",
    description:
      "오늘의 메뉴 추천, 감정 점수화, 이상형 테스트, 운세, 동물상 테스트까지!",
    type: "website",
    locale: "ko_KR",
    siteName: "심랩",
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
      </body>
    </html>
  );
}
