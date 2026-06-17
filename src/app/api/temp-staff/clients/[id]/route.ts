import { NextRequest } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { requireAuth, handleApiError, successResponse, notFoundResponse, ApiError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const result = await db.execute(sql`SELECT * FROM temp_clients WHERE id = ${id}`);
    const rows = Array.isArray(result) ? result : result.rows || [];
    if (rows.length === 0) return notFoundResponse('Client');
    return successResponse(rows[0]);
  } catch (error) { return handleApiError(error); }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();
    if ((Array.isArray(await db.execute(sql`SELECT id FROM temp_clients WHERE id = ${id}`)) ? await db.execute(sql`SELECT id FROM temp_clients WHERE id = ${id}`) : (await db.execute(sql`SELECT id FROM temp_clients WHERE id = ${id}`)).rows || []).length === 0) return notFoundResponse('Client');

    const fieldMap: Record<string, string> = { companyName: 'company_name', contactName: 'contact_name', email: 'email', phone: 'phone', address: 'address', notes: 'notes' };
    const updates: string[] = []; const values: unknown[] = [];
    for (const [field, col] of Object.entries(fieldMap)) { if (body[field] !== undefined) { updates.push(col); values.push(body[field]); } }
    if (updates.length === 0) throw new ApiError(400, 'No fields to update');
    const setClauses = updates.map((col, i) => sql`${sql.raw(col)} = ${values[i]}`);
    const result = await db.execute(sql`UPDATE temp_clients SET ${sql.join(setClauses, sql`, `)}, updated_at = NOW() WHERE id = ${id} RETURNING *`);
    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows[0]);
  } catch (error) { return handleApiError(error); }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const result = await db.execute(sql`DELETE FROM temp_clients WHERE id = ${id} RETURNING id`);
    if ((Array.isArray(result) ? result : result.rows || []).length === 0) return notFoundResponse('Client');
    return successResponse({ deleted: true, id });
  } catch (error) { return handleApiError(error); }
}