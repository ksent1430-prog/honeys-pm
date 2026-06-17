import { NextRequest } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { requireAuth, handleApiError, successResponse, ApiError, validateInput } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let query = sql`SELECT e.*, u.email, u.first_name, u.last_name, u.role FROM employee_profiles e LEFT JOIN users u ON u.id = e.user_id WHERE 1=1`;
    if (department) query = sql`${query} AND e.department = ${department}`;
    if (status) query = sql`${query} AND e.status = ${status}`;
    if (search) query = sql`${query} AND (u.first_name ILIKE ${'%' + search + '%'} OR u.last_name ILIKE ${'%' + search + '%'} OR e.position ILIKE ${'%' + search + '%'})`;
    query = sql`${query} ORDER BY e.hire_date DESC`;

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
      userId: { required: true, type: 'string' },
      position: { type: 'string' },
      department: { type: 'string' },
    });
    if (errors.length > 0) throw new ApiError(400, 'Validation failed', errors);

    const result = await db.execute(sql`
      INSERT INTO employee_profiles (user_id, department, position, salary, hire_date, emergency_contact, notes)
      VALUES (${body.userId}, ${body.department || null}, ${body.position || null}, ${body.salary ? String(body.salary) : null}, ${body.hireDate || null}, ${body.emergencyContact || null}, ${body.notes || null})
      RETURNING *
    `);
    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows[0], 201);
  } catch (error) { return handleApiError(error); }
}