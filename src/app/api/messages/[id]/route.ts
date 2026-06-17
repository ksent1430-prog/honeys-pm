import { NextRequest } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { requireAuth, handleApiError, successResponse, notFoundResponse } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const result = await db.execute(sql`
      SELECT m.*,
        s.name as sender_name, s.email as sender_email,
        r.name as recipient_name, r.email as recipient_email
      FROM messages m
      LEFT JOIN users s ON s.id = m.sender_id
      LEFT JOIN users r ON r.id = m.recipient_id
      WHERE m.id = ${id}
    `);
    const rows = Array.isArray(result) ? result : result.rows || [];
    if (rows.length === 0) return notFoundResponse('Message');
    return successResponse(rows[0]);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;

    const result = await db.execute(sql`
      UPDATE messages SET is_read = true
      WHERE id = ${id} RETURNING *
    `);

    const rows = Array.isArray(result) ? result : result.rows || [];
    if (rows.length === 0) return notFoundResponse('Message');
    return successResponse(rows[0]);
  } catch (error) {
    return handleApiError(error);
  }
}