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
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let query = sql`
      SELECT p.*, 
        (SELECT json_agg(json_build_object('id', t.id, 'name', u.name, 'email', u.email))
         FROM tenants t JOIN users u ON u.id = t.user_id WHERE t.property_id = p.id AND t.status = 'ACTIVE'
        ) as current_tenants
      FROM properties p WHERE 1=1
    `;

    if (type) {
      query = sql`${query} AND p.type = ${type}`;
    }
    if (status) {
      query = sql`${query} AND p.occupancy_status = ${status}`;
    }
    if (search) {
      query = sql`${query} AND (p.address ILIKE ${'%' + search + '%'} OR p.notes ILIKE ${'%' + search + '%'})`;
    }

    query = sql`${query} ORDER BY p.created_at DESC`;

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
      address: { required: true, type: 'string' },
      type: { type: 'string' },
      bedrooms: { type: 'number' },
      bathrooms: { type: 'number' },
      sqft: { type: 'number' },
      rentAmount: { type: 'number' },
    });

    if (errors.length > 0) {
      throw new ApiError(400, 'Validation failed', errors);
    }

    const result = await db.execute(sql`
      INSERT INTO properties (address, type, bedrooms, bathrooms, sqft, rent_amount, notes, owner_id)
      VALUES (
        ${body.address},
        ${body.type || null},
        ${body.bedrooms || null},
        ${body.bathrooms ? String(body.bathrooms) : null},
        ${body.sqft || null},
        ${body.rentAmount ? String(body.rentAmount) : null},
        ${body.notes || null},
        ${body.ownerId || null}
      )
      RETURNING *
    `);

    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows[0], 201);
  } catch (error) {
    return handleApiError(error);
  }
}