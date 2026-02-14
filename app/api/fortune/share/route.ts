import { NextRequest, NextResponse } from "next/server";
import { saveShareData } from "@/lib/fortune-store";

/**
 * POST /api/fortune/share
 * 운세 결과를 저장하고 짧은 공유 ID를 반환
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 최소 검증: input, saju, fortune 필드 존재 여부
    if (!body.input?.name || !body.saju || !body.fortune) {
      return NextResponse.json(
        { error: "유효하지 않은 공유 데이터입니다." },
        { status: 400 }
      );
    }

    const id = await saveShareData(body);

    return NextResponse.json({ id });
  } catch {
    return NextResponse.json(
      { error: "공유 링크 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}