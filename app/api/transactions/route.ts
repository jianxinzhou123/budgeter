import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { TransactionWithCategory } from "@/lib/types";
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
    const description = searchParams.get("description");
    const categoryId = searchParams.get("categoryId");
    const amountOperator = searchParams.get("amountOperator");
    const amount = searchParams.get("amount");

    let query = `
      SELECT
        t.*,
        c.name as category_name,
        c.type as category_type
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ?
    `;

    const params: (string | number)[] = [session.user.id];
    const conditions: string[] = [];

    if (month && year) {
      conditions.push(`strftime('%Y', t.date) = ? AND strftime('%m', t.date) = ?`);
      params.push(year, month.padStart(2, "0"));
    }

    // Search filters
    if (description) {
      conditions.push(`t.description LIKE ?`);
      params.push(`%${description}%`);
    }

    if (categoryId) {
      conditions.push(`t.category_id = ?`);
      params.push(categoryId);
    }

    if (amount && amountOperator) {
      if (amountOperator === "greater") {
        conditions.push(`t.amount > ?`);
      } else if (amountOperator === "less") {
        conditions.push(`t.amount < ?`);
      } else if (amountOperator === "equal") {
        conditions.push(`t.amount = ?`);
      }
      params.push(amount);
    }

    if (conditions.length > 0) {
      query += ` AND ${conditions.join(" AND ")}`;
    }

    query += ` ORDER BY t.date DESC, t.created_at DESC`;

    const transactions = db.prepare(query).all(...params) as TransactionWithCategory[];
    return NextResponse.json(transactions);
  } catch {
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

async function postHandler(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { category_id, amount, description, date } = body;

    if (!category_id || !amount || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const stmt = db.prepare(
      "INSERT INTO transactions (user_id, category_id, amount, description, date) VALUES (?, ?, ?, ?, ?)"
    );
    const result = stmt.run(session.user.id, category_id, amount, description || null, date);

    const transaction = db
      .prepare(
        `
      SELECT
        t.*,
        c.name as category_name,
        c.type as category_type
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.id = ?
    `
      )
      .get(result.lastInsertRowid) as TransactionWithCategory;

    return NextResponse.json(transaction, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  return logApiCall(req, getHandler)(req);
}

async function deleteHandler(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    const description = searchParams.get("description");
    const categoryId = searchParams.get("categoryId");
    const amountOperator = searchParams.get("amountOperator");
    const amount = searchParams.get("amount");

    let query = `DELETE FROM transactions`;
    const params: (string | number)[] = [];
    const conditions: string[] = [];

    if (month && year) {
      conditions.push(`strftime('%Y', date) = ? AND strftime('%m', date) = ?`);
      params.push(year, month.padStart(2, "0"));
    }

    // Search filters
    if (description) {
      conditions.push(`description LIKE ?`);
      params.push(`%${description}%`);
    }

    if (categoryId) {
      conditions.push(`category_id = ?`);
      params.push(categoryId);
    }

    if (amount && amountOperator) {
      if (amountOperator === "greater") {
        conditions.push(`amount > ?`);
      } else if (amountOperator === "less") {
        conditions.push(`amount < ?`);
      } else if (amountOperator === "equal") {
        conditions.push(`amount = ?`);
      }
      params.push(amount);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    const stmt = db.prepare(query);
    const result = stmt.run(...params);

    return NextResponse.json({
      success: true,
      deletedCount: result.changes,
    });
  } catch {
    return NextResponse.json({ error: "Failed to delete transactions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  return logApiCall(req, postHandler)(req);
}

export async function DELETE(req: Request) {
  return logApiCall(req, deleteHandler)(req);
}
