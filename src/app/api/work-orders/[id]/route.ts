import { NextRequest } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { requireAuth, handleApiError, successResponse, notFoundResponse, ApiError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const result = await db.execute(sql`
      SELECT w.*, p.address as property_address
      FROM work_orders w
      LEFT JOIN properties p ON p.id = w.property_id
      WHERE w.id = ${id}
    `);
    const rows = Array.isArray(result) ? result : result.rows || [];
    if (rows.length === 0) return notFoundResponse('Work order');
    return successResponse(rows[0]);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();

    const existing = await db.execute(sql`SELECT * FROM work_orders WHERE id = ${id}`);
    const existingRows = Array.isArray(existing) ? existing : existing.rows || [];
    if (existingRows.length === 0) return notFoundResponse('Work order');

    const workOrder = existingRows[0];
    const fieldMap: Record<string, string> = {
      status: 'status',
      priority: 'priority',
      description: 'description',
      assignedTo: 'assigned_to',
      scheduledDate: 'scheduled_date',
      notes: 'notes',
      type: 'type',
      tenantId: 'tenant_id',
    };

    const updates: string[] = [];
    const values: unknown[] = [];

    for (const [field, col] of Object.entries(fieldMap)) {
      if (body[field] !== undefined) {
        updates.push(col);
        values.push(body[field]);
      }
    }

    // Auto-set completedAt when status changes to COMPLETED
    if (body.status === 'COMPLETED' && workOrder.status !== 'COMPLETED') {
      updates.push('completed_at');
      values.push(new Date());
    }

    if (updates.length === 0) throw new ApiError(400, 'No fields to update');

    const setClauses = updates.map((col, i) => sql`${sql.raw(col)} = ${values[i]}`);
    const result = await db.execute(sql`
      UPDATE work_orders SET ${sql.join(setClauses, sql`, `)}, updated_at = NOW()
      WHERE id = ${id} RETURNING *
    `);

    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows[0]);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const result = await db.execute(sql`DELETE FROM work_orders WHERE id = ${id} RETURNING id`);
    const rows = Array.isArray(result) ? result : result.rows || [];
    if (rows.length === 0) return notFoundResponse('Work order');
    return successResponse({ deleted: true, id });
  } catch (error) {
    return handleApiError(error);
  }
}