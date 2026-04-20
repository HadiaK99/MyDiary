import { NextResponse } from "next/server";
import { AuthService } from "@backend/services/AuthService";
import { encrypt } from "@backend/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { username, password, role, childId } = await request.json();

    if (!username || !password || !role) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const user = await AuthService.signup(username, password, role, childId);

    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await encrypt({ userId: user.id, username: user.username, role: user.role, expires });
    (await cookies()).set("session", session, { 
      expires, 
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({ user });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error creating user";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
