import { NextRequest } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { requireAuth, handleApiError, successResponse } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'revenue';
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()), 10);

    switch (type) {
      case 'revenue': {
        const result = await db.execute(sql`
          SELECT 
            EXTRACT(MONTH FROM created_at) as month,
            COUNT(*)::int as invoice_count,
            SUM(CASE WHEN status = 'PAID' THEN amount ELSE 0 END) as collected,
            SUM(amount) as total_billed
          FROM invoices
          WHERE EXTRACT(YEAR FROM created_at) = ${year}
          GROUP BY EXTRACT(MONTH FROM created_at)
          ORDER BY month
        `);
        const rows = Array.isArray(result) ? result : result.rows || [];
        return successResponse(rows);
      }

      case 'leads': {
        const result = await db.execute(sql`
          SELECT 
            status,
            COUNT(*)::int as count,
            source
          FROM leads
          GROUP BY status, source
          ORDER BY count DESC
        `);
        const rows = Array.isArray(result) ? result : result.rows || [];
        return successResponse(rows);
      }

      case 'work-orders': {
        const result = await db.execute(sql`
          SELECT 
            status,
            priority,
            type,
            COUNT(*)::int as count,
            AVG(CASE WHEN completed_at IS NOT NULL AND created_at IS NOT NULL 
              THEN EXTRACT(EPOCH FROM (completed_at - created_at))/3600 
              ELSE NULL END)::numeric(10,1) as avg_completion_hours
          FROM work_orders
          GROUP BY status, priority, type
          ORDER BY count DESC
        `);
        const rows = Array.isArray(result) ? result : result.rows || [];
        return successResponse(rows);
      }

      case 'properties': {
        const result = await db.execute(sql`
          SELECT 
            occupancy_status,
            type,
            COUNT(*)::int as count,
            AVG(rent_amount::numeric)::numeric(10,2) as avg_rent
          FROM properties
          GROUP BY occupancy_status, type
          ORDER BY count DESC
        `);
        const rows = Array.isArray(result) ? result : result.rows || [];
        return successResponse(rows);
      }

      default:
        return successResponse({ error: 'Invalid report type. Use: revenue, leads, work-orders, properties' });
    }
  } catch (error) {
    return handleApiError(error);
  }
}