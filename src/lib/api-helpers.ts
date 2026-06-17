import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export type ApiHandlerContext = {
  userId: string;
};

export async function requireAuth(): Promise<ApiHandlerContext> {
  const session = await auth();
  const userId = session.userId;
  if (!userId) {
    throw new ApiError(401, 'Unauthorized');
  }
  return { userId };
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message, details: error.details },
      { status: error.status }
    );
  }
  console.error('Unhandled API error:', error);
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}

export function successResponse(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function notFoundResponse(entity = 'Resource') {
  return NextResponse.json(
    { error: `${entity} not found` },
    { status: 404 }
  );
}

/**
 * Simple input validation - checks required fields and types.
 * Returns an array of error messages or null if valid.
 */
export function validateInput(data: Record<string, unknown>, rules: Record<string, { type?: string; required?: boolean }>): string[] {
  const errors: string[] = [];
  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field];
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field} is required`);
      continue;
    }
    if (value !== undefined && value !== null && rule.type) {
      if (rule.type === 'string' && typeof value !== 'string') {
        errors.push(`${field} must be a string`);
      } else if (rule.type === 'number' && typeof value !== 'number') {
        errors.push(`${field} must be a number`);
      } else if (rule.type === 'boolean' && typeof value !== 'boolean') {
        errors.push(`${field} must be a boolean`);
      }
    }
  }
  return errors;
}