import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { spaceIdSchema, updateSpaceSchema } from '@/features/spaces/schemas/space.schema';
import { deleteSpaceRecord, getSpaceById, updateSpaceRecord } from '@/features/spaces/services/space.service';
import { authCookieNames, getAuthenticatedUserFromAccessToken, hasRequiredRole } from '@/lib/auth/session';
import { UserRole } from '@prisma/client';

async function requireAdminAccess() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(authCookieNames.accessToken)?.value;

  if (!accessToken) {
    throw new Error('Unauthorized.');
  }

  const user = await getAuthenticatedUserFromAccessToken(accessToken);

  if (!hasRequiredRole(user, UserRole.ADMIN)) {
    throw new Error('Forbidden.');
  }

  return user;
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const parsedId = spaceIdSchema.safeParse(id);

    if (!parsedId.success) {
      return NextResponse.json({ message: 'Validation failed.', errors: parsedId.error.flatten().fieldErrors }, { status: 400 });
    }

    const space = await getSpaceById(parsedId.data);

    if (!space) {
      return NextResponse.json({ message: 'Space not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Space retrieved successfully.', data: space }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized.') {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    if (error instanceof Error && error.message === 'Forbidden.') {
      return NextResponse.json({ message: 'Forbidden.' }, { status: 403 });
    }

    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminAccess();
    const { id } = await params;
    const parsedId = spaceIdSchema.safeParse(id);

    if (!parsedId.success) {
      return NextResponse.json({ message: 'Validation failed.', errors: parsedId.error.flatten().fieldErrors }, { status: 400 });
    }

    const body = await request.json().catch(() => {
      throw new SyntaxError('Malformed JSON.');
    });

    const parsed = updateSpaceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: 'Validation failed.', errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const updatedSpace = await updateSpaceRecord(parsedId.data, parsed.data);

    return NextResponse.json({ message: 'Space updated successfully.', data: updatedSpace }, { status: 200 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Malformed JSON body.' }, { status: 400 });
    }

    if (error instanceof Error && error.message === 'Unauthorized.') {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    if (error instanceof Error && error.message === 'Forbidden.') {
      return NextResponse.json({ message: 'Forbidden.' }, { status: 403 });
    }

    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminAccess();
    const { id } = await params;
    const parsedId = spaceIdSchema.safeParse(id);

    if (!parsedId.success) {
      return NextResponse.json({ message: 'Validation failed.', errors: parsedId.error.flatten().fieldErrors }, { status: 400 });
    }

    const deletedSpace = await deleteSpaceRecord(parsedId.data);

    return NextResponse.json({ message: 'Space deleted successfully.', data: deletedSpace }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized.') {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    if (error instanceof Error && error.message === 'Forbidden.') {
      return NextResponse.json({ message: 'Forbidden.' }, { status: 403 });
    }

    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}
