"use client"
import { createContext, useContext, ReactNode } from "react"
import { useAuth } from "@/hooks/use-auth"
import { User } from "@/lib/auth-context"

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  loading: boolean
  logout: () => void
  token: string | null
  login: (token: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider")
  }
  return context
}
