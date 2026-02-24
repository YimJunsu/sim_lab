import Divider from "@mui/material/Divider";
import Hero from "@/components/Hero";
import ContentCards from "@/components/ContentCard";
import JsonLd from "@/components/JsonLd";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "심랩",
  alternateName: "SimLab",
  url: "https://simlab.kr",
  description:
    "오늘의 메뉴 추천, 감정 점수화, 이상형 테스트, 사주/운세, 동물상 테스트까지! 심랩에서 나를 알아가는 시간을 가져보세요.",
  inLanguage: "ko-KR",
  publisher: {
    "@type": "Organization",
    name: "심랩",
    url: "https://simlab.kr",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "심랩",
  alternateName: "SimLab",
  url: "https://simlab.kr",
  description:
    "오늘의 메뉴 추천, 감정 점수화, 이상형 테스트, 사주/운세, 동물상 테스트를 즐길 수 있는 엔터테인먼트 플랫폼",
};

export default function Home() {
  return (
    <>
      <JsonLd data={websiteJsonLd} />
      <JsonLd data={organizationJsonLd} />
      <Hero />
      <Divider />
      <ContentCards />
    </>
  );
}
