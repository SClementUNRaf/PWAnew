// lib/intranetService.ts
import axios from 'axios';

const API_BASE = 'https://intranet.unraf.edu.ar/ApiRest';
const API_USER = process.env.API_USER!;
const API_PASS = process.env.API_PASS!;

let token: string | null = null;
let refreshToken: string | null = null;

async function createToken() {
  const response = await axios.post(`${API_BASE}/authentication`, {
    username: API_USER,
    password: API_PASS,
  });
  token = response.data.token;
  refreshToken = response.data.refresh_token;
}

async function refreshTokenIfNeeded() {
  try {
    const status = await axios.get(`${API_BASE}/status`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (status.data?.status !== 'CONSULT SUCCESS') throw new Error('Token inválido');
  } catch {
    if (refreshToken) {
      const response = await axios.post(`${API_BASE}/token/refresh`, {
        refresh_token: refreshToken,
      });
      token = response.data.token;
      refreshToken = response.data.refresh_token;
    } else {
      await createToken();
    }
  }
}

async function getHeaders() {
  if (!token) await createToken();
  await refreshTokenIfNeeded();
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export async function getPersonaByEmail(email: string) {
  try {
    const headers = await getHeaders();
    const response = await axios.post(`${API_BASE}/getPersonaByEmail`, { email }, { headers });
    return response.data;
  } catch (error) {
    console.error('❌ Error en getPersonaByEmail:', error);
    return null;
  }
}

export async function consultarDatosAlumno(payload: {
  dni: string;
  email: string;
  nombre: string;
  apellido: string;
  fecha: string;
  telefono?: string;
}) {
  try {
    const headers = await getHeaders();
    const response = await axios.post(`${API_BASE}/isAlumno`, payload, { headers });
    return response.data?.response?.[0] ?? null;
  } catch (error) {
    console.error('❌ Error en consultarDatosAlumno:', error);
    return null;
  }
}
