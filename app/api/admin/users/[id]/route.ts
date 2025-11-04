import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = await params;

    // Get user details with their transactions and categories
    const user = db
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
          u.created_at
        FROM users u
        WHERE u.id = ?
      `
      )
      .get(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user's transactions
    const transactions = db
      .prepare(
        `
        SELECT 
          t.id,
          t.amount,
          t.description,
          t.date,
          t.created_at,
          c.name as category_name,
          c.type as category_type
        FROM transactions t
        JOIN categories c ON t.category_id = c.id
        WHERE t.user_id = ?
        ORDER BY t.date DESC
        LIMIT 50
      `
      )
      .all(userId);

    // Get user's categories
    const categories = db
      .prepare(
        `
        SELECT 
          c.id,
          c.name,
          c.type,
          c.budget_limit,
          c.created_at,
          COUNT(t.id) as transaction_count,
          COALESCE(SUM(t.amount), 0) as total_spent
        FROM categories c
        LEFT JOIN transactions t ON c.id = t.category_id
        WHERE c.user_id = ?
        GROUP BY c.id, c.name, c.type, c.budget_limit, c.created_at
        ORDER BY c.created_at DESC
      `
      )
      .all(userId);

    return NextResponse.json({
      user,
      transactions,
      categories,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = await params;
    const body = await request.json();
    const { action, reason, bannedUntil } = body;

    if (!["ban", "unban"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    if (action === "ban") {
      if (!reason) {
        return NextResponse.json({ error: "Ban reason is required" }, { status: 400 });
      }

      // Update user ban status
      db.prepare(
        `
        UPDATE users 
        SET is_banned = 1, 
            ban_reason = ?, 
            banned_until = ?, 
            banned_by = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `
      ).run(reason, bannedUntil || null, session.user.id, userId);
    } else {
      // Unban user
      db.prepare(
        `
        UPDATE users 
        SET is_banned = 0, 
            ban_reason = NULL, 
            banned_until = NULL, 
            banned_by = NULL,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `
      ).run(userId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating user ban status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
