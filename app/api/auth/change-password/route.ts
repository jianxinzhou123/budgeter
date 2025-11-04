import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";
import db from "@/lib/db";

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current password and new password are required" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "New password must be at least 6 characters long" }, { status: 400 });
    }

    // Get user from database
    const user = db.prepare("SELECT * FROM users WHERE LOWER(email) = LOWER(?)").get(session.user.email) as
      | {
          id: number;
          email: string;
          password: string;
        }
      | undefined;

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isCurrentPasswordValid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }

    // Verify new password is different from current password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return NextResponse.json({ error: "New password must be different from your current password" }, { status: 400 });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    const updateStmt = db.prepare("UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
    updateStmt.run(hashedNewPassword, user.id);

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
