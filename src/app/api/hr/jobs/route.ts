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
    const department = searchParams.get('department');
    const search = searchParams.get('search');

    let query = sql`SELECT * FROM job_postings WHERE 1=1`;
    if (status) query = sql`${query} AND status = ${status}`;
    if (department) query = sql`${query} AND department = ${department}`;
    if (search) query = sql`${query} AND (title ILIKE ${'%' + search + '%'} OR description ILIKE ${'%' + search + '%'})`;
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
    const errors = validateInput(body, {
      title: { required: true, type: 'string' },
      description: { required: true, type: 'string' },
    });
    if (errors.length > 0) throw new ApiError(400, 'Validation failed', errors);

    const result = await db.execute(sql`
      INSERT INTO job_postings (title, department, description, requirements, salary_range, location, status)
      VALUES (${body.title}, ${body.department || null}, ${body.description}, ${body.requirements || null}, ${body.salaryRange || null}, ${body.location || null}, ${body.status || 'DRAFT'})
      RETURNING *
    `);
    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows[0], 201);
  } catch (error) { return handleApiError(error); }
}