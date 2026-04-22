import { NextResponse } from "next/server";
import { getSession } from "@backend/lib/auth";
import { AdminService } from "@backend/services/AdminService";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await AdminService.getAllUsers();
  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    if (!data.username || !data.password || !data.role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const user = await AdminService.createUser(data);
    return NextResponse.json({ user });
  } catch (error: any) {
    if (error.code === 'P2002') { // Prisma unique constraint error
      return NextResponse.json({ error: "Username already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Failed to create user" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    if (id === session.userId) {
      return NextResponse.json({ error: "Cannot delete self" }, { status: 400 });
    }
    await AdminService.deleteUser(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
