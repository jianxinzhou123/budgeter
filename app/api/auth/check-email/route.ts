import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = db
      .prepare("SELECT is_banned, ban_reason, banned_until FROM users WHERE LOWER(email) = LOWER(?)")
      .get(email) as
      | {
          is_banned: number;
          ban_reason: string | null;
          banned_until: string | null;
        }
      | undefined;

    if (!user) {
      return NextResponse.json({ exists: false });
    }

    if (user.is_banned) {
      const now = new Date();
      const bannedUntil = user.banned_until ? new Date(user.banned_until) : null;

      // Check if ban is still active
      if (!bannedUntil || now < bannedUntil) {
        return NextResponse.json({
          exists: true,
          isBanned: true,
          banReason: user.ban_reason,
          bannedUntil: user.banned_until,
          isPermanent: !user.banned_until,
        });
      }
    }

    return NextResponse.json({
      exists: true,
      isBanned: false,
    });
  } catch (error) {
    console.error("Error checking user ban status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
