"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, MoreVertical, Mail, User, Trash2, Shield, X } from "lucide-react"

interface TeamMember {
  id: number
  name: string
  role: string
  email: string
  status: "Active" | "Inactive"
  joinDate?: string
  permissions?: string[]
}

export default function TeamsPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: 1,
      name: "John Doe",
      role: "Project Manager",
      email: "john@operahub.com",
      status: "Active",
      joinDate: "2024-01-15",
      permissions: ["Projects", "Teams", "Billing"],
    },
    {
      id: 2,
      name: "Sarah Smith",
      role: "Architect",
      email: "sarah@operahub.com",
      status: "Active",
      joinDate: "2024-02-20",
      permissions: ["Projects", "Tasks"],
    },
    {
      id: 3,
      name: "Mike Johnson",
      role: "Engineer",
      email: "mike@operahub.com",
      status: "Active",
      joinDate: "2024-03-10",
      permissions: ["Projects", "Tasks", "Reports"],
    },
    {
      id: 4,
      name: "Emily Brown",
      role: "Account Manager",
      email: "emily@operahub.com",
      status: "Inactive",
      joinDate: "2024-04-05",
      permissions: ["Clients", "Billing"],
    },
  ])

  const [selectedMember, setSelectedMember] = useState<number | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newMember, setNewMember] = useState({ name: "", email: "", role: "" })

  const handleAddMember = () => {
    if (newMember.name && newMember.email && newMember.role) {
      setTeamMembers([
        ...teamMembers,
        {
          id: Math.max(...teamMembers.map((m) => m.id), 0) + 1,
          ...newMember,
          status: "Active",
          joinDate: new Date().toISOString().split("T")[0],
          permissions: [],
        },
      ])
      setNewMember({ name: "", email: "", role: "" })
      setShowAddForm(false)
    }
  }

  const toggleMemberStatus = (id: number) => {
    setTeamMembers(
      teamMembers.map((m) => (m.id === id ? { ...m, status: m.status === "Active" ? "Inactive" : "Active" } : m)),
    )
  }

  const removeMember = (id: number) => {
    setTeamMembers(teamMembers.filter((m) => m.id !== id))
    setSelectedMember(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Teams</h1>
          <p className="text-muted-foreground">Manage your team members and permissions</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Member
        </Button>
      </div>

      {/* Add Member Form */}
      {showAddForm && (
        <Card className="p-6 bg-secondary/30 border-primary/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Add New Team Member</h3>
            <button onClick={() => setShowAddForm(false)} className="p-1 hover:bg-secondary rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <Input
              placeholder="Full Name"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
            />
            <Input
              type="email"
              placeholder="Email Address"
              value={newMember.email}
              onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
            />
            <Input
              placeholder="Role (e.g., Architect, Engineer)"
              value={newMember.role}
              onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
            />
            <div className="flex gap-3">
              <Button onClick={handleAddMember} className="flex-1">
                Add Member
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Team Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-6">
          <p className="text-xs text-muted-foreground mb-1">Total Members</p>
          <p className="text-3xl font-bold">{teamMembers.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-xs text-muted-foreground mb-1">Active</p>
          <p className="text-3xl font-bold text-green-600">{teamMembers.filter((m) => m.status === "Active").length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-xs text-muted-foreground mb-1">Inactive</p>
          <p className="text-3xl font-bold text-red-600">{teamMembers.filter((m) => m.status === "Inactive").length}</p>
        </Card>
      </div>

      {/* Team Members List */}
      <div className="grid gap-6">
        {teamMembers.map((member) => (
          <Card
            key={member.id}
            className={`p-6 transition-all cursor-pointer ${
              selectedMember === member.id ? "border-primary/50 bg-primary/5" : "hover:border-primary/50"
            }`}
            onClick={() => setSelectedMember(selectedMember === member.id ? null : member.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{member.role}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    {member.email}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    member.status === "Active" ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-700"
                  }`}
                >
                  {member.status}
                </span>
                <button className="p-2 hover:bg-secondary rounded-lg">
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Expanded Details */}
            {selectedMember === member.id && (
              <div className="pt-4 border-t border-border space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Join Date</p>
                  <p className="text-sm text-muted-foreground">{member.joinDate}</p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Permissions</p>
                  <div className="flex flex-wrap gap-2">
                    {member.permissions && member.permissions.length > 0 ? (
                      member.permissions.map((perm) => (
                        <span
                          key={perm}
                          className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium"
                        >
                          {perm}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No permissions set</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleMemberStatus(member.id)
                    }}
                    className="flex-1 gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    {member.status === "Active" ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeMember(member.id)
                    }}
                    className="flex-1 gap-2 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
