"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Users, AlertCircle, CheckCircle2, DollarSign, TrendingUp, Settings } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">System overview and management controls</p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Total Users</p>
              <Users className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">28</p>
            <p className="text-xs text-green-600">+3 this month</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Pending Approvals</p>
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold">12</p>
            <p className="text-xs text-yellow-600">Require action</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Revenue (Month)</p>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold">₹42.5L</p>
            <p className="text-xs text-green-600">+15% vs last month</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Active Projects</p>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold">18</p>
            <p className="text-xs text-blue-600">5 completing soon</p>
          </div>
        </Card>
      </div>

      {/* Admin Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* User Management */}
        <Card className="p-6 border-2 border-primary/20 hover:border-primary/40 transition-colors">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold">User Management</h2>
            </div>
            <p className="text-muted-foreground">Create, edit, and manage user accounts and roles</p>
            <Link href="/dashboard/admin/users">
              <Button className="w-full">Manage Users</Button>
            </Link>
          </div>
        </Card>

        {/* Approval Workflows */}
        <Card className="p-6 border-2 border-yellow-600/20 hover:border-yellow-600/40 transition-colors">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-yellow-600" />
              <h2 className="text-xl font-bold">Approvals</h2>
            </div>
            <p className="text-muted-foreground">Review and approve pending invoices, payments, and projects</p>
            <Link href="/dashboard/admin/approvals">
              <Button className="w-full bg-transparent" variant="outline">
                View Pending (12)
              </Button>
            </Link>
          </div>
        </Card>

        {/* Analytics */}
        <Card className="p-6 border-2 border-blue-600/20 hover:border-blue-600/40 transition-colors">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold">Analytics</h2>
            </div>
            <p className="text-muted-foreground">View comprehensive system reports and metrics</p>
            <Link href="/dashboard/admin/analytics">
              <Button className="w-full bg-transparent" variant="outline">
                View Analytics
              </Button>
            </Link>
          </div>
        </Card>

        {/* System Settings */}
        <Card className="p-6 border-2 border-purple-600/20 hover:border-purple-600/40 transition-colors">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Settings className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold">System Settings</h2>
            </div>
            <p className="text-muted-foreground">Configure system-wide settings and integrations</p>
            <Link href="/dashboard/admin/settings">
              <Button className="w-full bg-transparent" variant="outline">
                Settings
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { action: "Invoice #INV-001 approved", time: "2 hours ago", status: "approved" },
            { action: "New user Anita Verma added", time: "4 hours ago", status: "neutral" },
            { action: "Payment of ₹5L received", time: "1 day ago", status: "success" },
            { action: "Project deadline extended", time: "2 days ago", status: "neutral" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
              <p className="text-sm">{item.action}</p>
              <p className="text-xs text-muted-foreground">{item.time}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
