import { NextRequest } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { requireAuth, handleApiError, successResponse, ApiError, validateInput } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const status = searchParams.get('status');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    let query = sql`SELECT t.*, u.first_name, u.last_name FROM timesheets t LEFT JOIN employee_profiles e ON e.id = t.employee_id LEFT JOIN users u ON u.id = e.user_id WHERE 1=1`;
    if (employeeId) query = sql`${query} AND t.employee_id = ${employeeId}`;
    if (status) query = sql`${query} AND t.status = ${status}`;
    if (dateFrom) query = sql`${query} AND t.week_start >= ${dateFrom}`;
    if (dateTo) query = sql`${query} AND t.week_end <= ${dateTo}`;
    query = sql`${query} ORDER BY t.week_start DESC`;

    const result = await db.execute(query);
    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows);
  } catch (error) { return handleApiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const errors = validateInput(body, {
      employeeId: { required: true, type: 'string' },
      weekStart: { required: true, type: 'string' },
      weekEnd: { required: true, type: 'string' },
      hours: { required: true, type: 'number' },
    });
    if (errors.length > 0) throw new ApiError(400, 'Validation failed', errors);

    const result = await db.execute(sql`
      INSERT INTO timesheets (employee_id, week_start, week_end, hours, notes)
      VALUES (${body.employeeId}, ${body.weekStart}, ${body.weekEnd}, ${String(body.hours)}, ${body.notes || null})
      RETURNING *
    `);
    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows[0], 201);
  } catch (error) { return handleApiError(error); }
}