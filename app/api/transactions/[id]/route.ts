import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { TransactionWithCategory } from '@/lib/types';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { category_id, amount, description, date } = body;

    if (!category_id || !amount || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const stmt = db.prepare('UPDATE transactions SET category_id = ?, amount = ?, description = ?, date = ? WHERE id = ?');
    stmt.run(category_id, amount, description || null, date, id);

    const transaction = db.prepare(`
      SELECT
        t.*,
        c.name as category_name,
        c.type as category_type
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.id = ?
    `).get(id) as TransactionWithCategory;

    return NextResponse.json(transaction);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const stmt = db.prepare('DELETE FROM transactions WHERE id = ?');
    stmt.run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}
