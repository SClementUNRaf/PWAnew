// File: /app/api/auth/register-device/route.ts
import { NextResponse } from 'next/server';

// ⚠️ Este ejemplo usa una base de datos en memoria temporal
// En producción deberías usar una DB real con Prisma, Drizzle, etc.
let dispositivosRegistrados: {
  deviceId: string;
  pin: string;
  email: string;
}[] = [];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { deviceId, pin, email } = body;

    if (!deviceId || !pin || !email) {
      return NextResponse.json({ success: false, message: 'Datos incompletos' }, { status: 400 });
    }

    const yaExiste = dispositivosRegistrados.find(
      (d) => d.deviceId === deviceId && d.email === email
    );

    if (yaExiste) {
      return NextResponse.json({ success: false, message: 'Dispositivo ya registrado' }, { status: 409 });
    }

    dispositivosRegistrados.push({ deviceId, pin, email });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en registro de dispositivo', error);
    return NextResponse.json({ success: false, message: 'Error interno' }, { status: 500 });
  }
}
