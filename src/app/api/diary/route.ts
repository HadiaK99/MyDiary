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
    const { date, data, score, rating, userId: targetUserId } = await request.json();
    
    // Only admins can post for other users
    const userId = (session.role === "ADMIN" && targetUserId) ? targetUserId : session.userId;
    
    const entry = await DiaryService.upsertEntry(userId, date, data, score, rating);
    return NextResponse.json({ entry });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save entry" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { date, userId: targetUserId } = await request.json();
    
    // Only admins can delete for other users, or users can delete their own
    if (session.role !== "ADMIN" && targetUserId && targetUserId !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userId = targetUserId || session.userId;
    await DiaryService.deleteEntry(userId, date);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete entry" }, { status: 500 });
  }
}
