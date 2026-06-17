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
      SELECT i.*, u.first_name || ' ' || u.last_name as worker_name, c.company_name
      FROM temp_invoices i
      LEFT JOIN temp_workers w ON w.id = i.worker_id
      LEFT JOIN users u ON u.id = w.user_id
      LEFT JOIN temp_clients c ON c.id = i.client_id
      WHERE i.id = ${id}
    `);
    const rows = Array.isArray(result) ? result : result.rows || [];
    if (rows.length === 0) return notFoundResponse('Invoice');
    return successResponse(rows[0]);
  } catch (error) { return handleApiError(error); }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const existing = await db.execute(sql`SELECT id FROM temp_invoices WHERE id = ${id}`);
    if ((Array.isArray(existing) ? existing : existing.rows || []).length === 0) return notFoundResponse('Invoice');

    const updates: string[] = []; const values: unknown[] = [];
    if (body.status !== undefined) { updates.push('status'); values.push(body.status); }
    if (body.hoursWorked !== undefined) { updates.push('hours_worked'); values.push(String(body.hoursWorked)); }
    if (body.rate !== undefined) { updates.push('rate'); values.push(String(body.rate)); }
    if (body.hoursWorked !== undefined && body.rate !== undefined) {
      updates.push('total'); values.push(String(body.hoursWorked * body.rate));
    }
    if (updates.length === 0) throw new ApiError(400, 'No fields to update');
    const setClauses = updates.map((col, i) => sql`${sql.raw(col)} = ${values[i]}`);
    const result = await db.execute(sql`UPDATE temp_invoices SET ${sql.join(setClauses, sql`, `)}, updated_at = NOW() WHERE id = ${id} RETURNING *`);
    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows[0]);
  } catch (error) { return handleApiError(error); }
}