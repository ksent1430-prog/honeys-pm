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
      SELECT i.*, u.first_name || ' ' || u.last_name as worker_name, c.company_name
      FROM temp_invoices i
      LEFT JOIN temp_workers w ON w.id = i.worker_id
      LEFT JOIN users u ON u.id = w.user_id
      LEFT JOIN temp_clients c ON c.id = i.client_id
      WHERE 1=1
    `;
    if (workerId) query = sql`${query} AND i.worker_id = ${workerId}`;
    if (clientId) query = sql`${query} AND i.client_id = ${clientId}`;
    if (status) query = sql`${query} AND i.status = ${status}`;
    query = sql`${query} ORDER BY i.created_at DESC`;

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
      assignmentId: { required: true, type: 'string' },
      workerId: { required: true, type: 'string' },
      clientId: { required: true, type: 'string' },
      hoursWorked: { required: true, type: 'number' },
      rate: { required: true, type: 'number' },
    });
    if (errors.length > 0) throw new ApiError(400, 'Validation failed', errors);

    const total = body.hoursWorked * body.rate;

    const result = await db.execute(sql`
      INSERT INTO temp_invoices (assignment_id, worker_id, client_id, hours_worked, rate, total, status, due_date)
      VALUES (${body.assignmentId}, ${body.workerId}, ${body.clientId}, ${String(body.hoursWorked)}, ${String(body.rate)}, ${String(total)}, ${body.status || 'DRAFT'}, ${body.dueDate || null})
      RETURNING *
    `);
    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows[0], 201);
  } catch (error) { return handleApiError(error); }
}