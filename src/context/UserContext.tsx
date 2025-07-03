// context/UserContext.tsx
"use client"
import { createContext, useContext, useEffect, useState } from "react"

export interface UserData {
  nombre: string
  cargo: string
}

const UserContext = createContext<UserData | null>(null)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null)

  useEffect(() => {
  const modoTest = true

  if (modoTest) {
    setUser({ nombre: "Tester", cargo: "INVITADO" })
    const setTestUser = (mockUser: UserData | null) => setUser(mockUser)
    ;(window as any).setTestUser = setTestUser
  } else {
    fetch("/api/perfil")
      .then(res => res.ok ? res.json() : null)
      .then(data => data && setUser({ nombre: data.nombre, cargo: data.cargo }))
      .catch(() => setUser(null))
  }
}, [])


  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

export const useUser = () => useContext(UserContext)
