import type { Metadata } from "next";
import { Suspense } from "react";
import AnimalTypeResultClient from "./AnimalTypeResultClient";

export const metadata: Metadata = {
  title: "동물상 테스트 결과 | 심랩",
  description:
    "그/그녀와 닮은 동물을 알아보세요. 다정함, 활력, 재치, 차분함, 매력.",
  openGraph: {
    title: "동물상 테스트 결과 | 심랩",
    description: "그/그녀와 닮은 동물을 알아보세요.",
    type: "website",
    locale: "ko_KR",
    siteName: "심랩",
    images: ["/og/simlab-default-og.png"],
  },
};

export default function AnimalTypeResultPage() {
  return (
    <Suspense>
      <AnimalTypeResultClient />
    </Suspense>
  );
}
