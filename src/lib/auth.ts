// File: /lib/auth.ts
import { registerPlugin } from '@capacitor/core';
import { Device } from '@capacitor/device';

const FingerprintAuth = registerPlugin<any>('CapacitorFingerprintAuth');

export async function loginConBiometria() {
  try {
    const info = await Device.getId();
    const deviceId = info.identifier;

    const result = await FingerprintAuth.authenticate({
      reason: 'Autenticación requerida',
      title: 'Usá tu huella o FaceID',
      subtitle: 'Para acceder a tu cuenta UNRaf',
      description: 'Verificá tu identidad',
    });

    if (!result.success) {
      throw new Error('Autenticación cancelada o fallida');
    }

    const response = await fetch('/api/auth/biometric-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId, pin: '123456' }), // reemplazar PIN
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Fallo en login');

    return true;
  } catch (error) {
    console.error('Error en login biométrico:', error);
    return false;
  }
}
