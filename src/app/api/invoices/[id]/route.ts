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

    const [invoiceResult, paymentsResult] = await Promise.all([
      db.execute(sql`
        SELECT i.*, c.name as customer_name, c.email as customer_email, p.address as property_address
        FROM invoices i
        LEFT JOIN customers c ON c.id = i.customer_id
        LEFT JOIN properties p ON p.id = i.property_id
        WHERE i.id = ${id}
      `),
      db.execute(sql`SELECT * FROM payments WHERE invoice_id = ${id} ORDER BY date DESC`),
    ]);

    const invoiceRows = Array.isArray(invoiceResult) ? invoiceResult : invoiceResult.rows || [];
    if (invoiceRows.length === 0) return notFoundResponse('Invoice');

    const paymentRows = Array.isArray(paymentsResult) ? paymentsResult : paymentsResult.rows || [];
    return successResponse({ ...invoiceRows[0], payments: paymentRows });
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

    const existing = await db.execute(sql`SELECT * FROM invoices WHERE id = ${id}`);
    const existingRows = Array.isArray(existing) ? existing : existing.rows || [];
    if (existingRows.length === 0) return notFoundResponse('Invoice');

    const updates: string[] = [];
    const values: unknown[] = [];

    if (body.status !== undefined) {
      updates.push('status');
      values.push(body.status);
      if (body.status === 'PAID') {
        updates.push('paid_at');
        values.push(new Date());
      }
    }
    if (body.amount !== undefined) {
      updates.push('amount');
      values.push(String(body.amount));
    }
    if (body.dueDate !== undefined) {
      updates.push('due_date');
      values.push(body.dueDate);
    }
    if (body.notes !== undefined) {
      updates.push('notes');
      values.push(body.notes);
    }
    if (body.lineItems !== undefined) {
      updates.push('line_items');
      values.push(JSON.stringify(body.lineItems));
    }

    if (updates.length === 0) throw new ApiError(400, 'No fields to update');

    const setClauses = updates.map((col, i) => sql`${sql.raw(col)} = ${values[i]}`);
    const result = await db.execute(sql`
      UPDATE invoices SET ${sql.join(setClauses, sql`, `)}
      WHERE id = ${id} RETURNING *
    `);

    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows[0]);
  } catch (error) {
    return handleApiError(error);
  }
}