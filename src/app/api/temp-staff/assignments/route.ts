import { NextRequest } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { requireAuth, handleApiError, successResponse, ApiError, validateInput } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const workerId = searchParams.get('workerId');
    const clientId = searchParams.get('clientId');
    const status = searchParams.get('status');

    let query = sql`
      SELECT a.*, u.first_name || ' ' || u.last_name as worker_name, c.company_name
      FROM temp_assignments a
      LEFT JOIN temp_workers w ON w.id = a.worker_id
      LEFT JOIN users u ON u.id = w.user_id
      LEFT JOIN temp_clients c ON c.id = a.client_id
      WHERE 1=1
    `;
    if (workerId) query = sql`${query} AND a.worker_id = ${workerId}`;
    if (clientId) query = sql`${query} AND a.client_id = ${clientId}`;
    if (status) query = sql`${query} AND a.status = ${status}`;
    query = sql`${query} ORDER BY a.start_date DESC`;

    const result = await db.execute(query);
    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows);
  } catch (error) { return handleApiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const errors = validateInput(body, { workerId: { required: true, type: 'string' }, clientId: { required: true, type: 'string' }, startDate: { required: true, type: 'string' } });
    if (errors.length > 0) throw new ApiError(400, 'Validation failed', errors);

    const result = await db.execute(sql`
      INSERT INTO temp_assignments (worker_id, client_id, start_date, end_date, hourly_rate, notes)
      VALUES (${body.workerId}, ${body.clientId}, ${body.startDate}, ${body.endDate || null}, ${body.hourlyRate ? String(body.hourlyRate) : null}, ${body.notes || null})
      RETURNING *
    `);
    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows[0], 201);
  } catch (error) { return handleApiError(error); }
}