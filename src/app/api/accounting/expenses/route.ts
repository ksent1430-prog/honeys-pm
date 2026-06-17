import { NextRequest } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { requireAuth, handleApiError, successResponse, ApiError, validateInput } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    const category = searchParams.get('category');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    let query = sql`SELECT e.*, p.address as property_address FROM expenses e LEFT JOIN properties p ON p.id = e.property_id WHERE 1=1`;
    if (propertyId) query = sql`${query} AND e.property_id = ${propertyId}`;
    if (category) query = sql`${query} AND e.category = ${category}`;
    if (dateFrom) query = sql`${query} AND e.expense_date >= ${dateFrom}`;
    if (dateTo) query = sql`${query} AND e.expense_date <= ${dateTo}`;
    query = sql`${query} ORDER BY e.expense_date DESC`;

    const result = await db.execute(query);
    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows);
  } catch (error) { return handleApiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const errors = validateInput(body, {
      amount: { required: true, type: 'number' },
      description: { required: true, type: 'string' },
      expenseDate: { required: true, type: 'string' },
      category: { type: 'string' },
    });
    if (errors.length > 0) throw new ApiError(400, 'Validation failed', errors);

    const result = await db.execute(sql`
      INSERT INTO expenses (property_id, category, amount, description, expense_date, vendor, receipt_url, notes)
      VALUES (${body.propertyId || null}, ${body.category || 'OTHER'}, ${String(body.amount)}, ${body.description}, ${body.expenseDate}, ${body.vendor || null}, ${body.receiptUrl || null}, ${body.notes || null})
      RETURNING *
    `);
    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows[0], 201);
  } catch (error) { return handleApiError(error); }
}