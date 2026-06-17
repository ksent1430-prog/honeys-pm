import { NextRequest } from 'next/server';
import { requireAuth, handleApiError, successResponse, ApiError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      throw new ApiError(400, 'No file provided');
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new ApiError(400, 'File too large. Maximum size is 10MB');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf', 'text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!allowedTypes.includes(file.type)) {
      throw new ApiError(400, `File type ${file.type} not supported`);
    }

    // For production, upload to S3/Cloudinary here
    // For now, return a placeholder URL
    const placeholderUrl = `/uploads/${Date.now()}-${file.name}`;

    return successResponse({
      url: placeholderUrl,
      name: file.name,
      type: file.type,
      size: file.size,
    }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}