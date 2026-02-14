import { NextRequest, NextResponse } from "next/server";
import { getShareData } from "@/lib/fortune-store";

/**
 * GET /api/mymood/share/[id]
 * 저장된 감정 점수 공유 데이터 조회
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await getShareData(id);

  if (!data) {
    return NextResponse.json(
      { error: "공유 데이터를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}