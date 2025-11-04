import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check the user's current ban status in the database
    const user = db
      .prepare("SELECT is_banned, ban_reason, banned_until FROM users WHERE id = ?")
      .get(session.user.id) as
      | {
          is_banned: number;
          ban_reason: string | null;
          banned_until: string | null;
        }
      | undefined;

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user is currently banned
    if (user.is_banned) {
      const now = new Date();
      const bannedUntil = user.banned_until ? new Date(user.banned_until) : null;

      // Check if ban is still active (permanent ban or not expired)
      if (!bannedUntil || now < bannedUntil) {
        return NextResponse.json({
          isBanned: true,
          reason: user.ban_reason,
          bannedUntil: user.banned_until,
        });
      }

      // If ban has expired, automatically unban the user
      if (bannedUntil && now >= bannedUntil) {
        db.prepare("UPDATE users SET is_banned = 0, ban_reason = NULL, banned_until = NULL WHERE id = ?").run(
          session.user.id
        );
        console.log(`Auto-unbanned expired ban for user ID: ${session.user.id}`);

        return NextResponse.json({
          isBanned: false,
          reason: null,
          bannedUntil: null,
        });
      }
    }

    // User is not banned
    return NextResponse.json({
      isBanned: false,
      reason: null,
      bannedUntil: null,
    });
  } catch (error) {
    console.error("Error checking ban status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
