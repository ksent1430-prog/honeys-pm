import { NextRequest } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { requireAuth, handleApiError, successResponse, notFoundResponse, ApiError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const [empResult, timesheetsResult] = await Promise.all([
      db.execute(sql`SELECT e.*, u.email, u.first_name, u.last_name FROM employee_profiles e LEFT JOIN users u ON u.id = e.user_id WHERE e.id = ${id}`),
      db.execute(sql`SELECT * FROM timesheets WHERE employee_id = ${id} ORDER BY week_start DESC LIMIT 26`),
    ]);
    const empRows = Array.isArray(empResult) ? empResult : empResult.rows || [];
    if (empRows.length === 0) return notFoundResponse('Employee');
    return successResponse({ ...empRows[0], timesheets: Array.isArray(timesheetsResult) ? timesheetsResult : timesheetsResult.rows || [] });
  } catch (error) { return handleApiError(error); }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const existing = await db.execute(sql`SELECT id FROM employee_profiles WHERE id = ${id}`);
    const existingRows = Array.isArray(existing) ? existing : existing.rows || [];
    if (existingRows.length === 0) return notFoundResponse('Employee');

    const fieldMap: Record<string, string> = { department: 'department', position: 'position', salary: 'salary', hireDate: 'hire_date', status: 'status', emergencyContact: 'emergency_contact', notes: 'notes' };
    const updates: string[] = [];
    const values: unknown[] = [];
    for (const [field, col] of Object.entries(fieldMap)) {
      if (body[field] !== undefined) { updates.push(col); values.push(body[field]); if (col === 'salary') values[values.length - 1] = String(body[field]); }
    }
    if (updates.length === 0) throw new ApiError(400, 'No fields to update');
    const setClauses = updates.map((col, i) => sql`${sql.raw(col)} = ${values[i]}`);
    const result = await db.execute(sql`UPDATE employee_profiles SET ${sql.join(setClauses, sql`, `)}, updated_at = NOW() WHERE id = ${id} RETURNING *`);
    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows[0]);
  } catch (error) { return handleApiError(error); }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const result = await db.execute(sql`DELETE FROM employee_profiles WHERE id = ${id} RETURNING id`);
    const rows = Array.isArray(result) ? result : result.rows || [];
    if (rows.length === 0) return notFoundResponse('Employee');
    return successResponse({ deleted: true, id });
  } catch (error) { return handleApiError(error); }
}