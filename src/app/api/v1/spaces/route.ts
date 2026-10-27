import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { createSpaceSchema, listSpacesQuerySchema } from '@/features/spaces/schemas/space.schema';
import { createSpaceRecord, listSpaces } from '@/features/spaces/services/space.service';
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

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = {
      page: url.searchParams.get('page') ?? '1',
      pageSize: url.searchParams.get('pageSize') ?? '20',
      type: url.searchParams.get('type') ?? undefined,
      includeInactive: url.searchParams.get('includeInactive') ?? undefined,
    };

    const parsed = listSpacesQuerySchema.safeParse(query);

    if (!parsed.success) {
      return NextResponse.json({ message: 'Validation failed.', errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const result = await listSpaces(parsed.data);

    return NextResponse.json({ message: 'Spaces retrieved successfully.', data: result }, { status: 200 });
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

export async function POST(request: Request) {
  try {
    await requireAdminAccess();

    const body = await request.json().catch(() => {
      throw new SyntaxError('Malformed JSON.');
    });

    const parsed = createSpaceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: 'Validation failed.', errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const space = await createSpaceRecord(parsed.data);

    return NextResponse.json({ message: 'Space created successfully.', data: space }, { status: 201 });
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
