import { NextResponse } from "next/server";
import { getSession } from "@backend/lib/auth";
import { AuthService } from "@backend/services/AuthService";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ user: null });

  const user = await AuthService.getById(session.userId);
  return NextResponse.json({ user });
}
