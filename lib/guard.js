import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

// For API routes: returns { session } or { error }
export async function requireRole(role) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { error: Response.json({ error: "Not logged in" }, { status: 401 }) };
  }
  if (role && session.user.role !== role) {
    return { error: Response.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { session };
}
