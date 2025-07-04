import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const authRes = await fetch("https://intranet.unraf.edu.ar/ApiRest/authentication", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: process.env.API_USER,
        password: process.env.API_PASS,
      }),
    });

    if (!authRes.ok) {
      return NextResponse.json({ error: "Error de autenticación" }, { status: 401 });
    }

    const { token } = await authRes.json();

    const alumnoRes = await fetch("https://intranet.unraf.edu.ar/ApiRest/isAlumno", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const result = await alumnoRes.json();
    return NextResponse.json(result, { status: alumnoRes.status });
  } catch (error) {
    console.error("Error en la API:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
