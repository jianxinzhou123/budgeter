import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { TransactionWithCategory } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    const description = searchParams.get('description');
    const categoryId = searchParams.get('categoryId');
    const amountOperator = searchParams.get('amountOperator');
    const amount = searchParams.get('amount');

    let query = `
      SELECT
        t.*,
        c.name as category_name,
        c.type as category_type
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
    `;

    const params: any[] = [];
    const conditions: string[] = [];

    if (month && year) {
      conditions.push(`strftime('%Y', t.date) = ? AND strftime('%m', t.date) = ?`);
      params.push(year, month.padStart(2, '0'));
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
      if (amountOperator === 'greater') {
        conditions.push(`t.amount > ?`);
      } else if (amountOperator === 'less') {
        conditions.push(`t.amount < ?`);
      } else if (amountOperator === 'equal') {
        conditions.push(`t.amount = ?`);
      }
      params.push(amount);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY t.date DESC, t.created_at DESC`;

    const transactions = db.prepare(query).all(...params) as TransactionWithCategory[];
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category_id, amount, description, date } = body;

    if (!category_id || !amount || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const stmt = db.prepare('INSERT INTO transactions (category_id, amount, description, date) VALUES (?, ?, ?, ?)');
    const result = stmt.run(category_id, amount, description || null, date);

    const transaction = db.prepare(`
      SELECT
        t.*,
        c.name as category_name,
        c.type as category_type
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.id = ?
    `).get(result.lastInsertRowid) as TransactionWithCategory;

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}
