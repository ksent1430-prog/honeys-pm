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
    const quarter = searchParams.get('quarter'); // '1', '2', '3', '4'

    let expenseQuery = sql`
      SELECT
        e.category,
        SUM(e.amount::numeric) as total,
        COUNT(*)::int as count
      FROM expenses e
      WHERE EXTRACT(YEAR FROM e.expense_date) = ${year}
    `;
    if (quarter) {
      const qStart = (parseInt(quarter) - 1) * 3 + 1;
      const qEnd = parseInt(quarter) * 3;
      expenseQuery = sql`${expenseQuery} AND EXTRACT(MONTH FROM e.expense_date) BETWEEN ${qStart} AND ${qEnd}`;
    }
    expenseQuery = sql`${expenseQuery} GROUP BY e.category ORDER BY total DESC`;

    const revenueQuery = sql`
      SELECT
        i.status,
        COUNT(*)::int as count,
        SUM(i.amount::numeric) as total
      FROM invoices i
      WHERE EXTRACT(YEAR FROM i.created_at) = ${year}
    `;
    if (quarter) {
      const qStart = (parseInt(quarter) - 1) * 3 + 1;
      const qEnd = parseInt(quarter) * 3;
      revenueQuery.append(sql` AND EXTRACT(MONTH FROM i.created_at) BETWEEN ${qStart} AND ${qEnd}`);
    }
    revenueQuery.append(sql` GROUP BY i.status`);

    const deductionsQuery = sql`
      SELECT
        SUM(e.amount::numeric) as total_deductible
      FROM expenses e
      WHERE EXTRACT(YEAR FROM e.expense_date) = ${year}
        AND e.category IN ('MAINTENANCE', 'REPAIRS', 'INSURANCE', 'SUPPLIES', 'MARKETING', 'TAXES')
    `;
    if (quarter) {
      const qStart = (parseInt(quarter) - 1) * 3 + 1;
      const qEnd = parseInt(quarter) * 3;
      deductionsQuery.append(sql` AND EXTRACT(MONTH FROM e.expense_date) BETWEEN ${qStart} AND ${qEnd}`);
    }

    const [expenseResult, revenueResult, deductionsResult] = await Promise.all([
      db.execute(expenseQuery),
      db.execute(revenueQuery),
      db.execute(deductionsQuery),
    ]);

    const expenseRows = Array.isArray(expenseResult) ? expenseResult : expenseResult.rows || [];
    const revenueRows = Array.isArray(revenueResult) ? revenueResult : revenueResult.rows || [];
    const deductionRows = Array.isArray(deductionsResult) ? deductionsResult : deductionsResult.rows || [];

    const totalRevenue = revenueRows.reduce((sum: number, r: any) => sum + (Number(r.total) || 0), 0);
    const totalExpenses = expenseRows.reduce((sum: number, r: any) => sum + (Number(r.total) || 0), 0);
    const totalDeductible = Number(deductionRows[0]?.total_deductible) || 0;

    return successResponse({
      year,
      quarter: quarter ? `Q${quarter}` : null,
      summary: { totalRevenue, totalExpenses, netIncome: totalRevenue - totalExpenses, totalDeductibleExpenses: totalDeductible },
      expensesByCategory: expenseRows,
      revenueByStatus: revenueRows,
    });
  } catch (error) { return handleApiError(error); }
}