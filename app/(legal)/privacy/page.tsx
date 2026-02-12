import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

export const metadata: Metadata = {
  title: "개인정보처리방침 | 심랩",
  description: "심랩 개인정보처리방침 안내 페이지입니다.",
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

export default function PrivacyPage() {
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
            개인정보처리방침
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mb: 6 }}
          >
            시행일: 2025년 2월 12일 | 최종 수정: 2025년 2월 12일
          </Typography>

          {/* Content */}
          <Section title="1. 개인정보의 수집 및 이용 목적">
            <Typography variant="body2" sx={{ color: "inherit" }}>
              심랩(이하 &quot;서비스&quot;)은 사용자의 개인정보를 수집하지 않는
              것을 원칙으로 합니다. 본 서비스는 별도의 회원가입 없이 이용할
              수 있으며, 콘텐츠 이용 과정에서 입력하는 정보(이름, 생년월일 등)는
              결과 생성 목적으로만 일시적으로 사용되며 서버에 저장되지 않습니다.
            </Typography>
          </Section>

          <Section title="2. 수집하는 개인정보 항목">
            <Typography variant="body2" sx={{ color: "inherit" }}>
              서비스는 원칙적으로 개인정보를 수집하지 않습니다. 다만 아래의 경우
              최소한의 정보가 일시적으로 처리될 수 있습니다.
            </Typography>
            <Box component="ul" sx={{ pl: 2.5, mt: 1.5, "& li": { mb: 0.75 } }}>
              <li>
                <Typography variant="body2" sx={{ color: "inherit" }}>
                  <strong>콘텐츠 이용 시 입력 정보</strong>: 이름, 생년월일 등
                  (클라이언트에서만 처리, 서버 미저장)
                </Typography>
              </li>
              <li>
                <Typography variant="body2" sx={{ color: "inherit" }}>
                  <strong>위치 정보</strong>: 메뉴 추천 서비스에서 주변 음식점
                  검색 시 일시적으로 사용 (API 호출 시에만 휘발성으로 처리)
                </Typography>
              </li>
              <li>
                <Typography variant="body2" sx={{ color: "inherit" }}>
                  <strong>자동 수집 정보</strong>: 접속 로그, 쿠키, 접속 IP 등
                  (웹 서버 및 광고 서비스에 의해 자동 생성)
                </Typography>
              </li>
            </Box>
          </Section>

          <Section title="3. 개인정보의 보유 및 이용 기간">
            <Typography variant="body2" sx={{ color: "inherit" }}>
              서비스는 개인정보를 별도로 보유하지 않습니다. 콘텐츠 이용 과정에서
              입력된 정보는 브라우저 세션 종료 시 자동으로 삭제되며, 일부 기능
              (감정 점수화의 어제와 비교 기능)에서는 사용자 브라우저의
              LocalStorage를 활용하며, 이는 서버로 전송되지 않습니다.
            </Typography>
          </Section>

          <Section title="4. 개인정보의 제3자 제공">
            <Typography variant="body2" sx={{ color: "inherit" }}>
              서비스는 사용자의 개인정보를 제3자에게 제공하지 않습니다. 다만,
              아래의 경우는 예외로 합니다.
            </Typography>
            <Box component="ul" sx={{ pl: 2.5, mt: 1.5, "& li": { mb: 0.75 } }}>
              <li>
                <Typography variant="body2" sx={{ color: "inherit" }}>
                  법령에 의해 요구되는 경우
                </Typography>
              </li>
              <li>
                <Typography variant="body2" sx={{ color: "inherit" }}>
                  수사 목적으로 법령에 정해진 절차에 따라 요청이 있는 경우
                </Typography>
              </li>
            </Box>
          </Section>

          <Section title="5. 쿠키 및 광고">
            <Typography variant="body2" sx={{ color: "inherit" }}>
              서비스는 Google AdSense를 통한 광고를 게재할 수 있습니다. Google
              AdSense는 사용자의 관심사에 기반한 광고를 제공하기 위해 쿠키를
              사용할 수 있으며, 이에 대한 자세한 내용은{" "}
              <Link
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ fontWeight: 600 }}
              >
                Google 광고 정책
              </Link>
              을 참고해주세요. 사용자는 브라우저 설정을 통해 쿠키를 거부할 수
              있으나, 이 경우 일부 서비스 이용에 제한이 있을 수 있습니다.
            </Typography>
          </Section>

          <Section title="6. 이용자의 권리">
            <Typography variant="body2" sx={{ color: "inherit" }}>
              서비스는 개인정보를 수집·저장하지 않으므로 별도의 열람, 정정,
              삭제 요청 대상이 없습니다. 다만 브라우저 LocalStorage에 저장된
              데이터는 사용자가 직접 브라우저 설정에서 삭제할 수 있습니다.
            </Typography>
          </Section>

          <Section title="7. 개인정보 보호책임자">
            <Typography variant="body2" sx={{ color: "inherit" }}>
              개인정보 처리에 관한 문의사항이 있으시면 아래로 연락해주세요.
            </Typography>
            <Box component="ul" sx={{ pl: 2.5, mt: 1.5, "& li": { mb: 0.75 } }}>
              <li>
                <Typography variant="body2" sx={{ color: "inherit" }}>
                  서비스명: 심랩 (simlab.kr)
                </Typography>
              </li>
              <li>
                <Typography variant="body2" sx={{ color: "inherit" }}>
                  이메일: yimjunsu@gmail.com
                </Typography>
              </li>
            </Box>
          </Section>

          <Section title="8. 개인정보처리방침의 변경">
            <Typography variant="body2" sx={{ color: "inherit" }}>
              본 개인정보처리방침은 법령 변경 또는 서비스 운영 정책에 따라
              변경될 수 있으며, 변경 시 서비스 내 공지를 통해 안내드립니다.
            </Typography>
          </Section>
        </Box>
      </Container>
    </Box>
  );
}