import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { Category } from '@/lib/types';
import { logApiCall } from '@/lib/middleware';

async function getHandler(request: Request) {
  try {
    const categories = db.prepare('SELECT * FROM categories ORDER BY type, name').all() as Category[];
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

async function postHandler(request: Request) {
  try {
    const body = await request.json();
    const { name, type, budget_limit } = body;

    if (!name || !type || !['income', 'expense'].includes(type)) {
      return NextResponse.json({ error: 'Invalid category data' }, { status: 400 });
    }

    const stmt = db.prepare('INSERT INTO categories (name, type, budget_limit) VALUES (?, ?, ?)');
    const result = stmt.run(name, type, budget_limit || 0);

    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid) as Category;
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  return logApiCall(req, getHandler)(req);
}

export async function POST(req: Request) {
  return logApiCall(req, postHandler)(req);
}
