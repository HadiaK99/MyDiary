import { NextResponse } from "next/server";
import { getSession } from "@backend/lib/auth";
import { AdminService } from "@backend/services/AdminService";

export async function GET() {
  try {
    const rawCategories = await AdminService.getActivities();
    // Transform DB objects into the string[] shape the frontend expects
    const categories = rawCategories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      pointsPerItem: cat.pointsPerItem,
      scoringMode: cat.scoringMode,
      activities: cat.activities.map((a) => ({
        id: a.id,
        name: a.name,
        points: a.points,
      })),
    }));
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Admin activities GET error:", error);
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { categories } = await request.json();
    // Transform string[] activities back into { name: string }[] for the service
    const transformed = categories.map((cat: any) => ({
      name: cat.name,
      pointsPerItem: cat.pointsPerItem,
      scoringMode: cat.scoringMode || "GROUP",
      activities: cat.activities.map((act: any) => ({ 
        name: typeof act === 'string' ? act : act.name,
        points: typeof act === 'string' ? null : (act.points || null)
      })),
    }));
    await AdminService.updateActivities(transformed);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin activities error details:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: "Failed to update activities", details: message }, { status: 500 });
  }
}
