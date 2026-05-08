import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth-options";

export async function getSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  
  return {
    userId: session.user.id,
    username: session.user.username,
    role: session.user.role,
  };
}
