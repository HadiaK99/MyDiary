import { NextResponse } from "next/server";
import { AuthService } from "@backend/services/AuthService";

export async function POST(request: Request) {
  try {
    const { username, password, role, childIds, email } = await request.json();

    if (!username || !role) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const user = await AuthService.signup(username, password, role, childIds, email);

    return NextResponse.json({ user });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error creating user";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
