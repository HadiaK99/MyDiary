import { NextResponse } from "next/server";
import { getSession } from "@backend/lib/auth";
import { ReviewService } from "@backend/services/ReviewService";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const childId = searchParams.get("childId") || session.userId;

  const reviews = await ReviewService.getReviews(childId);
  return NextResponse.json({ reviews });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "PARENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { childId, text, date } = await request.json();
    const review = await ReviewService.createReview(session.userId, childId, text, date);
    return NextResponse.json({ review });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await request.json();
    const review = await ReviewService.findById(id);
    if (!review || (review.parentId !== session.userId && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    await ReviewService.deleteReview(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
