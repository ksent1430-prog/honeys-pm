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
    const source = searchParams.get('source');
    const search = searchParams.get('search');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    let query = sql`SELECT * FROM leads WHERE 1=1`;
    
    if (status) {
      query = sql`${query} AND status = ${status}`;
    }
    if (source) {
      query = sql`${query} AND source = ${source}`;
    }
    if (search) {
      query = sql`${query} AND (name ILIKE ${'%' + search + '%'} OR email ILIKE ${'%' + search + '%'} OR phone ILIKE ${'%' + search + '%'})`;
    }
    if (dateFrom) {
      query = sql`${query} AND created_at >= ${new Date(dateFrom)}`;
    }
    if (dateTo) {
      query = sql`${query} AND created_at <= ${new Date(dateTo)}`;
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
      source: { type: 'string' },
      notes: { type: 'string' },
    });

    if (errors.length > 0) {
      throw new ApiError(400, 'Validation failed', errors);
    }

    const result = await db.execute(sql`
      INSERT INTO leads (name, email, phone, source, notes)
      VALUES (${body.name}, ${body.email}, ${body.phone || null}, ${body.source || null}, ${body.notes || null})
      RETURNING *
    `);

    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows[0], 201);
  } catch (error) {
    return handleApiError(error);
  }
}