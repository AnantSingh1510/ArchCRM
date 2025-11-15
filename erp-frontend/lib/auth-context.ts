// Role-based authentication context and utilities

export type UserRole = "admin" | "owner" | "employee" | "user"

export interface User {
  id: string
  name: string
  username: string
  email: string
  role: UserRole
  company: string
  avatar?: string
  phone?: string
  active: boolean
  createdAt: Date
  permissions: Permission[]
}

export interface Permission {
  resource: string
  action: "create" | "read" | "update" | "delete" | "approve"
}

// Role-based permission matrix
export const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    { resource: "users", action: "create" },
    { resource: "users", action: "read" },
    { resource: "users", action: "update" },
    { resource: "users", action: "delete" },
    { resource: "invoices", action: "create" },
    { resource: "invoices", action: "read" },
    { resource: "invoices", action: "update" },
    { resource: "invoices", action: "delete" },
    { resource: "invoices", action: "approve" },
    { resource: "payments", action: "create" },
    { resource: "payments", action: "read" },
    { resource: "payments", action: "approve" },
    { resource: "projects", action: "create" },
    { resource: "projects", action: "read" },
    { resource: "projects", action: "update" },
    { resource: "projects", action: "delete" },
    { resource: "reports", action: "read" },
    { resource: "analytics", action: "read" },
  ],
  owner: [
    { resource: "invoices", action: "read" },
    { resource: "invoices", action: "approve" },
    { resource: "payments", action: "read" },
    { resource: "payments", action: "approve" },
    { resource: "projects", action: "read" },
    { resource: "projects", action: "update" },
    { resource: "reports", action: "read" },
    { resource: "analytics", action: "read" },
    { resource: "teams", action: "read" },
  ],
  employee: [
    { resource: "projects", action: "read" },
    { resource: "projects", action: "update" },
    { resource: "tasks", action: "read" },
    { resource: "tasks", action: "update" },
    { resource: "teams", action: "read" },
    { resource: "documents", action: "read" },
    { resource: "documents", action: "create" },
  ],
  user: [
    { resource: "projects", action: "read" },
    { resource: "invoices", action: "read" },
    { resource: "documents", action: "read" },
  ],
}

// Check if user has permission
export function hasPermission(user: User, resource: string, action: Permission["action"]): boolean {
  return user.permissions.some((p) => p.resource === resource && p.action === action)
}