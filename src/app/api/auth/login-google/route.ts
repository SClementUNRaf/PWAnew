// app/api/auth/login-google/route.ts
import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const client = new OAuth2Client();

export async function POST(req: Request) {
  const { credential } = await req.json();

  if (!credential) {
    return NextResponse.json({ error: 'Token no proporcionado' }, { status: 400 });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const token = jwt.sign({ email: payload.email }, process.env.JWT_SECRET!, {
      expiresIn: '2h',
    });

    const cookieStore = await cookies();
cookieStore.set('session_token', token, {
  httpOnly: true,
  path: '/',
  maxAge: 2 * 60 * 60,
});


    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error verificando token de Google:', err);
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }
}
