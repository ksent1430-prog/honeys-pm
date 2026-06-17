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
    const result = await db.execute(sql`SELECT * FROM leads WHERE id = ${id}`);
    const rows = Array.isArray(result) ? result : result.rows || [];
    if (rows.length === 0) return notFoundResponse('Lead');
    return successResponse(rows[0]);
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

    // Check lead exists
    const existing = await db.execute(sql`SELECT id FROM leads WHERE id = ${id}`);
    const existingRows = Array.isArray(existing) ? existing : existing.rows || [];
    if (existingRows.length === 0) return notFoundResponse('Lead');

    const updates: string[] = [];
    const values: unknown[] = [];

    if (body.status !== undefined) {
      updates.push('status');
      values.push(body.status);
    }
    if (body.name !== undefined) {
      updates.push('name');
      values.push(body.name);
    }
    if (body.email !== undefined) {
      updates.push('email');
      values.push(body.email);
    }
    if (body.phone !== undefined) {
      updates.push('phone');
      values.push(body.phone);
    }
    if (body.source !== undefined) {
      updates.push('source');
      values.push(body.source);
    }
    if (body.notes !== undefined) {
      updates.push('notes');
      values.push(body.notes);
    }
    if (body.assignedTo !== undefined) {
      updates.push('assigned_to');
      values.push(body.assignedTo);
    }

    if (updates.length === 0) {
      throw new ApiError(400, 'No fields to update');
    }

    const setClauses = updates.map((col, i) => sql`${sql.raw(col)} = ${values[i]}`);
    
    const result = await db.execute(sql`
      UPDATE leads SET ${sql.join(setClauses, sql`, `)}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
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
    const result = await db.execute(sql`DELETE FROM leads WHERE id = ${id} RETURNING id`);
    const rows = Array.isArray(result) ? result : result.rows || [];
    if (rows.length === 0) return notFoundResponse('Lead');
    return successResponse({ deleted: true, id });
  } catch (error) {
    return handleApiError(error);
  }
}