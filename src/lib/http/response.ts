import { NextResponse } from 'next/server';

export function ok<T>(payload: T) {
  return NextResponse.json(payload, { status: 200 });
}

export function created<T>(payload: T) {
  return NextResponse.json(payload, { status: 201 });
}

export function badRequest<T>(payload: T) {
  return NextResponse.json(payload, { status: 400 });
}

export function unauthorized<T>(payload: T) {
  return NextResponse.json(payload, { status: 401 });
}

export function forbidden<T>(payload: T) {
  return NextResponse.json(payload, { status: 403 });
}

export function notFound<T>(payload: T) {
  return NextResponse.json(payload, { status: 404 });
}
