import { NextRequest } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { requireAuth, handleApiError, successResponse, notFoundResponse, ApiError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const existing = await db.execute(sql`SELECT id FROM timesheets WHERE id = ${id}`);
    const existingRows = Array.isArray(existing) ? existing : existing.rows || [];
    if (existingRows.length === 0) return notFoundResponse('Timesheet');

    const updates: string[] = [];
    const values: unknown[] = [];
    if (body.hours !== undefined) { updates.push('hours'); values.push(String(body.hours)); }
    if (body.status !== undefined) { updates.push('status'); values.push(body.status); }
    if (body.notes !== undefined) { updates.push('notes'); values.push(body.notes); }
    if (updates.length === 0) throw new ApiError(400, 'No fields to update');
    const setClauses = updates.map((col, i) => sql`${sql.raw(col)} = ${values[i]}`);
    const result = await db.execute(sql`UPDATE timesheets SET ${sql.join(setClauses, sql`, `)}, updated_at = NOW() WHERE id = ${id} RETURNING *`);
    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows[0]);
  } catch (error) { return handleApiError(error); }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const result = await db.execute(sql`DELETE FROM timesheets WHERE id = ${id} RETURNING id`);
    const rows = Array.isArray(result) ? result : result.rows || [];
    if (rows.length === 0) return notFoundResponse('Timesheet');
    return successResponse({ deleted: true, id });
  } catch (error) { return handleApiError(error); }
}