import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { Category } from "@/lib/types";
import { logApiCall } from "@/lib/middleware";

async function putHandler(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, type, budget_limit } = body;

    if (!name || !type || !["income", "expense"].includes(type)) {
      return NextResponse.json({ error: "Invalid category data" }, { status: 400 });
    }

    const stmt = db.prepare("UPDATE categories SET name = ?, type = ?, budget_limit = ? WHERE id = ? AND user_id = ?");
    const result = stmt.run(name, type, budget_limit || 0, id, session.user.id);
    
    if (result.changes === 0) {
      return NextResponse.json({ error: "Category not found or access denied" }, { status: 404 });
    }

    const category = db.prepare("SELECT * FROM categories WHERE id = ? AND user_id = ?").get(id, session.user.id) as Category;
    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

async function deleteHandler(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const stmt = db.prepare("DELETE FROM categories WHERE id = ? AND user_id = ?");
    const result = stmt.run(id, session.user.id);
    
    if (result.changes === 0) {
      return NextResponse.json({ error: "Category not found or access denied" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  return logApiCall(req, (r) => putHandler(r, context))(req);
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  return logApiCall(req, (r) => deleteHandler(r, context))(req);
}
