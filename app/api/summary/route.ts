import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { BudgetSummary } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    let dateFilter = '';
    const params: any[] = [];

    if (month && year) {
      dateFilter = `WHERE strftime('%Y', t.date) = ? AND strftime('%m', t.date) = ?`;
      params.push(year, month.padStart(2, '0'));
    }

    // Get category breakdown
    const categoryBreakdown = db.prepare(`
      SELECT
        c.id as category_id,
        c.name as category_name,
        c.type,
        c.budget_limit,
        COALESCE(SUM(t.amount), 0) as total
      FROM categories c
      LEFT JOIN transactions t ON c.id = t.category_id ${dateFilter ? 'AND ' + dateFilter.replace('WHERE ', '') : ''}
      GROUP BY c.id, c.name, c.type, c.budget_limit
      ORDER BY c.type, c.name
    `).all(...params);

    // Calculate totals
    const totals = db.prepare(`
      SELECT
        c.type,
        COALESCE(SUM(t.amount), 0) as total
      FROM categories c
      LEFT JOIN transactions t ON c.id = t.category_id ${dateFilter}
      GROUP BY c.type
    `).all(...params) as { type: string; total: number }[];

    const totalIncome = totals.find(t => t.type === 'income')?.total || 0;
    const totalExpenses = totals.find(t => t.type === 'expense')?.total || 0;

    const summary: BudgetSummary = {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      categoryBreakdown: categoryBreakdown as any[]
    };

    return NextResponse.json(summary);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch summary' }, { status: 500 });
  }
}
