import { NextRequest } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { requireAuth, handleApiError, successResponse, ApiError, validateInput } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    let query = sql`SELECT * FROM contract_templates WHERE 1=1`;
    if (type) query = sql`${query} AND type = ${type}`;
    if (search) query = sql`${query} AND (name ILIKE ${'%' + search + '%'} OR type ILIKE ${'%' + search + '%'})`;
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
    const errors = validateInput(body, { name: { required: true, type: 'string' }, type: { required: true, type: 'string' }, content: { required: true, type: 'string' } });
    if (errors.length > 0) throw new ApiError(400, 'Validation failed', errors);

    const result = await db.execute(sql`
      INSERT INTO contract_templates (name, type, content, variables)
      VALUES (${body.name}, ${body.type}, ${body.content}, ${body.variables ? JSON.stringify(body.variables) : '[]'})
      RETURNING *
    `);
    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows[0], 201);
  } catch (error) { return handleApiError(error); }
}