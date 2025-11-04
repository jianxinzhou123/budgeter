import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { BudgetSummary } from "@/lib/types";
import { logApiCall } from "@/lib/middleware";

async function getHandler(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    let dateFilter = "";
    const categoryParams: (string | number)[] = [];
    const totalsParams: (string | number)[] = [];

    if (month && year) {
      dateFilter = `AND strftime('%Y', t.date) = ? AND strftime('%m', t.date) = ?`;
      categoryParams.push(session.user.id, year, month.padStart(2, "0"), session.user.id);
      totalsParams.push(session.user.id, year, month.padStart(2, "0"), session.user.id);
    } else {
      categoryParams.push(session.user.id, session.user.id);
      totalsParams.push(session.user.id, session.user.id);
    }

    // Get category breakdown
    const categoryBreakdown = db
      .prepare(
        `
      SELECT
        c.id as category_id,
        c.name as category_name,
        c.type,
        c.budget_limit,
        COALESCE(SUM(t.amount), 0) as total
      FROM categories c
      LEFT JOIN transactions t ON c.id = t.category_id AND t.user_id = ? ${dateFilter}
      WHERE c.user_id = ?
      GROUP BY c.id, c.name, c.type, c.budget_limit
      ORDER BY c.type, c.name
    `
      )
      .all(...categoryParams);

    // Calculate totals
    const totals = db
      .prepare(
        `
      SELECT
        c.type,
        COALESCE(SUM(t.amount), 0) as total
      FROM categories c
      LEFT JOIN transactions t ON c.id = t.category_id AND t.user_id = ? ${dateFilter}
      WHERE c.user_id = ?
      GROUP BY c.type
    `
      )
      .all(...totalsParams) as { type: string; total: number }[];

    const totalIncome = totals.find((t) => t.type === "income")?.total || 0;
    const totalExpenses = totals.find((t) => t.type === "expense")?.total || 0;

    const summary: BudgetSummary = {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      categoryBreakdown: categoryBreakdown as BudgetSummary["categoryBreakdown"],
    };

    return NextResponse.json(summary);
  } catch {
    return NextResponse.json({ error: "Failed to fetch summary" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  return logApiCall(req, getHandler)(req);
}
