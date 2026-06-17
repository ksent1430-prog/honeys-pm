import { NextRequest } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { requireAuth, handleApiError, successResponse, ApiError, validateInput } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let query = sql`SELECT * FROM temp_clients WHERE 1=1`;
    if (search) query = sql`${query} AND (company_name ILIKE ${'%' + search + '%'} OR contact_name ILIKE ${'%' + search + '%'} OR email ILIKE ${'%' + search + '%'})`;
    query = sql`${query} ORDER BY created_at DESC`;

    const result = await db.execute(query);
    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows);
  } catch (error) { return handleApiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const errors = validateInput(body, { companyName: { required: true, type: 'string' }, contactName: { required: true, type: 'string' }, email: { required: true, type: 'string' } });
    if (errors.length > 0) throw new ApiError(400, 'Validation failed', errors);

    const result = await db.execute(sql`
      INSERT INTO temp_clients (company_name, contact_name, email, phone, address, notes)
      VALUES (${body.companyName}, ${body.contactName}, ${body.email}, ${body.phone || null}, ${body.address || null}, ${body.notes || null})
      RETURNING *
    `);
    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows[0], 201);
  } catch (error) { return handleApiError(error); }
}