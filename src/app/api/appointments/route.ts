import { NextRequest } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { requireAuth, handleApiError, successResponse, ApiError, validateInput } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const propertyId = searchParams.get('propertyId');
    const status = searchParams.get('status');

    let query = sql`
      SELECT a.*, p.address as property_address
      FROM appointments a
      LEFT JOIN properties p ON p.id = a.property_id
      WHERE 1=1
    `;

    if (dateFrom) query = sql`${query} AND a.date >= ${dateFrom}`;
    if (dateTo) query = sql`${query} AND a.date <= ${dateTo}`;
    if (propertyId) query = sql`${query} AND a.property_id = ${propertyId}`;
    if (status) query = sql`${query} AND a.status = ${status}`;

    query = sql`${query} ORDER BY a.date ASC, a.time ASC`;

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
      title: { required: true, type: 'string' },
      date: { required: true, type: 'string' },
      type: { type: 'string' },
      propertyId: { type: 'string' },
      time: { type: 'string' },
      duration: { type: 'number' },
    });

    if (errors.length > 0) {
      throw new ApiError(400, 'Validation failed', errors);
    }

    const result = await db.execute(sql`
      INSERT INTO appointments (property_id, type, title, description, date, time, duration, assigned_to, notes)
      VALUES (
        ${body.propertyId || null},
        ${body.type || null},
        ${body.title},
        ${body.description || null},
        ${body.date},
        ${body.time || null},
        ${body.duration || null},
        ${body.assignedTo || null},
        ${body.notes || null}
      )
      RETURNING *
    `);

    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows[0], 201);
  } catch (error) {
    return handleApiError(error);
  }
}