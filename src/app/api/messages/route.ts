import { NextRequest } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { requireAuth, handleApiError, successResponse, ApiError, validateInput } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await requireAuth();
    const { searchParams } = new URL(request.url);
    const sender = searchParams.get('sender');
    const receiver = searchParams.get('receiver');
    const relatedEntity = searchParams.get('relatedEntity');
    const relatedId = searchParams.get('relatedId');

    let query = sql`
      SELECT m.*, 
        s.name as sender_name, s.email as sender_email,
        r.name as recipient_name, r.email as recipient_email
      FROM messages m
      LEFT JOIN users s ON s.id = m.sender_id
      LEFT JOIN users r ON r.id = m.recipient_id
      WHERE (m.sender_id = ${userId} OR m.recipient_id = ${userId})
    `;

    if (sender) query = sql`${query} AND m.sender_id = ${sender}`;
    if (receiver) query = sql`${query} AND m.recipient_id = ${receiver}`;
    if (relatedEntity) query = sql`${query} AND m.related_entity = ${relatedEntity}`;
    if (relatedId) query = sql`${query} AND m.related_id = ${relatedId}`;

    query = sql`${query} ORDER BY m.created_at DESC`;

    const result = await db.execute(query);
    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await requireAuth();
    const body = await request.json();

    const errors = validateInput(body, {
      recipientId: { required: true, type: 'string' },
      body: { required: true, type: 'string' },
      subject: { type: 'string' },
    });

    if (errors.length > 0) {
      throw new ApiError(400, 'Validation failed', errors);
    }

    const result = await db.execute(sql`
      INSERT INTO messages (sender_id, recipient_id, subject, body, related_entity, related_id)
      VALUES (${userId}, ${body.recipientId}, ${body.subject || null}, ${body.body}, ${body.relatedEntity || null}, ${body.relatedId || null})
      RETURNING *
    `);

    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows[0], 201);
  } catch (error) {
    return handleApiError(error);
  }
}