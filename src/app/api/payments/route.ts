import { NextRequest } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { requireAuth, handleApiError, successResponse, ApiError, validateInput } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const invoiceId = searchParams.get('invoiceId');

    let query = sql`SELECT * FROM payments WHERE 1=1`;
    if (invoiceId) {
      query = sql`${query} AND invoice_id = ${invoiceId}`;
    }
    query = sql`${query} ORDER BY date DESC`;

    const result = await db.execute(query);
    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();

    const errors = validateInput(body, {
      invoiceId: { required: true, type: 'string' },
      amount: { required: true, type: 'number' },
      method: { type: 'string' },
      transactionId: { type: 'string' },
    });

    if (errors.length > 0) {
      throw new ApiError(400, 'Validation failed', errors);
    }

    // Record payment
    const result = await db.execute(sql`
      INSERT INTO payments (invoice_id, amount, method, transaction_id, status, notes)
      VALUES (
        ${body.invoiceId},
        ${String(body.amount)},
        ${body.method || null},
        ${body.transactionId || null},
        'COMPLETED',
        ${body.notes || null}
      )
      RETURNING *
    `);

    // Auto-update invoice status to PAID
    await db.execute(sql`
      UPDATE invoices SET status = 'PAID', paid_at = NOW()
      WHERE id = ${body.invoiceId}
    `);

    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows[0], 201);
  } catch (error) {
    return handleApiError(error);
  }
}