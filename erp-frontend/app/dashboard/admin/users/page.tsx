"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Plus, Search, Edit, Trash2, Mail, Shield, CheckCircle, XCircle } from "lucide-react"
import type { User, UserRole } from "@/lib/auth-context"
import withRole from "@/components/withRole"

function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    role: "employee" as UserRole,
    password: "",
  })

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const res = await fetch("http://localhost:3000/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        } else {
          setError("Failed to fetch users");
        }
      } catch (error) {
        setError("An unexpected error occurred. Please try again.");
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddUser = () => {
    setEditingUser(null)
    setFormData({ name: "", username: "", email: "", phone: "", role: "employee", password: "" })
    setShowForm(true)
  }

  const handleSaveUser = async () => {
    if (!formData.name || !formData.email || !formData.username) return;

    const url = editingUser
      ? `http://localhost:3000/user/${editingUser.id}`
      : "http://localhost:3000/user";
    const method = editingUser ? "PATCH" : "POST";

    const dataToSend: any = { ...formData };
    if (editingUser && !dataToSend.password) {
      delete dataToSend.password;
    }

    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (res.ok) {
        const data = await res.json();
        if (editingUser) {
          setUsers(users.map((u) => (u.id === editingUser.id ? data : u)));
        } else {
          setUsers([...users, data]);
        }
        setShowForm(false);
      } else {
        setError("Failed to save user");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      password: "",
    })
    setShowForm(true)
  }

  const handleToggleUser = async (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`http://localhost:3000/user/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ active: !user.active }),
      });

      if (res.ok) {
        setUsers(
          users.map((u) =>
            u.id === userId ? { ...u, active: !u.active } : u
          )
        );
      } else {
        setError("Failed to toggle user status");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`http://localhost:3000/user/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setUsers(users.filter((u) => u.id !== userId));
      } else {
        setError("Failed to delete user");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const getRoleColor = (role: UserRole) => {
    const colors: Record<UserRole, string> = {
      admin: "bg-red-100 text-red-800",
      owner: "bg-blue-100 text-blue-800",
      employee: "bg-green-100 text-green-800",
      user: "bg-gray-100 text-gray-800",
    }
    return colors[role]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="w-8 h-8 text-primary" />
            User Management
          </h1>
          <p className="text-muted-foreground">Manage team members and their roles</p>
        </div>
        <Button onClick={handleAddUser} className="gap-2">
          <Plus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="p-6 border border-primary/20 bg-primary/5">
          <h2 className="text-lg font-semibold mb-4">{editingUser ? "Edit User" : "Create New User"}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <Input
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91-9999-999-999"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              >
                <option value="employee">Employee</option>
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder={editingUser ? "New password (leave blank to keep current)" : "••••••••"}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleSaveUser}>Save User</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Search Bar */}
      <Card className="p-4 border border-border">
        <div className="flex gap-2">
          <Search className="w-5 h-5 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users by name or email..."
            className="border-0 bg-transparent"
          />
        </div>
      </Card>

      {/* Users Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary/50 border-b border-border">
                <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Joined</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleToggleUser(user.id)}
                      className="flex items-center gap-2 hover:opacity-70 transition-opacity"
                    >
                      {user.active ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-green-600">Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-600" />
                          <span className="text-red-600">Inactive</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-primary" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Users</p>
              <p className="text-3xl font-bold">{users.length}</p>
            </div>
            <Users className="w-8 h-8 text-primary/20" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Active</p>
              <p className="text-3xl font-bold text-green-600">{users.filter((u) => u.active).length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600/20" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Inactive</p>
              <p className="text-3xl font-bold text-red-600">{users.filter((u) => !u.active).length}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-600/20" />
          </div>
        </Card>
      </div>
    </div>
  )
}

export default withRole("admin")(UserManagementPage)
