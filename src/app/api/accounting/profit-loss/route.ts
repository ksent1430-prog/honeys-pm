import { NextRequest } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { requireAuth, handleApiError, successResponse } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()), 10);
    const month = searchParams.get('month'); // optional: '1' through '12'

    let query = sql`
      SELECT
        EXTRACT(MONTH FROM e.expense_date) as month,
        e.category,
        SUM(e.amount::numeric) as total_expenses,
        COUNT(*)::int as expense_count
      FROM expenses e
      WHERE EXTRACT(YEAR FROM e.expense_date) = ${year}
    `;
    if (month) query = sql`${query} AND EXTRACT(MONTH FROM e.expense_date) = ${parseInt(month)}`;
    query = sql`${query} GROUP BY EXTRACT(MONTH FROM e.expense_date), e.category ORDER BY month, category`;

    const expenseResult = await db.execute(query);

    const revenueQuery = sql`
      SELECT
        EXTRACT(MONTH FROM i.created_at) as month,
        SUM(CASE WHEN i.status = 'PAID' THEN i.amount::numeric ELSE 0 END) as collected,
        SUM(i.amount::numeric) as total_billed
      FROM invoices i
      WHERE EXTRACT(YEAR FROM i.created_at) = ${year}
    `;
    if (month) revenueQuery.append(sql` AND EXTRACT(MONTH FROM i.created_at) = ${parseInt(month)}`);
    revenueQuery.append(sql` GROUP BY EXTRACT(MONTH FROM i.created_at) ORDER BY month`);

    const revenueResult = await db.execute(revenueQuery);

    const expenseRows = Array.isArray(expenseResult) ? expenseResult : expenseResult.rows || [];
    const revenueRows = Array.isArray(revenueResult) ? revenueResult : revenueResult.rows || [];

    // Calculate summary
    const totalExpenses = expenseRows.reduce((sum: number, r: any) => sum + (Number(r.total_expenses) || 0), 0);
    const totalRevenue = revenueRows.reduce((sum: number, r: any) => sum + (Number(r.collected) || 0), 0);

    return successResponse({
      year,
      summary: {
        totalRevenue,
        totalExpenses,
        netProfit: totalRevenue - totalExpenses,
        profitMargin: totalRevenue > 0 ? Math.round(((totalRevenue - totalExpenses) / totalRevenue) * 100) : 0,
      },
      revenueByMonth: revenueRows,
      expensesByCategory: expenseRows,
    });
  } catch (error) { return handleApiError(error); }
}