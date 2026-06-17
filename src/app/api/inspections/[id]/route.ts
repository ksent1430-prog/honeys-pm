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
      SELECT i.*, p.address as property_address
      FROM inspections i
      LEFT JOIN properties p ON p.id = i.property_id
      WHERE i.id = ${id}
    `);
    const rows = Array.isArray(result) ? result : result.rows || [];
    if (rows.length === 0) return notFoundResponse('Inspection');
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

    const existing = await db.execute(sql`SELECT id FROM inspections WHERE id = ${id}`);
    const existingRows = Array.isArray(existing) ? existing : existing.rows || [];
    if (existingRows.length === 0) return notFoundResponse('Inspection');

    const updates: string[] = [];
    const values: unknown[] = [];

    if (body.status !== undefined) {
      updates.push('status');
      values.push(body.status);
      if (body.status === 'COMPLETED') {
        updates.push('completed_at');
        values.push(new Date());
      }
    }
    if (body.notes !== undefined) {
      updates.push('notes');
      values.push(body.notes);
    }
    if (body.reportUrl !== undefined) {
      updates.push('report_url');
      values.push(body.reportUrl);
    }
    if (body.photos !== undefined) {
      updates.push('photos');
      values.push(JSON.stringify(body.photos));
    }
    if (body.type !== undefined) {
      updates.push('type');
      values.push(body.type);
    }

    if (updates.length === 0) throw new ApiError(400, 'No fields to update');

    const setClauses = updates.map((col, i) => sql`${sql.raw(col)} = ${values[i]}`);
    const result = await db.execute(sql`
      UPDATE inspections SET ${sql.join(setClauses, sql`, `)}
      WHERE id = ${id} RETURNING *
    `);

    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows[0]);
  } catch (error) {
    return handleApiError(error);
  }
}