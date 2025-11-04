import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const adminUser = db.prepare("SELECT role FROM users WHERE LOWER(email) = LOWER(?)").get(session.user.email) as
      | { role: string }
      | undefined;

    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { userId, forceReset } = await request.json();

    if (!userId || typeof forceReset !== "boolean") {
      return NextResponse.json(
        { error: "Invalid parameters. userId and forceReset (boolean) are required" },
        { status: 400 }
      );
    }

    // Check if target user exists
    const targetUser = db.prepare("SELECT id, email FROM users WHERE id = ?").get(userId) as
      | { id: number; email: string }
      | undefined;

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update the force_password_reset flag
    const updateStmt = db.prepare(
      "UPDATE users SET force_password_reset = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    );
    updateStmt.run(forceReset ? 1 : 0, userId);

    return NextResponse.json(
      {
        message: forceReset
          ? `User ${targetUser.email} will be required to reset their password on next login`
          : `Password reset requirement removed for user ${targetUser.email}`,
        userId: userId,
        forceReset: forceReset,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating force password reset:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
