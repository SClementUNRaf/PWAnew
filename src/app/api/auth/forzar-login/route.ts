// app/api/auth/forzar-login/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST() {
  const payload = {
    email: 'sebasclement.sc@gmail.com',
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '2h',
  });

  const response = NextResponse.json({ success: true });

  response.cookies.set('session_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7200,
  });

  return response;
}
