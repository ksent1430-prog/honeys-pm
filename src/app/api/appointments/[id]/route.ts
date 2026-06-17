import { NextRequest } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { requireAuth, handleApiError, successResponse, notFoundResponse, ApiError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();

    const existing = await db.execute(sql`SELECT id FROM appointments WHERE id = ${id}`);
    const existingRows = Array.isArray(existing) ? existing : existing.rows || [];
    if (existingRows.length === 0) return notFoundResponse('Appointment');

    const fieldMap: Record<string, string> = {
      propertyId: 'property_id',
      type: 'type',
      title: 'title',
      description: 'description',
      date: 'date',
      time: 'time',
      duration: 'duration',
      status: 'status',
      assignedTo: 'assigned_to',
      notes: 'notes',
    };

    const updates: string[] = [];
    const values: unknown[] = [];

    for (const [field, col] of Object.entries(fieldMap)) {
      if (body[field] !== undefined) {
        updates.push(col);
        values.push(body[field]);
      }
    }

    if (updates.length === 0) throw new ApiError(400, 'No fields to update');

    const setClauses = updates.map((col, i) => sql`${sql.raw(col)} = ${values[i]}`);
    const result = await db.execute(sql`
      UPDATE appointments SET ${sql.join(setClauses, sql`, `)}
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
    const result = await db.execute(sql`DELETE FROM appointments WHERE id = ${id} RETURNING id`);
    const rows = Array.isArray(result) ? result : result.rows || [];
    if (rows.length === 0) return notFoundResponse('Appointment');
    return successResponse({ deleted: true, id });
  } catch (error) {
    return handleApiError(error);
  }
}