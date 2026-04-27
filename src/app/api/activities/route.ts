import { NextResponse } from "next/server";
import { getSession } from "@backend/lib/auth";
import { ActivityService } from "@backend/services/ActivityService";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || session.userId;

  try {
    const isParent = session.role === "PARENT" || session.role === "ADMIN";
    const categories = await ActivityService.getEffectiveActivities(userId, isParent);
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Failed to fetch activities:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Only parents or admins can create custom activities
  if (session.role !== "PARENT" && session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { type, userId, name, pointsPerItem, categoryId } = await request.json();
    
    if (type === "category") {
      const category = await ActivityService.addCustomCategory(userId, name, pointsPerItem);
      return NextResponse.json({ category });
    } else if (type === "activity") {
      const activity = await ActivityService.addCustomActivity(userId, categoryId, name);
      return NextResponse.json({ activity });
    }
    
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Failed to create custom activity:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (session.role !== "PARENT" && session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { type, userId, id, enabled, points, pointsPerItem } = await request.json();
    
    if (type === "category") {
      await ActivityService.updateCategoryConfig(userId, id, enabled, pointsPerItem);
    } else if (type === "activity") {
      await ActivityService.updateActivityConfig(userId, id, enabled, points);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update activity config:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
