import { NextRequest } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { requireAuth, handleApiError, successResponse, ApiError, validateInput } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let query = sql`SELECT a.*, j.title as job_title FROM job_applications a LEFT JOIN job_postings j ON j.id = a.job_id WHERE 1=1`;
    if (jobId) query = sql`${query} AND a.job_id = ${jobId}`;
    if (status) query = sql`${query} AND a.status = ${status}`;
    if (search) query = sql`${query} AND (a.applicant_name ILIKE ${'%' + search + '%'} OR a.email ILIKE ${'%' + search + '%'})`;
    query = sql`${query} ORDER BY a.created_at DESC`;

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
      jobId: { required: true, type: 'string' },
      applicantName: { required: true, type: 'string' },
      email: { required: true, type: 'string' },
    });
    if (errors.length > 0) throw new ApiError(400, 'Validation failed', errors);

    const result = await db.execute(sql`
      INSERT INTO job_applications (job_id, applicant_name, email, phone_number, resume_url, cover_letter, notes)
      VALUES (${body.jobId}, ${body.applicantName}, ${body.email}, ${body.phoneNumber || null}, ${body.resumeUrl || null}, ${body.coverLetter || null}, ${body.notes || null})
      RETURNING *
    `);
    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows[0], 201);
  } catch (error) { return handleApiError(error); }
}