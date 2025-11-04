import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { Category } from "@/lib/types";
import { logApiCall } from "@/lib/middleware";

async function getHandler(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const categories = db
      .prepare("SELECT * FROM categories WHERE user_id = ? ORDER BY type, name")
      .all(session.user.id) as Category[];
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

async function postHandler(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, type, budget_limit } = body;

    if (!name || !type || !["income", "expense", "other"].includes(type)) {
      return NextResponse.json({ error: "Invalid category data" }, { status: 400 });
    }

    const stmt = db.prepare("INSERT INTO categories (user_id, name, type, budget_limit) VALUES (?, ?, ?, ?)");
    const result = stmt.run(session.user.id, name, type, budget_limit || 0);

    const category = db.prepare("SELECT * FROM categories WHERE id = ?").get(result.lastInsertRowid) as Category;
    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  return logApiCall(req, () => getHandler(req))(req);
}

export async function POST(req: Request) {
  return logApiCall(req, postHandler)(req);
}
