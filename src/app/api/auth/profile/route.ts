import { NextResponse } from "next/server";
import { getSession } from "@backend/lib/auth";
import { AuthService } from "@backend/services/AuthService";

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { username, password } = await request.json();
    const updatedUser = await AuthService.updateUser(session.userId, { username, password });
    return NextResponse.json({ user: updatedUser });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
