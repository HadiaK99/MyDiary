import { NextResponse } from "next/server";
import { getSession } from "@backend/lib/auth";
import { AdminService } from "@backend/services/AdminService";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const users = await AdminService.getAllUsers();
    return NextResponse.json({ users });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to fetch users";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
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
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ error: "Username already exists" }, { status: 400 });
    }
    const msg = error instanceof Error ? error.message : "Failed to create user";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, ...data } = await request.json();
    if (!id) return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    
    const user = await AdminService.updateUser(id, data);
    return NextResponse.json({ user });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update user";
    return NextResponse.json({ error: msg }, { status: 500 });
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
  } catch {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
