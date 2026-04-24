import { NextResponse } from "next/server";
import { getSession } from "@backend/lib/auth";
import { GoalService } from "@backend/services/GoalService";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const goals = await GoalService.getGoals(session.userId);
  return NextResponse.json({ goals });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { text } = await request.json();
    const goal = await GoalService.createGoal(session.userId, text);
    return NextResponse.json({ goal });
  } catch {
    return NextResponse.json({ error: "Failed to create goal" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, completed } = await request.json();
    const goal = await GoalService.toggleGoal(id, completed);
    return NextResponse.json({ goal });
  } catch {
    return NextResponse.json({ error: "Failed to update goal" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await request.json();
    await GoalService.deleteGoal(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete goal" }, { status: 500 });
  }
}
