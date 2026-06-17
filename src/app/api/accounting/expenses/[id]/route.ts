import { NextRequest } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { requireAuth, handleApiError, successResponse, notFoundResponse, ApiError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const result = await db.execute(sql`SELECT e.*, p.address as property_address FROM expenses e LEFT JOIN properties p ON p.id = e.property_id WHERE e.id = ${id}`);
    const rows = Array.isArray(result) ? result : result.rows || [];
    if (rows.length === 0) return notFoundResponse('Expense');
    return successResponse(rows[0]);
  } catch (error) { return handleApiError(error); }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const existing = await db.execute(sql`SELECT id FROM expenses WHERE id = ${id}`);
    const existingRows = Array.isArray(existing) ? existing : existing.rows || [];
    if (existingRows.length === 0) return notFoundResponse('Expense');

    const fieldMap: Record<string, string> = { propertyId: 'property_id', category: 'category', amount: 'amount', description: 'description', expenseDate: 'expense_date', vendor: 'vendor', receiptUrl: 'receipt_url', notes: 'notes' };
    const updates: string[] = [];
    const values: unknown[] = [];
    for (const [field, col] of Object.entries(fieldMap)) {
      if (body[field] !== undefined) {
        updates.push(col);
        values.push(body[field]);
        if (col === 'amount') values[values.length - 1] = String(body[field]);
      }
    }
    if (updates.length === 0) throw new ApiError(400, 'No fields to update');
    const setClauses = updates.map((col, i) => sql`${sql.raw(col)} = ${values[i]}`);
    const result = await db.execute(sql`UPDATE expenses SET ${sql.join(setClauses, sql`, `)}, updated_at = NOW() WHERE id = ${id} RETURNING *`);
    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows[0]);
  } catch (error) { return handleApiError(error); }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const result = await db.execute(sql`DELETE FROM expenses WHERE id = ${id} RETURNING id`);
    const rows = Array.isArray(result) ? result : result.rows || [];
    if (rows.length === 0) return notFoundResponse('Expense');
    return successResponse({ deleted: true, id });
  } catch (error) { return handleApiError(error); }
}