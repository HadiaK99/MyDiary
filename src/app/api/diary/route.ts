import { NextResponse } from "next/server";
import { getSession } from "@backend/lib/auth";
import { DiaryService } from "@backend/services/DiaryService";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || session.userId;
  const date = searchParams.get("date");

  if (date) {
    const entry = await DiaryService.getEntry(userId, date);
    return NextResponse.json({ entry });
  }

  const entries = await DiaryService.getEntries(userId);
  return NextResponse.json({ entries });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { date, data, score, rating } = await request.json();
    const entry = await DiaryService.upsertEntry(session.userId, date, data, score, rating);
    return NextResponse.json({ entry });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save entry" }, { status: 500 });
  }
}
