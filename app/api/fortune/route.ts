import { NextRequest, NextResponse } from "next/server";
import { calculateSaju, sajuToPromptText, type UserInput } from "@/lib/saju";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * 사주/운세 API 라우트
 * - 사용자 입력을 받아 사주를 계산하고 OpenAI API로 해석을 생성합니다.
 * - API 키는 서버 사이드에서만 사용되어 클라이언트에 노출되지 않습니다.
 * - IP별 + 전체 일일 요청 제한으로 예산을 보호합니다 (파일 기반, 서버리스 호환).
 */

export async function POST(request: NextRequest) {
  try {
    // ── 요청 제한 체크 ──
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")
      || "unknown";

    // rate-limit 체크 (파일 I/O 실패 시에도 요청을 차단하지 않음)
    let rateCheck = { allowed: true, remaining: 99 };
    try {
      rateCheck = await checkRateLimit(ip);
    } catch (e) {
      console.warn("Rate limit check failed, allowing request:", e);
    }
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "오늘의 운세 확인 횟수를 초과했습니다. 내일 다시 시도해주세요." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // 입력값 검증
    const { name, gender, birthYear, birthMonth, birthDay, birthHour } = body;

    if (!name || !gender || !birthYear || !birthMonth || !birthDay) {
      return NextResponse.json(
        { error: "필수 입력 항목이 누락되었습니다." },
        { status: 400 }
      );
    }

    if (gender !== "male" && gender !== "female") {
      return NextResponse.json(
        { error: "성별은 male 또는 female이어야 합니다." },
        { status: 400 }
      );
    }

    // 날짜 유효성 검증
    const year = Number(birthYear);
    const month = Number(birthMonth);
    const day = Number(birthDay);
    const hour = birthHour !== null && birthHour !== undefined ? Number(birthHour) : null;

    if (year < 1900 || year > new Date().getFullYear()) {
      return NextResponse.json(
        { error: "유효하지 않은 출생연도입니다." },
        { status: 400 }
      );
    }

    if (month < 1 || month > 12) {
      return NextResponse.json(
        { error: "유효하지 않은 월입니다." },
        { status: 400 }
      );
    }

    // 월별 최대 일수 검증 (윤년 포함)
    const maxDays = new Date(year, month, 0).getDate();
    if (day < 1 || day > maxDays) {
      return NextResponse.json(
        { error: `${month}월은 ${maxDays}일까지입니다.` },
        { status: 400 }
      );
    }

    if (hour !== null && (hour < 0 || hour > 23)) {
      return NextResponse.json(
        { error: "유효하지 않은 시간입니다." },
        { status: 400 }
      );
    }

    // 사주 계산
    const userInput: UserInput = {
      name: String(name).slice(0, 20),
      gender,
      birthYear: year,
      birthMonth: month,
      birthDay: day,
      birthHour: hour,
    };

    const sajuResult = calculateSaju(userInput);
    const sajuText = sajuToPromptText(userInput, sajuResult);

    // ── Mock / AI 분기 ──
    // 정식 오픈 시: Vercel 환경변수에서 use_mock_fortune=false 로 변경
    let fortune;
    if (process.env.use_mock_fortune !== "false") {
      fortune = {
        overall: `${name}님의 사주를 보니 올해는 전반적으로 좋은 기운이 감돌고 있습니다. 특히 봄과 여름 사이에 좋은 기회가 찾아올 수 있으니 준비를 잘 해두세요. 주변 사람들과의 관계에서 따뜻한 에너지를 받게 될 것입니다.`,
        love: `인간관계에서 새로운 인연이 찾아올 수 있는 시기입니다. 마음을 열고 주변을 둘러보면 뜻밖의 좋은 만남이 기다리고 있을 것입니다.`,
        wealth: `재물운이 안정적으로 흐르고 있습니다. 무리한 투자보다는 꾸준한 저축과 계획적인 소비가 더 큰 복을 가져다줄 것입니다.`,
        health: `건강 면에서는 규칙적인 생활 리듬을 유지하는 것이 중요합니다. 가벼운 산책이나 스트레칭으로 몸과 마음의 균형을 잡아보세요.`,
        advice: `작은 것에 감사하는 마음을 가지면 더 큰 행운이 자연스럽게 따라올 것입니다.`,
        lucky: {
          color: "파란색",
          number: "7",
          direction: "동쪽",
        },
      };
    } else {
      // ── 실제 AI 호출 ──
      const apiKey = process.env.openai_api_key;
      if (!apiKey) {
        return NextResponse.json(
          { error: "API 키값 오류. 관리자에게 문의하세요." },
          { status: 503 }
        );
      }

      const systemPrompt = `한국 전통 사주 전문가. 사주팔자 기반 운세 해석을 JSON으로 제공.
규칙: 한국어, 따뜻한 어조, 부정적 내용 지양, 오행/음양 반영.
카테고리: 종합운(3문장), 연애운(2문장), 재물운(2문장), 건강운(2문장), 조언(1문장), 행운요소.
JSON만 출력:
{"overall":"","love":"","wealth":"","health":"","advice":"","lucky":{"color":"","number":"","direction":""}}`;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: process.env.openai_model || "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: `사주 해석:\n${sajuText}`,
            },
          ],
          temperature: 0.8,
          max_tokens: 600,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("OpenAI API error:", response.status, errorData);

        if (response.status === 429) {
          return NextResponse.json(
            { error: "서비스 이용량이 많아 잠시 후 다시 시도해주세요." },
            { status: 429 }
          );
        }

        return NextResponse.json(
          { error: "AI 서비스 요청 중 오류가 발생했습니다." },
          { status: 502 }
        );
      }

      const data = await response.json();
      const aiContent = data.choices?.[0]?.message?.content;

      if (!aiContent) {
        return NextResponse.json(
          { error: "AI 응답을 받지 못했습니다." },
          { status: 502 }
        );
      }

      try {
        const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
        fortune = JSON.parse(jsonMatch ? jsonMatch[0] : aiContent);
      } catch {
        console.error("Failed to parse AI response:", aiContent);
        return NextResponse.json(
          { error: "AI 응답 처리 중 오류가 발생했습니다." },
          { status: 502 }
        );
      }
    }

    // 성공 로그
    console.log(`[Fortune API] 성공 - 이름: ${name}, IP: ${ip}, 모드: ${process.env.use_mock_fortune !== "false" ? "mock" : "AI"}, 남은횟수: ${rateCheck.remaining}`);

    // 사주 정보 + 남은 횟수 함께 반환
    return NextResponse.json({
      fortune,
      remaining: rateCheck.remaining,
      saju: {
        yearPillar: `${sajuResult.yearPillar.stem.name}${sajuResult.yearPillar.branch.name}`,
        monthPillar: `${sajuResult.monthPillar.stem.name}${sajuResult.monthPillar.branch.name}`,
        dayPillar: `${sajuResult.dayPillar.stem.name}${sajuResult.dayPillar.branch.name}`,
        hourPillar: sajuResult.hourPillar
          ? `${sajuResult.hourPillar.stem.name}${sajuResult.hourPillar.branch.name}`
          : null,
        yearPillarHanja: `${sajuResult.yearPillar.stem.hanja}${sajuResult.yearPillar.branch.hanja}`,
        monthPillarHanja: `${sajuResult.monthPillar.stem.hanja}${sajuResult.monthPillar.branch.hanja}`,
        dayPillarHanja: `${sajuResult.dayPillar.stem.hanja}${sajuResult.dayPillar.branch.hanja}`,
        hourPillarHanja: sajuResult.hourPillar
          ? `${sajuResult.hourPillar.stem.hanja}${sajuResult.hourPillar.branch.hanja}`
          : null,
        animal: sajuResult.yearPillar.branch.animal,
        dominantElement: sajuResult.dominantElement,
        elementBalance: sajuResult.elementBalance,
        yinYangBalance: sajuResult.yinYangBalance,
      },
    });
  } catch (error) {
    console.error("Fortune API error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}