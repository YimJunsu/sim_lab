import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export const metadata: Metadata = {
  title: "이용약관 | 심랩",
  description: "심랩 서비스 이용약관 안내 페이지입니다.",
};

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <Box component="section" sx={{ mb: 5 }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: "text.primary",
          mb: 1.5,
          fontSize: { xs: "1.05rem", sm: "1.15rem" },
        }}
      >
        {title}
      </Typography>
      <Box sx={{ color: "text.secondary", lineHeight: 1.85 }}>{children}</Box>
    </Box>
  );
}

export default function TermsPage() {
  return (
    <Box
      sx={{
        width: "100%",
        backgroundImage:
          "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(230, 40%, 92%), transparent)",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Container sx={{ pt: { xs: 14, sm: 18 }, pb: { xs: 8, sm: 12 } }}>
        <Box sx={{ maxWidth: 720, mx: "auto" }}>
          {/* Header */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              mb: 1,
              fontSize: { xs: "1.6rem", sm: "2rem" },
            }}
          >
            이용약관
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mb: 6 }}
          >
            시행일: 2025년 2월 12일 | 최종 수정: 2025년 2월 12일
          </Typography>

          {/* Content */}
          <Section title="제1조 (목적)">
            <Typography variant="body2" sx={{ color: "inherit" }}>
              본 약관은 심랩(이하 &quot;서비스&quot;)이 제공하는 웹 기반 콘텐츠
              서비스의 이용 조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.
            </Typography>
          </Section>

          <Section title="제2조 (서비스의 내용)">
            <Typography variant="body2" sx={{ color: "inherit" }}>
              서비스는 다음과 같은 엔터테인먼트 목적의 콘텐츠를 제공합니다.
            </Typography>
            <Box component="ul" sx={{ pl: 2.5, mt: 1.5, "& li": { mb: 0.75 } }}>
              <li>
                <Typography variant="body2" sx={{ color: "inherit" }}>
                  기분 기반 오늘의 메뉴 추천
                </Typography>
              </li>
              <li>
                <Typography variant="body2" sx={{ color: "inherit" }}>
                  감정 점수화 및 시각화
                </Typography>
              </li>
              <li>
                <Typography variant="body2" sx={{ color: "inherit" }}>
                  이상형 성향 테스트
                </Typography>
              </li>
              <li>
                <Typography variant="body2" sx={{ color: "inherit" }}>
                  사주 / 미니 운세 (엔터테인먼트 목적)
                </Typography>
              </li>
              <li>
                <Typography variant="body2" sx={{ color: "inherit" }}>
                  동물상 테스트
                </Typography>
              </li>
            </Box>
          </Section>

          <Section title="제3조 (이용 조건)">
            <Box component="ol" sx={{ pl: 2.5, "& li": { mb: 0.75 } }}>
              <li>
                <Typography variant="body2" sx={{ color: "inherit" }}>
                  서비스는 별도의 회원가입 없이 누구나 자유롭게 이용할 수
                  있습니다.
                </Typography>
              </li>
              <li>
                <Typography variant="body2" sx={{ color: "inherit" }}>
                  서비스 이용 시 입력하는 정보(이름, 생년월일 등)는 결과 생성
                  목적으로만 사용되며 서버에 저장되지 않습니다.
                </Typography>
              </li>
              <li>
                <Typography variant="body2" sx={{ color: "inherit" }}>
                  서비스는 만 14세 이상의 이용자를 대상으로 합니다.
                </Typography>
              </li>
            </Box>
          </Section>

          <Section title="제4조 (서비스의 성격 및 면책)">
            <Box component="ol" sx={{ pl: 2.5, "& li": { mb: 0.75 } }}>
              <li>
                <Typography variant="body2" sx={{ color: "inherit" }}>
                  본 서비스에서 제공하는 모든 결과(메뉴 추천, 감정 분석, 운세,
                  성향 분석 등)는 <strong>엔터테인먼트 목적</strong>으로만
                  제공되며, 전문적인 심리 상담, 의학적 조언, 점술 등을 대체하지
                  않습니다.
                </Typography>
              </li>
              <li>
                <Typography variant="body2" sx={{ color: "inherit" }}>
                  메뉴 추천 서비스에서 표시되는 영양 정보는 일반적인 평균치이며,
                  실제 영양 성분과 다를 수 있습니다. 알레르기 및 건강 관련
                  사항은 반드시 전문가와 상담하시기 바랍니다.
                </Typography>
              </li>
              <li>
                <Typography variant="body2" sx={{ color: "inherit" }}>
                  서비스 결과에 대한 해석 및 활용은 전적으로 이용자 본인의
                  책임입니다.
                </Typography>
              </li>
            </Box>
          </Section>

          <Section title="제5조 (지식재산권)">
            <Box component="ol" sx={{ pl: 2.5, "& li": { mb: 0.75 } }}>
              <li>
                <Typography variant="body2" sx={{ color: "inherit" }}>
                  서비스에 포함된 콘텐츠, 디자인, 텍스트, 그래픽 등의
                  지식재산권은 서비스 운영자에게 귀속됩니다.
                </Typography>
              </li>
              <li>
                <Typography variant="body2" sx={{ color: "inherit" }}>
                  이용자가 서비스를 통해 생성한 결과(테스트 결과 이미지 등)는
                  개인적인 용도 및 SNS 공유 목적으로 자유롭게 사용할 수
                  있습니다.
                </Typography>
              </li>
              <li>
                <Typography variant="body2" sx={{ color: "inherit" }}>
                  Portions of this site use code from Material-UI (MIT License).
                  Template has been customized.
                </Typography>
              </li>
            </Box>
          </Section>

          <Section title="제6조 (AI 생성 이미지)">
            <Box component="ol" sx={{ pl: 2.5, "& li": { mb: 0.75 } }}>
              <li>
                <Typography variant="body2" sx={{ color: "inherit" }}>
                  서비스 내 일부 캐릭터 이미지는 Google Gemini(AI)를 활용하여
                  생성되었습니다.
                </Typography>
              </li>
              <li>
                <Typography variant="body2" sx={{ color: "inherit" }}>
                  AI 생성 이미지의 저작권 및 사용 권한은 해당 AI 서비스의
                  이용약관을 따르며, 서비스 운영자는 이를 비상업적
                  엔터테인먼트 목적으로 사용하고 있습니다.
                </Typography>
              </li>
              <li>
                <Typography variant="body2" sx={{ color: "inherit" }}>
                  AI 생성 이미지가 사용된 위치에는 출처 표기가 포함되어
                  있습니다.
                </Typography>
              </li>
            </Box>
          </Section>

          <Section title="제7조 (광고)">
            <Typography variant="body2" sx={{ color: "inherit" }}>
              서비스는 운영비 충당을 위해 Google AdSense 등의 광고를 게재할 수
              있습니다. 광고 콘텐츠의 내용 및 광고주와의 거래에 대해서는 서비스
              운영자가 책임지지 않습니다.
            </Typography>
          </Section>

          <Section title="제8조 (이용자의 의무)">
            <Typography variant="body2" sx={{ color: "inherit" }}>
              이용자는 다음 행위를 해서는 안 됩니다.
            </Typography>
            <Box component="ul" sx={{ pl: 2.5, mt: 1.5, "& li": { mb: 0.75 } }}>
              <li>
                <Typography variant="body2" sx={{ color: "inherit" }}>
                  서비스를 부정한 목적으로 이용하는 행위
                </Typography>
              </li>
              <li>
                <Typography variant="body2" sx={{ color: "inherit" }}>
                  서비스의 운영을 고의로 방해하는 행위
                </Typography>
              </li>
              <li>
                <Typography variant="body2" sx={{ color: "inherit" }}>
                  서비스의 콘텐츠를 무단으로 복제, 배포, 상업적으로 이용하는
                  행위
                </Typography>
              </li>
              <li>
                <Typography variant="body2" sx={{ color: "inherit" }}>
                  자동화된 수단을 이용하여 서비스에 과도한 부하를 가하는 행위
                </Typography>
              </li>
            </Box>
          </Section>

          <Section title="제9조 (서비스 변경 및 중단)">
            <Typography variant="body2" sx={{ color: "inherit" }}>
              서비스 운영자는 운영상, 기술상의 필요에 따라 사전 고지 후 서비스의
              전부 또는 일부를 변경하거나 중단할 수 있습니다. 무료로 제공되는
              서비스의 변경 또는 중단에 대하여 별도의 보상을 하지 않습니다.
            </Typography>
          </Section>

          <Section title="제10조 (약관의 변경)">
            <Typography variant="body2" sx={{ color: "inherit" }}>
              본 약관은 관련 법령 변경 또는 서비스 운영 정책에 따라 변경될 수
              있으며, 변경 시 서비스 내 공지를 통해 안내드립니다. 변경된 약관에
              동의하지 않는 경우 서비스 이용을 중단할 수 있습니다.
            </Typography>
          </Section>

          <Section title="제11조 (준거법 및 분쟁 해결)">
            <Typography variant="body2" sx={{ color: "inherit" }}>
              본 약관의 해석 및 분쟁 해결에 관해서는 대한민국 법률을 적용하며,
              분쟁 발생 시 서비스 운영자의 소재지를 관할하는 법원을 제1심
              관할법원으로 합니다.
            </Typography>
          </Section>
        </Box>
      </Container>
    </Box>
  );
}