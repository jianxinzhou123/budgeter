import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ isBanned: false });
    }

    const user = db
      .prepare("SELECT is_banned, banned_until, ban_reason FROM users WHERE id = ?")
      .get(session.user.id) as
      | {
          is_banned: number;
          banned_until: string | null;
          ban_reason: string | null;
        }
      | undefined;

    if (!user) {
      return NextResponse.json({ isBanned: false });
    }

    if (user.is_banned) {
      const now = new Date();
      const bannedUntil = user.banned_until ? new Date(user.banned_until) : null;

      // If banned permanently or ban is still active
      if (!bannedUntil || now < bannedUntil) {
        return NextResponse.json({
          isBanned: true,
          banReason: user.ban_reason,
          bannedUntil: user.banned_until,
        });
      }

      // If ban has expired, automatically unban the user
      if (bannedUntil && now >= bannedUntil) {
        db.prepare("UPDATE users SET is_banned = 0, ban_reason = NULL, banned_until = NULL WHERE id = ?").run(
          session.user.id
        );
        return NextResponse.json({ isBanned: false });
      }
    }

    return NextResponse.json({ isBanned: false });
  } catch (error) {
    console.error("Error checking ban status:", error);
    return NextResponse.json({ isBanned: false });
  }
}
