import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import { User, rolePermissions } from "@/lib/auth-context"

// The decoded token will have a different shape from the User type
interface DecodedToken {
  username: string
  sub: string // id
  role: User["role"]
  name: string
  email: string
  phone?: string
  company: string
  active: boolean
  createdAt: string // Dates in JWT are often strings or numbers
  permissions: any[] // Assuming permissions are in the token
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null) // Use the imported User type
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    setToken(token)
    if (token) {
      try {
        const decodedToken: DecodedToken = jwtDecode(token)
        // Map the decoded token to the User type
        const userProfile: User = {
          id: decodedToken.sub,
          username: decodedToken.username,
          role: decodedToken.role,
          name: decodedToken.name,
          email: decodedToken.email,
          phone: decodedToken.phone,
          company: decodedToken.company,
          active: decodedToken.active,
          createdAt: new Date(decodedToken.createdAt),
          permissions: rolePermissions[decodedToken.role.toLowerCase() as keyof typeof rolePermissions] || [],
        }
        setUser(userProfile)
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Invalid token:", error)
        localStorage.removeItem("auth_token")
        setIsAuthenticated(false)
        setUser(null)
        setToken(null)
      }
    } else {
      setIsAuthenticated(false)
      setUser(null)
      setToken(null)
    }
    setLoading(false)
  }, [])

  const logout = () => {
    localStorage.removeItem("auth_token")
    setIsAuthenticated(false)
    setUser(null)
    setToken(null)
  }

  const login = (newToken: string) => {
    localStorage.setItem("auth_token", newToken)
    setToken(newToken)
    try {
      const decodedToken: DecodedToken = jwtDecode(newToken)
      const userProfile: User = {
        id: decodedToken.sub,
        username: decodedToken.username,
        role: decodedToken.role,
        name: decodedToken.name,
        email: decodedToken.email,
        phone: decodedToken.phone,
        company: decodedToken.company,
        active: decodedToken.active,
        createdAt: new Date(decodedToken.createdAt),
        permissions: rolePermissions[decodedToken.role.toLowerCase() as keyof typeof rolePermissions] || [],
      }
      setUser(userProfile)
      setIsAuthenticated(true)
    } catch (error) {
      console.error("Invalid token:", error)
      logout()
    }
  }

  return { isAuthenticated, user, logout, loading, token, login }
}
