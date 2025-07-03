'use client'

import { useState } from 'react'
import { useUser } from '@/context/UserContext'

export default function TestLoginPage() {
  const userData = useUser()
  const [simulado, setSimulado] = useState<'INVITADO' | 'ALUMNO' | 'DOCENTE'>('INVITADO')

  const cambiarPerfil = (cargo: typeof simulado) => {
    setSimulado(cargo)

    // Simular actualización del contexto (reemplazar temporalmente window.userData globalmente)
    ;(window as any).setTestUser?.({
      nombre: 'Usuario Test',
      cargo,
    })
  }

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">🎭 Test de perfiles simulados</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => cambiarPerfil('INVITADO')}
          className={`px-4 py-2 rounded ${
            simulado === 'INVITADO' ? 'bg-gray-600 text-white' : 'bg-gray-200'
          }`}
        >
          Invitado
        </button>
        <button
          onClick={() => cambiarPerfil('ALUMNO')}
          className={`px-4 py-2 rounded ${
            simulado === 'ALUMNO' ? 'bg-green-600 text-white' : 'bg-gray-200'
          }`}
        >
          Alumno
        </button>
        <button
          onClick={() => cambiarPerfil('DOCENTE')}
          className={`px-4 py-2 rounded ${
            simulado === 'DOCENTE' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Docente
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <p><strong>Usuario actual en contexto:</strong></p>
        <pre className="text-sm mt-2 bg-white p-2 rounded border">
          {JSON.stringify(userData, null, 2)}
        </pre>
      </div>
    </div>
  )
}
