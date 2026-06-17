import { NextRequest } from 'next/server';
import { requireAuth, handleApiError, successResponse } from '@/lib/api-helpers';
import { db } from '@/db';
import { sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAuth();

    // Gather business health metrics
    const [
      leadResult, woResult, propResult, invResult, revResult, expResult,
      tenantResult, apptResult, msgResult
    ] = await Promise.all([
      db.execute(sql`SELECT COUNT(*)::int as total, COUNT(*) FILTER (WHERE status = 'NEW')::int as new, COUNT(*) FILTER (WHERE status = 'CONVERTED')::int as converted FROM leads`),
      db.execute(sql`SELECT COUNT(*)::int as total, COUNT(*) FILTER (WHERE status NOT IN ('COMPLETED','CANCELLED'))::int as open, COUNT(*) FILTER (WHERE status = 'COMPLETED')::int as completed FROM work_orders`),
      db.execute(sql`SELECT COUNT(*)::int as total, COUNT(*) FILTER (WHERE status = 'RENTED')::int as occupied FROM properties`),
      db.execute(sql`SELECT COUNT(*)::int as total, COUNT(*) FILTER (WHERE status = 'PAID')::int as paid, COUNT(*) FILTER (WHERE status IN ('SENT','OVERDUE'))::int as outstanding FROM invoices`),
      db.execute(sql`SELECT COALESCE(SUM(amount::numeric), 0) as total FROM invoices WHERE status = 'PAID' AND created_at >= date_trunc('month', CURRENT_DATE)`),
      db.execute(sql`SELECT COALESCE(SUM(amount::numeric), 0) as total FROM expenses WHERE expense_date >= date_trunc('month', CURRENT_DATE)`),
      db.execute(sql`SELECT COUNT(*)::int as total, COUNT(*) FILTER (WHERE status = 'ACTIVE')::int as active FROM tenants`),
      db.execute(sql`SELECT COUNT(*)::int as total FROM appointments WHERE start_time >= NOW() AND status = 'SCHEDULED'`),
      db.execute(sql`SELECT COUNT(*)::int as total, COUNT(*) FILTER (WHERE is_read = false)::int as unread FROM messages`),
    ]);

    const get = (r: any) => (Array.isArray(r) ? r : r.rows || [])[0] || {};

    const l = get(leadResult);
    const w = get(woResult);
    const p = get(propResult);
    const i = get(invResult);
    const rev = get(revResult);
    const exp = get(expResult);
    const t = get(tenantResult);
    const a = get(apptResult);
    const m = get(msgResult);

    const totalProperties = p.total || 0;
    const occupiedProperties = p.occupied || 0;
    const conversionRate = l.total > 0 ? Math.round((l.converted / l.total) * 100) : 0;
    const occupancyRate = totalProperties > 0 ? Math.round((occupiedProperties / totalProperties) * 100) : 0;
    const completionRate = w.total > 0 ? Math.round((w.completed / w.total) * 100) : 0;
    const collectionRate = i.total > 0 ? Math.round((i.paid / i.total) * 100) : 0;
    const monthlyRevenue = Number(rev.total) || 0;
    const monthlyExpenses = Number(exp.total) || 0;

    const recommendations: string[] = [];
    const issues: string[] = [];

    // Generate actionable recommendations
    if (l.new > 5 && conversionRate < 30) recommendations.push('High lead volume but low conversion rate. Consider a faster follow-up process or lead qualification automation.');
    if (w.open > 10) recommendations.push(`${w.open} open work orders. Consider prioritizing urgent maintenance and assigning more staff.`);
    if (occupancyRate < 70) recommendations.push(`Occupancy rate at ${occupancyRate}%. Consider marketing vacant properties or adjusting rental rates.`);
    if (monthlyExpenses > monthlyRevenue * 0.8) recommendations.push(`Expenses are ${monthlyExpenses > 0 ? Math.round((monthlyExpenses/monthlyRevenue)*100) : 0}% of revenue. Review cost structure and identify savings opportunities.`);
    if (i.outstanding > 5) recommendations.push(`${i.outstanding} outstanding invoices. Consider automated payment reminders or late fee enforcement.`);
    if (m.unread > 20) recommendations.push(`${m.unread} unread messages. Check communication inbox for pending inquiries.`);

    if (t.total === 0) issues.push('No tenant data recorded. Add tenants to track occupancy and lease information.');
    if (totalProperties === 0) issues.push('No properties in the system. Add properties to begin management.');
    if (completionRate < 50 && w.total > 0) issues.push(`Work order completion rate is ${completionRate}%. Investigate bottlenecks in service delivery.`);

    return successResponse({
      overallHealth: issues.length === 0 && recommendations.length <= 3 ? 'GOOD' : recommendations.length > 5 ? 'NEEDS_ATTENTION' : 'FAIR',
      score: Math.max(0, Math.min(100, Math.round(
        (occupancyRate * 0.2) +
        (conversionRate * 0.15) +
        (completionRate * 0.15) +
        (collectionRate * 0.15) +
        (monthlyRevenue > 0 ? Math.min(100, (monthlyRevenue - monthlyExpenses) / monthlyRevenue * 50) : 0) +
        (totalProperties > 0 ? 10 : 0)
      ))),
      metrics: {
        leadConversion: conversionRate,
        occupancyRate,
        workOrderCompletion: completionRate,
        collectionRate,
        monthlyRevenue,
        monthlyExpenses,
        netProfit: monthlyRevenue - monthlyExpenses,
        totalProperties,
        occupiedProperties,
        openWorkOrders: w.open || 0,
        newLeads: l.new || 0,
        activeTenants: t.active || 0,
        upcomingAppointments: a.total || 0,
        unreadMessages: m.unread || 0,
      },
      recommendations: recommendations.slice(0, 5),
      issues,
    });
  } catch (error) { return handleApiError(error); }
}