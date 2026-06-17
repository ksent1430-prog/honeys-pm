import { NextRequest } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { requireAuth, handleApiError, successResponse, notFoundResponse, ApiError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const result = await db.execute(sql`SELECT * FROM contract_templates WHERE id = ${id}`);
    const rows = Array.isArray(result) ? result : result.rows || [];
    if (rows.length === 0) return notFoundResponse('Template');
    return successResponse(rows[0]);
  } catch (error) { return handleApiError(error); }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const existing = await db.execute(sql`SELECT id FROM contract_templates WHERE id = ${id}`);
    if ((Array.isArray(existing) ? existing : existing.rows || []).length === 0) return notFoundResponse('Template');

    const fieldMap: Record<string, string> = { name: 'name', type: 'type', content: 'content', variables: 'variables' };
    const updates: string[] = []; const values: unknown[] = [];
    for (const [field, col] of Object.entries(fieldMap)) { if (body[field] !== undefined) { updates.push(col); values.push(field === 'variables' ? JSON.stringify(body[field]) : body[field]); } }
    if (updates.length === 0) throw new ApiError(400, 'No fields to update');
    const setClauses = updates.map((col, i) => sql`${sql.raw(col)} = ${values[i]}`);
    const result = await db.execute(sql`UPDATE contract_templates SET ${sql.join(setClauses, sql`, `)}, updated_at = NOW() WHERE id = ${id} RETURNING *`);
    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows[0]);
  } catch (error) { return handleApiError(error); }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const result = await db.execute(sql`DELETE FROM contract_templates WHERE id = ${id} RETURNING id`);
    if ((Array.isArray(result) ? result : result.rows || []).length === 0) return notFoundResponse('Template');
    return successResponse({ deleted: true, id });
  } catch (error) { return handleApiError(error); }
}