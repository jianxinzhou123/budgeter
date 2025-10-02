import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { Category } from '@/lib/types';
import { logApiCall } from '@/lib/middleware';

async function putHandler(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, type, budget_limit } = body;

    if (!name || !type || !['income', 'expense'].includes(type)) {
      return NextResponse.json({ error: 'Invalid category data' }, { status: 400 });
    }

    const stmt = db.prepare('UPDATE categories SET name = ?, type = ?, budget_limit = ? WHERE id = ?');
    stmt.run(name, type, budget_limit || 0, id);

    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(id) as Category;
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

async function deleteHandler(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const stmt = db.prepare('DELETE FROM categories WHERE id = ?');
    stmt.run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}

export async function PUT(req: Request, context: any) {
  return logApiCall(req, (r) => putHandler(r, context))(req);
}

export async function DELETE(req: Request, context: any) {
  return logApiCall(req, (r) => deleteHandler(r, context))(req);
}
