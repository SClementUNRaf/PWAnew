// File: /app/api/auth/biometric-login/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'clave-secreta'; // usar variable segura en prod

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { deviceId, pin } = body;

    // Ejemplo: simulamos una base de datos de PINs asociados a deviceId
    const usuariosRegistrados = [
      { deviceId: 'abc123', pin: '123456', email: 'usuario@unraf.edu.ar' },
    ];

    const usuario = usuariosRegistrados.find(
      (u) => u.deviceId === deviceId && u.pin === pin
    );

    if (!usuario) {
      return NextResponse.json({ success: false, message: 'PIN o dispositivo incorrecto' }, { status: 401 });
    }

    // Generar token JWT con datos mínimos
    const token = jwt.sign({ email: usuario.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    // Guardamos el token en una cookie HttpOnly
    (await cookies()).set('session_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en login biométrico', error);
    return NextResponse.json({ success: false, message: 'Error interno' }, { status: 500 });
  }
}
