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

// Get mock user by role for demo purposes
export function getMockUserByRole(role: UserRole): User {
  const mockUsers: Record<UserRole, User> = {
    admin: {
      id: "admin-1",
      name: "Admin User",
      username: "admin",
      email: "admin@operahub.com",
      role: "admin",
      company: "OperaHub",
      avatar: "👤",
      phone: "+91-9999-000-001",
      active: true,
      createdAt: new Date("2024-01-01"),
      permissions: rolePermissions.admin,
    },
    owner: {
      id: "owner-1",
      name: "Priya Sharma",
      username: "priya",
      email: "priya@architectfirm.com",
      role: "owner",
      company: "Sharma Architecture",
      avatar: "👩",
      phone: "+91-9876-543-210",
      active: true,
      createdAt: new Date("2024-01-15"),
      permissions: rolePermissions.owner,
    },
    employee: {
      id: "emp-1",
      name: "Rajesh Kumar",
      username: "rajesh",
      email: "rajesh@architectfirm.com",
      role: "employee",
      company: "Sharma Architecture",
      avatar: "👨",
      phone: "+91-9234-567-890",
      active: true,
      createdAt: new Date("2024-02-01"),
      permissions: rolePermissions.employee,
    },
    user: {
      id: "user-1",
      name: "Anil Patel",
      username: "anil",
      email: "anil@realestate.com",
      role: "user",
      company: "Patel Constructions",
      avatar: "👤",
      phone: "+91-9111-222-333",
      active: true,
      createdAt: new Date("2024-02-10"),
      permissions: rolePermissions.user,
    },
  }
  return mockUsers[role]
}
