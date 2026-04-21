import { NextResponse } from "next/server";
import { getSession } from "@backend/lib/auth";
import { AuthService } from "@backend/services/AuthService";

export async function DELETE() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await AuthService.deleteUser(session.userId);
    // Clear cookie by sending a response that clears the token
    const response = NextResponse.json({ message: "Account deleted" });
    response.cookies.set("token", "", { expires: new Date(0) });
    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete account";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
