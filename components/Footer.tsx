import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

const contentLinks = [
    { label: "메뉴 추천", href: "/menu/select" },
    { label: "감정 점수화", href: "/mymood/question" },
    { label: "이상형 테스트", href: "/ideal-type/test" },
    { label: "사주/운세", href: "/fortune/input" },
    { label: "동물상 테스트", href: "/animal-test/input" },
];

const legalLinks = [
    { label: "개인정보처리방침", href: "/privacy" },
    { label: "이용약관", href: "/terms" },
];

export default function Footer() {
    return (
        <Container
            sx={{
                py: { xs: 6, sm: 8 },
            }}
        >
            <Box
                sx={{
                    borderTop: "1px solid",
                    borderColor: "divider",
                    pt: { xs: 4, sm: 6 },
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* 위: 오른쪽 정렬 영역 */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 8,
                        alignSelf: "flex-end",
                        textAlign: "right",
                    }}
                >
                    {/* Legal */}
                    <Box>
                        <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, mb: 1.5 }}
                        >
                            법적 고지
                        </Typography>
                        <Stack spacing={1} alignItems="flex-end">
                            {legalLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    variant="body2"
                                    color="text.secondary"
                                    underline="hover"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </Stack>
                    </Box>

                    {/* Content */}
                    <Box>
                        <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, mb: 1.5 }}
                        >
                            콘텐츠
                        </Typography>
                        <Stack spacing={1} alignItems="flex-end">
                            {contentLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    variant="body2"
                                    color="text.secondary"
                                    underline="hover"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </Stack>
                    </Box>
                </Box>

                {/* 아래: 왼쪽 정렬 Copyright */}
                <Typography
                    variant="body2"
                    sx={{
                        color: "text.secondary",
                        mt: 6,
                        alignSelf: "flex-start",
                    }}
                >
                    &copy; {new Date().getFullYear()} SIMLAB. All rights reserved.
                </Typography>
            </Box>
        </Container>
    );
}
