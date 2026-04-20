import { NextResponse } from "next/server";
import { getSession } from "@backend/lib/auth";
import { AdminService } from "@backend/services/AdminService";

export async function GET() {
  const categories = await AdminService.getActivities();
  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { categories } = await request.json();
    await AdminService.updateActivities(categories);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin activities error:", error);
    return NextResponse.json({ error: "Failed to update activities" }, { status: 500 });
  }
}
