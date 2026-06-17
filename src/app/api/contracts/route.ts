import { NextRequest } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { requireAuth, handleApiError, successResponse, ApiError, validateInput } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    const status = searchParams.get('status');

    let query = sql`
      SELECT c.*, ct.name as template_name, p.address as property_address,
        l.company_name as landlord_company
      FROM contracts c
      LEFT JOIN contract_templates ct ON ct.id = c.template_id
      LEFT JOIN properties p ON p.id = c.property_id
      LEFT JOIN landlords l ON l.id = c.landlord_id
      WHERE 1=1
    `;
    if (propertyId) query = sql`${query} AND c.property_id = ${propertyId}`;
    if (status) query = sql`${query} AND c.status = ${status}`;
    query = sql`${query} ORDER BY c.created_at DESC`;

    const result = await db.execute(query);
    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows);
  } catch (error) { return handleApiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const errors = validateInput(body, { title: { required: true, type: 'string' }, content: { required: true, type: 'string' } });
    if (errors.length > 0) throw new ApiError(400, 'Validation failed', errors);

    // If templateId is provided, generate content from template
    let content = body.content;
    if (body.templateId) {
      const tplResult = await db.execute(sql`SELECT * FROM contract_templates WHERE id = ${body.templateId}`);
      const tplRows = Array.isArray(tplResult) ? tplResult : tplResult.rows || [];
      if (tplRows.length > 0) {
        const template = tplRows[0];
        content = template.content;
        // Replace variables if provided
        if (body.variables && Array.isArray(template.variables)) {
          for (const v of template.variables) {
            const val = body.variables[v] || `{{${v}}}`;
            content = content.replace(new RegExp(`\\{\\{${v}\\}\\}`, 'g'), val);
          }
        }
      }
    }

    const result = await db.execute(sql`
      INSERT INTO contracts (template_id, property_id, landlord_id, tenant_id, title, content, status)
      VALUES (${body.templateId || null}, ${body.propertyId || null}, ${body.landlordId || null}, ${body.tenantId || null}, ${body.title}, ${content}, ${body.status || 'DRAFT'})
      RETURNING *
    `);
    const rows = Array.isArray(result) ? result : result.rows || [];
    return successResponse(rows[0], 201);
  } catch (error) { return handleApiError(error); }
}