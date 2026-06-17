import { NextRequest } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { requireAuth, handleApiError, successResponse, ApiError, validateInput } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { userId } = await requireAuth();

    const result = await db.execute(sql`
      SELECT * FROM notifications
      WHERE user_id = ${userId}
      ORDER BY sent_at DESC
      LIMIT 100
    `);

    // Also get unread count
    const unreadResult = await db.execute(sql`
      SELECT count(*)::int as count FROM notifications
      WHERE user_id = ${userId} AND is_read = false
    `);

    const unreadRows = Array.isArray(unreadResult) ? unreadResult : unreadResult.rows || [];
    const unreadCount = unreadRows[0]?.count ?? 0;

    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse({ notifications: rows, unreadCount });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();

    const errors = validateInput(body, {
      userId: { required: true, type: 'string' },
      title: { required: true, type: 'string' },
      body: { required: true, type: 'string' },
      type: { type: 'string' },
    });

    if (errors.length > 0) {
      throw new ApiError(400, 'Validation failed', errors);
    }

    const result = await db.execute(sql`
      INSERT INTO notifications (user_id, type, title, body, related_entity, related_id)
      VALUES (${body.userId}, ${body.type || null}, ${body.title}, ${body.body}, ${body.relatedEntity || null}, ${body.relatedId || null})
      RETURNING *
    `);

    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows[0], 201);
  } catch (error) {
    return handleApiError(error);
  }
}