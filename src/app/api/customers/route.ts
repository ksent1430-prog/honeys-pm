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

    let query = sql`SELECT * FROM customers WHERE 1=1`;
    if (search) {
      query = sql`${query} AND (name ILIKE ${'%' + search + '%'} OR email ILIKE ${'%' + search + '%'} OR phone ILIKE ${'%' + search + '%'})`;
    }
    query = sql`${query} ORDER BY created_at DESC`;

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
      name: { required: true, type: 'string' },
      email: { required: true, type: 'string' },
      phone: { type: 'string' },
      address: { type: 'string' },
      notes: { type: 'string' },
    });

    if (errors.length > 0) {
      throw new ApiError(400, 'Validation failed', errors);
    }

    const result = await db.execute(sql`
      INSERT INTO customers (name, email, phone, address, notes)
      VALUES (${body.name}, ${body.email}, ${body.phone || null}, ${body.address || null}, ${body.notes || null})
      RETURNING *
    `);

    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows[0], 201);
  } catch (error) {
    return handleApiError(error);
  }
}