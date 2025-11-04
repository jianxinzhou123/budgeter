import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all users with their transaction counts and category counts
    const users = db
      .prepare(
        `
        SELECT 
          u.id,
          u.email,
          u.name,
          u.role,
          u.is_banned,
          u.ban_reason,
          u.banned_until,
          u.force_password_reset,
          u.created_at,
          COUNT(DISTINCT t.id) as transaction_count,
          COUNT(DISTINCT c.id) as category_count,
          COALESCE(SUM(CASE WHEN t.amount > 0 THEN t.amount ELSE 0 END), 0) as total_income,
          COALESCE(SUM(CASE WHEN t.amount < 0 THEN ABS(t.amount) ELSE 0 END), 0) as total_expenses
        FROM users u
        LEFT JOIN transactions t ON u.id = t.user_id
        LEFT JOIN categories c ON u.id = c.user_id
        GROUP BY u.id, u.email, u.name, u.role, u.is_banned, u.ban_reason, u.banned_until, u.force_password_reset, u.created_at
        ORDER BY u.created_at DESC
      `
      )
      .all();

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
