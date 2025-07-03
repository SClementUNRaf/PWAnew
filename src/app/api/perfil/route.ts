// app/api/perfil/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { OAuth2Client } from 'google-auth-library';
import { consultarGuarani } from '@/lib/siuService';
import { getPersonaByEmail } from '@/lib/intranetService'; // 💡 Ya creado

const client = new OAuth2Client();

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  let email = '';
  try {
    const ticket = await client.verifyIdToken({ idToken: token });
    const payload = ticket.getPayload();
    if (!payload?.email) throw new Error('Token inválido');
    email = payload.email;
  } catch (e) {
    return NextResponse.json({ error: 'Token inválido o vencido' }, { status: 401 });
  }

  // 🔎 Obtenemos los datos reales desde la Intranet
  const datosPersona = await getPersonaByEmail(email);

  if (!datosPersona?.dni || !datosPersona?.nombre || !datosPersona?.apellido || !datosPersona?.fecha_nacimiento || !datosPersona?.telefono) {
    return NextResponse.json({
      email,
      requiereDatos: true,
      camposFaltantes: ['dni', 'nombre', 'apellido', 'fecha_nacimiento', 'telefono'].filter(
        c => !datosPersona[c]
      ),
    });
  }

  const datosGuarani = await consultarGuarani({
    dni: datosPersona.dni,
    nombre: datosPersona.nombre,
    apellido: datosPersona.apellido,
    fecha: datosPersona.fecha_nacimiento,
    telefono: datosPersona.telefono,
    email,
  });

  console.log('🔍 Datos desde Guaraní:', JSON.stringify(datosGuarani, null, 2));

  const roles: string[] = [];
  if (datosGuarani?.estado) {
    roles.push('estudiante');
  }

  return NextResponse.json({
    email,
    nombre: datosPersona.nombre,
    apellido: datosPersona.apellido,
    dni: datosPersona.dni,
    telefono: datosPersona.telefono,
    fecha: datosPersona.fecha_nacimiento,
    roles,
  });
}
