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
    const [customerResult, invoicesResult] = await Promise.all([
      db.execute(sql`SELECT * FROM customers WHERE id = ${id}`),
      db.execute(sql`SELECT * FROM invoices WHERE customer_id = ${id} ORDER BY created_at DESC`),
    ]);

    const customerRows = Array.isArray(customerResult) ? customerResult : customerResult.rows || [];
    if (customerRows.length === 0) return notFoundResponse('Customer');

    const invoiceRows = Array.isArray(invoicesResult) ? invoicesResult : invoicesResult.rows || [];

    return successResponse({
      ...customerRows[0],
      serviceHistory: invoiceRows,
    });
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

    const existing = await db.execute(sql`SELECT id FROM customers WHERE id = ${id}`);
    const existingRows = Array.isArray(existing) ? existing : existing.rows || [];
    if (existingRows.length === 0) return notFoundResponse('Customer');

    const updates: string[] = [];
    const values: unknown[] = [];

    for (const [key, value] of Object.entries(body)) {
      if (['name', 'email', 'phone', 'address', 'notes'].includes(key)) {
        updates.push(key);
        values.push(value);
      }
    }

    if (updates.length === 0) throw new ApiError(400, 'No fields to update');

    const setClauses = updates.map((col, i) => sql`${sql.raw(col)} = ${values[i]}`);
    const result = await db.execute(sql`
      UPDATE customers SET ${sql.join(setClauses, sql`, `)}, updated_at = NOW()
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
    const result = await db.execute(sql`DELETE FROM customers WHERE id = ${id} RETURNING id`);
    const rows = Array.isArray(result) ? result : result.rows || [];
    if (rows.length === 0) return notFoundResponse('Customer');
    return successResponse({ deleted: true, id });
  } catch (error) {
    return handleApiError(error);
  }
}