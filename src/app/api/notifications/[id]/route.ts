import { NextRequest } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { requireAuth, handleApiError, successResponse, notFoundResponse } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await requireAuth();
    const { id } = await params;

    const result = await db.execute(sql`
      UPDATE notifications SET is_read = true
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING *
    `);

    const rows = Array.isArray(result) ? result : result.rows || [];
    if (rows.length === 0) return notFoundResponse('Notification');
    return successResponse(rows[0]);
  } catch (error) {
    return handleApiError(error);
  }
}