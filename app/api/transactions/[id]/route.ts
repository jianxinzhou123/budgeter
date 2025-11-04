import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { TransactionWithCategory } from "@/lib/types";
import { logApiCall } from "@/lib/middleware";

async function putHandler(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { category_id, amount, description, date } = body;

    if (!category_id || !amount || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const stmt = db.prepare(
      "UPDATE transactions SET category_id = ?, amount = ?, description = ?, date = ? WHERE id = ? AND user_id = ?"
    );
    const result = stmt.run(category_id, amount, description || null, date, id, session.user.id);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Transaction not found or access denied" }, { status: 404 });
    }

    const transaction = db
      .prepare(
        `
      SELECT
        t.*,
        c.name as category_name,
        c.type as category_type
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.id = ? AND t.user_id = ?
    `
      )
      .get(id, session.user.id) as TransactionWithCategory;

    return NextResponse.json(transaction);
  } catch {
    return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 });
  }
}

async function deleteHandler(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const stmt = db.prepare("DELETE FROM transactions WHERE id = ? AND user_id = ?");
    const result = stmt.run(id, session.user.id);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Transaction not found or access denied" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 });
  }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  return logApiCall(req, (r) => putHandler(r, context))(req);
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  return logApiCall(req, (r) => deleteHandler(r, context))(req);
}
