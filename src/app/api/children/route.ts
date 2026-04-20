import { NextResponse } from "next/server";
import prisma from "@backend/lib/prisma";

export async function GET() {
  try {
    const children = await prisma.user.findMany({
      where: { role: "CHILD" },
      select: { id: true, username: true },
    });
    return NextResponse.json({ users: children });
  } catch (error) {
    console.error("Failed to fetch children for signup:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
