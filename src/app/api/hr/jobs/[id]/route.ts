import { NextRequest } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { requireAuth, handleApiError, successResponse, notFoundResponse, ApiError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const [jobResult, appsResult] = await Promise.all([
      db.execute(sql`SELECT * FROM job_postings WHERE id = ${id}`),
      db.execute(sql`SELECT * FROM job_applications WHERE job_id = ${id} ORDER BY created_at DESC`),
    ]);
    const jobRows = Array.isArray(jobResult) ? jobResult : jobResult.rows || [];
    if (jobRows.length === 0) return notFoundResponse('Job posting');
    return successResponse({ ...jobRows[0], applications: Array.isArray(appsResult) ? appsResult : appsResult.rows || [] });
  } catch (error) { return handleApiError(error); }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const existing = await db.execute(sql`SELECT id FROM job_postings WHERE id = ${id}`);
    const existingRows = Array.isArray(existing) ? existing : existing.rows || [];
    if (existingRows.length === 0) return notFoundResponse('Job posting');

    const fieldMap: Record<string, string> = { title: 'title', department: 'department', description: 'description', requirements: 'requirements', salaryRange: 'salary_range', location: 'location', status: 'status' };
    const updates: string[] = [];
    const values: unknown[] = [];
    for (const [field, col] of Object.entries(fieldMap)) {
      if (body[field] !== undefined) { updates.push(col); values.push(body[field]); }
    }
    if (updates.length === 0) throw new ApiError(400, 'No fields to update');
    const setClauses = updates.map((col, i) => sql`${sql.raw(col)} = ${values[i]}`);
    const result = await db.execute(sql`UPDATE job_postings SET ${sql.join(setClauses, sql`, `)}, updated_at = NOW() WHERE id = ${id} RETURNING *`);
    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows[0]);
  } catch (error) { return handleApiError(error); }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    await db.execute(sql`DELETE FROM job_applications WHERE job_id = ${id}`);
    const result = await db.execute(sql`DELETE FROM job_postings WHERE id = ${id} RETURNING id`);
    const rows = Array.isArray(result) ? result : result.rows || [];
    if (rows.length === 0) return notFoundResponse('Job posting');
    return successResponse({ deleted: true, id });
  } catch (error) { return handleApiError(error); }
}