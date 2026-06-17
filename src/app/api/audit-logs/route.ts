import { NextRequest } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { requireAuth, handleApiError, successResponse } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await requireAuth();

    // Check user role - only admins can view audit logs
    const userResult = await db.execute(sql`SELECT role FROM users WHERE id = ${userId}`);
    const userRows = Array.isArray(userResult) ? userResult : userResult.rows || [];
    const role = userRows[0]?.role;

    if (role !== 'SUPER_ADMIN' && role !== 'EMPLOYEE') {
      return successResponse([]);
    }

    const { searchParams } = new URL(request.url);
    const entity = searchParams.get('entity');
    const action = searchParams.get('action');
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    let query = sql`
      SELECT a.*, u.name as user_name, u.email as user_email
      FROM audit_logs a
      LEFT JOIN users u ON u.id = a.user_id
      WHERE 1=1
    `;

    if (entity) query = sql`${query} AND a.entity = ${entity}`;
    if (action) query = sql`${query} AND a.action = ${action}`;

    query = sql`${query} ORDER BY a.timestamp DESC LIMIT ${limit}`;

    const result = await db.execute(query);
    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows);
  } catch (error) {
    return handleApiError(error);
  }
}