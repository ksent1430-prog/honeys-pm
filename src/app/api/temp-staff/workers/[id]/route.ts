import { NextRequest } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { requireAuth, handleApiError, successResponse, notFoundResponse, ApiError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const [workerResult, assignmentsResult] = await Promise.all([
      db.execute(sql`SELECT w.*, u.email, u.first_name, u.last_name FROM temp_workers w LEFT JOIN users u ON u.id = w.user_id WHERE w.id = ${id}`),
      db.execute(sql`SELECT * FROM temp_assignments WHERE worker_id = ${id} ORDER BY start_date DESC`),
    ]);
    const workerRows = Array.isArray(workerResult) ? workerResult : workerResult.rows || [];
    if (workerRows.length === 0) return notFoundResponse('Worker');
    return successResponse({ ...workerRows[0], assignments: Array.isArray(assignmentsResult) ? assignmentsResult : assignmentsResult.rows || [] });
  } catch (error) { return handleApiError(error); }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const existing = await db.execute(sql`SELECT id FROM temp_workers WHERE id = ${id}`);
    if ((Array.isArray(existing) ? existing : existing.rows || []).length === 0) return notFoundResponse('Worker');

    const fieldMap: Record<string, string> = { skills: 'skills', availabilityStatus: 'availability_status', hourlyRate: 'hourly_rate', backgroundCheck: 'background_check', notes: 'notes' };
    const updates: string[] = []; const values: unknown[] = [];
    for (const [field, col] of Object.entries(fieldMap)) { if (body[field] !== undefined) { updates.push(col); values.push(body[field]); if (col === 'hourly_rate') values[values.length - 1] = String(body[field]); } }
    if (updates.length === 0) throw new ApiError(400, 'No fields to update');
    const setClauses = updates.map((col, i) => sql`${sql.raw(col)} = ${values[i]}`);
    const result = await db.execute(sql`UPDATE temp_workers SET ${sql.join(setClauses, sql`, `)}, updated_at = NOW() WHERE id = ${id} RETURNING *`);
    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows[0]);
  } catch (error) { return handleApiError(error); }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const result = await db.execute(sql`DELETE FROM temp_workers WHERE id = ${id} RETURNING id`);
    if ((Array.isArray(result) ? result : result.rows || []).length === 0) return notFoundResponse('Worker');
    return successResponse({ deleted: true, id });
  } catch (error) { return handleApiError(error); }
}