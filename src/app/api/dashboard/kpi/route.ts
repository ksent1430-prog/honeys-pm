import { NextResponse } from 'next/server';
import { db } from '@/db';
import { leads, workOrders, appointments, properties, tenants, invoices, inspections } from '@/db/schema';
import { sql, eq, and, gte, lte, not, inArray } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const todayStr = now.toISOString().split('T')[0];
    const sevenDaysStr = sevenDaysLater.toISOString().split('T')[0];

    // Run all queries in parallel using raw SQL via db.execute to avoid type issues
    const [
      newLeadsResult,
      openWorkOrdersResult,
      upcomingAppointmentsResult,
      activePropertiesResult,
      totalPropertiesResult,
      totalTenantsResult,
      monthlyRevenueResult,
      inProgressOrdersResult,
      completedOrdersResult,
      totalInvoicesResult,
      totalInvoicesPaidResult,
      scheduledInspectionsResult,
    ] = await Promise.all([
      db.execute(sql`SELECT count(*)::int as count FROM leads WHERE status = 'NEW' AND created_at >= ${firstOfMonth}`),
      db.execute(sql`SELECT count(*)::int as count FROM work_orders WHERE status NOT IN ('COMPLETED', 'CANCELLED')`),
      db.execute(sql`SELECT count(*)::int as count FROM appointments WHERE status = 'SCHEDULED' AND date >= ${todayStr} AND date <= ${sevenDaysStr}`),
      db.execute(sql`SELECT count(*)::int as count FROM properties WHERE occupancy_status = 'OCCUPIED'`),
      db.execute(sql`SELECT count(*)::int as count FROM properties`),
      db.execute(sql`SELECT count(*)::int as count FROM tenants WHERE status = 'ACTIVE'`),
      db.execute(sql`SELECT coalesce(sum(amount), 0) as total FROM invoices WHERE status = 'PAID' AND created_at >= ${firstOfMonth}`),
      db.execute(sql`SELECT count(*)::int as count FROM work_orders WHERE status = 'IN_PROGRESS'`),
      db.execute(sql`SELECT count(*)::int as count FROM work_orders WHERE status = 'COMPLETED' AND completed_at >= ${firstOfMonth}`),
      db.execute(sql`SELECT count(*)::int as count FROM invoices`),
      db.execute(sql`SELECT count(*)::int as count FROM invoices WHERE status = 'PAID'`),
      db.execute(sql`SELECT count(*)::int as count FROM inspections WHERE status = 'SCHEDULED'`),
    ]);

    // Helper to extract count from result rows
    const getCount = (result: any): number => {
      if (Array.isArray(result) && result.length > 0) {
        const row = result[0];
        return typeof row.count === 'number' ? row.count : Number(row.count) || 0;
      }
      if (result && result.rows && result.rows.length > 0) {
        return Number(result.rows[0].count) || 0;
      }
      return 0;
    };

    const getTotal = (result: any): number => {
      if (Array.isArray(result) && result.length > 0) {
        const row = result[0];
        return typeof row.total === 'number' ? row.total : Number(row.total) || 0;
      }
      if (result && result.rows && result.rows.length > 0) {
        return Number(result.rows[0].total) || 0;
      }
      return 0;
    };

    const newLeads = getCount(newLeadsResult);
    const openServiceRequests = getCount(openWorkOrdersResult);
    const upcomingAppointments = getCount(upcomingAppointmentsResult);
    const activeProperties = getCount(activePropertiesResult);
    const totalProperties = getCount(totalPropertiesResult);
    const totalTenants = getCount(totalTenantsResult);
    const monthlyRevenue = getTotal(monthlyRevenueResult);
    const outstandingTasks = getCount(inProgressOrdersResult);
    const completedOrders = getCount(completedOrdersResult);
    const totalInvoices = getCount(totalInvoicesResult);
    const paidInvoices = getCount(totalInvoicesPaidResult);
    const scheduledInspections = getCount(scheduledInspectionsResult);
    const occupancyRate = totalProperties > 0
      ? Math.round((activeProperties / totalProperties) * 100)
      : 0;
    const conversionRate = totalInvoices > 0
      ? Math.round((paidInvoices / totalInvoices) * 100)
      : 0;

    return NextResponse.json({
      newLeads,
      openServiceRequests,
      upcomingAppointments,
      activeProperties,
      totalProperties,
      totalTenants,
      monthlyRevenue,
      outstandingTasks,
      completedOrders,
      totalInvoices,
      paidInvoices,
      overdueInvoices: 0,
      scheduledInspections,
      occupancyRate,
      conversionRate,
    });
  } catch (error) {
    console.error('Dashboard KPI error:', error);
    return NextResponse.json({
      newLeads: 0,
      openServiceRequests: 0,
      upcomingAppointments: 0,
      activeProperties: 0,
      totalProperties: 0,
      totalTenants: 0,
      monthlyRevenue: 0,
      outstandingTasks: 0,
      completedOrders: 0,
      totalInvoices: 0,
      paidInvoices: 0,
      overdueInvoices: 0,
      scheduledInspections: 0,
      occupancyRate: 0,
      conversionRate: 0,
    });
  }
}