import type { Metadata } from "next";
import { Suspense } from "react";
import IdealTypeResultClient from "./IdealTypeResultClient";

export const metadata: Metadata = {
  title: "이상형 성향 테스트 결과 | 심랩",
  description:
    "나의 연애 성향과 이상형을 알아보세요. 리더형, 감성형, 안정형, 유머형, 지적형.",
  openGraph: {
    title: "이상형 성향 테스트 결과 | 심랩",
    description: "나의 연애 성향과 이상형을 알아보세요.",
    type: "website",
    locale: "ko_KR",
    siteName: "심랩",
    images: ["/og/simlab-default-og.png"],
  },
};

export default function IdealTypeResultPage() {
  return (
    <Suspense>
      <IdealTypeResultClient />
    </Suspense>
  );
}
