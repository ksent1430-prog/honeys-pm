import { NextRequest } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { requireAuth, handleApiError, successResponse, notFoundResponse, ApiError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const result = await db.execute(sql`
      SELECT a.*, u.first_name || ' ' || u.last_name as worker_name, c.company_name
      FROM temp_assignments a
      LEFT JOIN temp_workers w ON w.id = a.worker_id
      LEFT JOIN users u ON u.id = w.user_id
      LEFT JOIN temp_clients c ON c.id = a.client_id
      WHERE a.id = ${id}
    `);
    const rows = Array.isArray(result) ? result : result.rows || [];
    if (rows.length === 0) return notFoundResponse('Assignment');
    return successResponse(rows[0]);
  } catch (error) { return handleApiError(error); }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const existing = await db.execute(sql`SELECT id FROM temp_assignments WHERE id = ${id}`);
    if ((Array.isArray(existing) ? existing : existing.rows || []).length === 0) return notFoundResponse('Assignment');

    const fieldMap: Record<string, string> = { startDate: 'start_date', endDate: 'end_date', hourlyRate: 'hourly_rate', status: 'status', notes: 'notes' };
    const updates: string[] = []; const values: unknown[] = [];
    for (const [field, col] of Object.entries(fieldMap)) { if (body[field] !== undefined) { updates.push(col); values.push(body[field]); if (col === 'hourly_rate') values[values.length - 1] = String(body[field]); } }
    if (updates.length === 0) throw new ApiError(400, 'No fields to update');
    const setClauses = updates.map((col, i) => sql`${sql.raw(col)} = ${values[i]}`);
    const result = await db.execute(sql`UPDATE temp_assignments SET ${sql.join(setClauses, sql`, `)}, updated_at = NOW() WHERE id = ${id} RETURNING *`);
    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows[0]);
  } catch (error) { return handleApiError(error); }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const result = await db.execute(sql`DELETE FROM temp_assignments WHERE id = ${id} RETURNING id`);
    if ((Array.isArray(result) ? result : result.rows || []).length === 0) return notFoundResponse('Assignment');
    return successResponse({ deleted: true, id });
  } catch (error) { return handleApiError(error); }
}