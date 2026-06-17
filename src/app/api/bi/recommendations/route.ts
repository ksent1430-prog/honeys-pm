import { NextRequest } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { requireAuth, handleApiError, successResponse } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAuth();

    const [
      leadResult, woResult, propResult, invResult,
      revResult, expResult, tenantResult
    ] = await Promise.all([
      db.execute(sql`SELECT COUNT(*)::int as total, COUNT(*) FILTER (WHERE status = 'NEW')::int as new, COUNT(*) FILTER (WHERE status = 'CONVERTED')::int as converted, COUNT(*) FILTER (WHERE created_at >= date_trunc('month', CURRENT_DATE))::int as this_month FROM leads`),
      db.execute(sql`SELECT COUNT(*)::int as open FROM work_orders WHERE status NOT IN ('COMPLETED','CANCELLED')`),
      db.execute(sql`SELECT COUNT(*)::int as total, COUNT(*) FILTER (WHERE status = 'RENTED')::int as occupied FROM properties`),
      db.execute(sql`SELECT COUNT(*)::int as overdue FROM invoices WHERE status = 'OVERDUE'`),
      db.execute(sql`SELECT COALESCE(SUM(amount::numeric), 0) as total FROM invoices WHERE status = 'PAID' AND created_at >= date_trunc('month', CURRENT_DATE)`),
      db.execute(sql`SELECT COALESCE(SUM(amount::numeric), 0) as total FROM expenses WHERE expense_date >= date_trunc('month', CURRENT_DATE)`),
      db.execute(sql`SELECT COUNT(*)::int as total FROM tenants WHERE status = 'ACTIVE'`),
    ]);

    const get = (r: any) => (Array.isArray(r) ? r : r.rows || [])[0] || {};
    const l = get(leadResult);
    const w = get(woResult);
    const p = get(propResult);
    const i = get(invResult);
    const rev = get(revResult);
    const exp = get(expResult);
    const t = get(tenantResult);

    const occupancyRate = p.total > 0 ? Math.round((p.occupied / p.total) * 100) : 0;
    const conversionRate = l.total > 0 ? Math.round((l.converted / l.total) * 100) : 0;
    const revenue = Number(rev.total) || 0;
    const expenses = Number(exp.total) || 0;

    const recommendations = [];

    // Lead-related recommendations
    if (l.this_month > 0 && conversionRate < 25) {
      recommendations.push({
        category: 'SALES',
        priority: 'HIGH',
        title: 'Improve Lead Conversion',
        description: `Only ${conversionRate}% of leads convert. Consider implementing automated follow-ups within 24 hours of lead capture.`,
        impact: `Could add ~${Math.round(l.this_month * 0.15)} more customers/month at current volume.`,
      });
    }

    // Work order recommendations
    if (w.open > 5) {
      recommendations.push({
        category: 'OPERATIONS',
        priority: w.open > 15 ? 'HIGH' : 'MEDIUM',
        title: 'Reduce Work Order Backlog',
        description: `${w.open} open work orders need attention.`,
        impact: 'Faster resolution improves tenant satisfaction and property condition.',
      });
    }

    // Occupancy recommendations
    if (occupancyRate < 80) {
      recommendations.push({
        category: 'REVENUE',
        priority: occupancyRate < 60 ? 'HIGH' : 'MEDIUM',
        title: 'Increase Property Occupancy',
        description: `Current occupancy at ${occupancyRate}%. ${p.total - p.occupied} properties vacant.`,
        impact: `Each occupied property generates average monthly revenue.`,
      });
    }

    // Financial recommendations
    if (expenses > 0 && revenue > 0 && expenses / revenue > 0.7) {
      recommendations.push({
        category: 'FINANCIAL',
        priority: 'HIGH',
        title: 'Review Expense Ratio',
        description: `Expenses are ${Math.round((expenses / revenue) * 100)}% of revenue. Target is below 70%.`,
        impact: 'Reducing expenses by 10% could increase net profit significantly.',
      });
    }

    // Overdue invoice recommendations
    if (i.overdue > 3) {
      recommendations.push({
        category: 'FINANCIAL',
        priority: 'MEDIUM',
        title: 'Collect Overdue Invoices',
        description: `${i.overdue} invoices are overdue.`,
        impact: 'Timely collections improve cash flow and reduce write-offs.',
      });
    }

    // Tenant-related
    if (t.total === 0 && p.occupied > 0) {
      recommendations.push({
        category: 'OPERATIONS',
        priority: 'HIGH',
        title: 'Register Tenants',
        description: `${p.occupied} properties marked as occupied but no tenants registered.`,
        impact: 'Proper tenant records enable lease tracking and communication.',
      });
    }

    return successResponse({
      generated: new Date().toISOString(),
      recommendations,
      summary: {
        total: recommendations.length,
        highPriority: recommendations.filter(r => r.priority === 'HIGH').length,
        mediumPriority: recommendations.filter(r => r.priority === 'MEDIUM').length,
      },
    });
  } catch (error) { return handleApiError(error); }
}