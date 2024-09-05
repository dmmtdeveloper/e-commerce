import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { username, password } = await request.json();
  // Lógica para verificar y generar JWT
  return NextResponse.json({ token: 'jwt-token' });
}
