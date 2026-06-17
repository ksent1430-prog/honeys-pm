import { NextRequest } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { requireAuth, handleApiError, successResponse } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'monthly'; // weekly, monthly, quarterly
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()), 10);
    const month = searchParams.get('month');

    // Get date range based on period
    let dateFrom: string;
    let dateTo: string;
    const now = new Date();

    if (period === 'weekly') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateFrom = weekAgo.toISOString().split('T')[0];
      dateTo = now.toISOString().split('T')[0];
    } else if (period === 'quarterly') {
      const qStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
      dateFrom = qStart.toISOString().split('T')[0];
      dateTo = now.toISOString().split('T')[0];
    } else {
      dateFrom = `${year}-${month ? String(parseInt(month)).padStart(2, '0') : '01'}-01`;
      dateTo = now.toISOString().split('T')[0];
    }

    const [
      leadsResult, workOrdersResult, propertiesResult,
      invoicesResult, revenueResult, expensesResult,
    ] = await Promise.all([
      db.execute(sql`
        SELECT status, COUNT(*)::int as count FROM leads
        WHERE created_at >= ${dateFrom}::date AND created_at <= ${dateTo}::date + interval '1 day'
        GROUP BY status
      `),
      db.execute(sql`
        SELECT status, COUNT(*)::int as count FROM work_orders
        GROUP BY status
      `),
      db.execute(sql`
        SELECT status, COUNT(*)::int as count FROM properties
        GROUP BY status
      `),
      db.execute(sql`
        SELECT status, COUNT(*)::int as count, SUM(amount::numeric) as total FROM invoices
        GROUP BY status
      `),
      db.execute(sql`
        SELECT COALESCE(SUM(amount::numeric), 0) as total FROM invoices
        WHERE status = 'PAID' AND created_at >= ${dateFrom}::date AND created_at <= ${dateTo}::date + interval '1 day'
      `),
      db.execute(sql`
        SELECT COALESCE(SUM(amount::numeric), 0) as total FROM expenses
        WHERE expense_date >= ${dateFrom}::date AND expense_date <= ${dateTo}::date + interval '1 day'
      `),
    ]);

    const getRows = (r: any) => Array.isArray(r) ? r : r.rows || [];
    const leadsRows = getRows(leadsResult);
    const woRows = getRows(workOrdersResult);
    const propRows = getRows(propertiesResult);
    const invRows = getRows(invoicesResult);
    const revTotal = getRows(revenueResult)[0]?.total || 0;
    const expTotal = getRows(expensesResult)[0]?.total || 0;

    const activeProperties = propRows.find((r: any) => r.status === 'RENTED')?.count || 0;
    const totalProperties = propRows.reduce((s: number, r: any) => s + (r.count || 0), 0);
    const openWorkOrders = woRows.filter((r: any) => !['COMPLETED', 'CANCELLED'].includes(r.status)).reduce((s: number, r: any) => s + (r.count || 0), 0);
    const newLeads = leadsRows.find((r: any) => r.status === 'NEW')?.count || 0;

    return successResponse({
      period,
      dateRange: { from: dateFrom, to: dateTo },
      summary: {
        newLeads,
        openWorkOrders,
        activeProperties,
        totalProperties,
        occupancyRate: totalProperties > 0 ? Math.round((activeProperties / totalProperties) * 100) : 0,
        revenue: Number(revTotal),
        expenses: Number(expTotal),
        netProfit: Number(revTotal) - Number(expTotal),
        paidInvoices: invRows.find((r: any) => r.status === 'PAID')?.count || 0,
        outstandingInvoices: invRows.filter((r: any) => ['SENT', 'OVERDUE'].includes(r.status)).reduce((s: number, r: any) => s + (r.count || 0), 0),
      },
      leadBreakdown: leadsRows,
      workOrderBreakdown: woRows,
      propertyBreakdown: propRows,
      invoiceBreakdown: invRows,
    });
  } catch (error) { return handleApiError(error); }
}