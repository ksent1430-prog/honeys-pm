import { NextRequest } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { requireAuth, handleApiError, successResponse, notFoundResponse, ApiError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const [propertyResult, workOrdersResult, inspectionsResult, appointmentsResult] = await Promise.all([
      db.execute(sql`SELECT * FROM properties WHERE id = ${id}`),
      db.execute(sql`SELECT * FROM work_orders WHERE property_id = ${id} ORDER BY created_at DESC`),
      db.execute(sql`SELECT * FROM inspections WHERE property_id = ${id} ORDER BY created_at DESC`),
      db.execute(sql`SELECT * FROM appointments WHERE property_id = ${id} ORDER BY date DESC`),
    ]);

    const propertyRows = Array.isArray(propertyResult) ? propertyResult : propertyResult.rows || [];
    if (propertyRows.length === 0) return notFoundResponse('Property');

    return successResponse({
      ...propertyRows[0],
      workOrders: Array.isArray(workOrdersResult) ? workOrdersResult : workOrdersResult.rows || [],
      inspections: Array.isArray(inspectionsResult) ? inspectionsResult : inspectionsResult.rows || [],
      appointments: Array.isArray(appointmentsResult) ? appointmentsResult : appointmentsResult.rows || [],
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();

    const existing = await db.execute(sql`SELECT id FROM properties WHERE id = ${id}`);
    const existingRows = Array.isArray(existing) ? existing : existing.rows || [];
    if (existingRows.length === 0) return notFoundResponse('Property');

    const fieldMap: Record<string, string> = {
      address: 'address',
      type: 'type',
      bedrooms: 'bedrooms',
      bathrooms: 'bathrooms',
      sqft: 'sqft',
      occupancyStatus: 'occupancy_status',
      rentAmount: 'rent_amount',
      securityDeposit: 'security_deposit',
      leaseStart: 'lease_start',
      leaseEnd: 'lease_end',
      notes: 'notes',
      ownerId: 'owner_id',
    };

    const updates: string[] = [];
    const values: unknown[] = [];

    for (const [field, col] of Object.entries(fieldMap)) {
      if (body[field] !== undefined) {
        updates.push(col);
        values.push(body[field]);
      }
    }

    if (updates.length === 0) throw new ApiError(400, 'No fields to update');

    const setClauses = updates.map((col, i) => sql`${sql.raw(col)} = ${values[i]}`);
    const result = await db.execute(sql`
      UPDATE properties SET ${sql.join(setClauses, sql`, `)}, updated_at = NOW()
      WHERE id = ${id} RETURNING *
    `);

    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows[0]);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const result = await db.execute(sql`DELETE FROM properties WHERE id = ${id} RETURNING id`);
    const rows = Array.isArray(result) ? result : result.rows || [];
    if (rows.length === 0) return notFoundResponse('Property');
    return successResponse({ deleted: true, id });
  } catch (error) {
    return handleApiError(error);
  }
}