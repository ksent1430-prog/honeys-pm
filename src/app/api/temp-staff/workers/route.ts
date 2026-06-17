import { NextRequest } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { requireAuth, handleApiError, successResponse, ApiError, validateInput } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('availabilityStatus');
    const search = searchParams.get('search');

    let query = sql`SELECT w.*, u.email, u.first_name, u.last_name FROM temp_workers w LEFT JOIN users u ON u.id = w.user_id WHERE 1=1`;
    if (status) query = sql`${query} AND w.availability_status = ${status}`;
    if (search) query = sql`${query} AND (u.first_name ILIKE ${'%' + search + '%'} OR u.last_name ILIKE ${'%' + search + '%'} OR w.skills ILIKE ${'%' + search + '%'})`;
    query = sql`${query} ORDER BY w.created_at DESC`;

    const result = await db.execute(query);
    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows);
  } catch (error) { return handleApiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const errors = validateInput(body, { userId: { required: true, type: 'string' } });
    if (errors.length > 0) throw new ApiError(400, 'Validation failed', errors);

    const result = await db.execute(sql`
      INSERT INTO temp_workers (user_id, skills, hourly_rate, notes)
      VALUES (${body.userId}, ${body.skills || null}, ${body.hourlyRate ? String(body.hourlyRate) : null}, ${body.notes || null})
      RETURNING *
    `);
    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows[0], 201);
  } catch (error) { return handleApiError(error); }
}