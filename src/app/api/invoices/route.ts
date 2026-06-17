import { NextRequest } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { requireAuth, handleApiError, successResponse, ApiError, validateInput } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const customerId = searchParams.get('customerId');
    const propertyId = searchParams.get('propertyId');

    let query = sql`
      SELECT i.*, c.name as customer_name, p.address as property_address
      FROM invoices i
      LEFT JOIN customers c ON c.id = i.customer_id
      LEFT JOIN properties p ON p.id = i.property_id
      WHERE 1=1
    `;

    if (status) query = sql`${query} AND i.status = ${status}`;
    if (customerId) query = sql`${query} AND i.customer_id = ${customerId}`;
    if (propertyId) query = sql`${query} AND i.property_id = ${propertyId}`;

    query = sql`${query} ORDER BY i.created_at DESC`;

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
      amount: { required: true, type: 'number' },
      dueDate: { required: true, type: 'string' },
      customerId: { type: 'string' },
      propertyId: { type: 'string' },
      notes: { type: 'string' },
    });

    if (errors.length > 0) {
      throw new ApiError(400, 'Validation failed', errors);
    }

    // Generate invoice number
    const countResult = await db.execute(sql`SELECT count(*)::int as count FROM invoices`);
    const countRows = Array.isArray(countResult) ? countResult : countResult.rows || [];
    const count = countRows[0]?.count ?? 0;
    const number = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const result = await db.execute(sql`
      INSERT INTO invoices (customer_id, property_id, number, amount, due_date, notes, line_items)
      VALUES (
        ${body.customerId || null},
        ${body.propertyId || null},
        ${number},
        ${String(body.amount)},
        ${body.dueDate},
        ${body.notes || null},
        ${body.lineItems ? JSON.stringify(body.lineItems) : '[]'}
      )
      RETURNING *
    `);

    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows[0], 201);
  } catch (error) {
    return handleApiError(error);
  }
}