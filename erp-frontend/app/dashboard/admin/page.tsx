"use client"

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Users, AlertCircle, CheckCircle2, DollarSign, TrendingUp, Settings } from "lucide-react"
import Link from "next/link"
import withRole from "@/components/withRole"

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingApprovals: 0,
    monthlyRevenue: 0,
    activeProjects: 0,
    usersThisMonth: 0,
    revenueGrowth: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const [usersRes, projectsRes, bookingsRes, paymentsRes, approvalsRes] = await Promise.all([
          axios.get('http://localhost:3000/user', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:3000/project', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:3000/booking', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:3000/payment/all', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:3000/approval', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const users = usersRes.data;
        const projects = projectsRes.data;
        const bookings = bookingsRes.data;
        const payments = paymentsRes.data;

        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

        const usersThisMonth = users.filter((u: any) => new Date(u.createdAt) > oneMonthAgo).length;
        const monthlyRevenue = payments
          .filter((p: any) => new Date(p.date) > oneMonthAgo)
          .reduce((acc: number, p: any) => acc + p.amount, 0);

        setStats({
          totalUsers: users.length,
          pendingApprovals: approvalsRes.data.filter((a: any) => a.status === 'PENDING').length,
          monthlyRevenue,
          activeProjects: projects.filter((p: any) => p.status === 'IN_PROGRESS').length,
          usersThisMonth,
          revenueGrowth: 15, // Placeholder
        });

        const combinedActivity = [
          ...bookings.map((b: any) => ({
            action: `New booking for ${b.project.name}`,
            time: new Date(b.createdAt),
            status: 'neutral',
          })),
          ...payments.map((p: any) => ({
            action: `Payment of ₹${p.amount.toLocaleString()} received`,
            time: new Date(p.date),
            status: 'success',
          })),
          ...approvalsRes.data.map((a: any) => ({
            action: `New ${a.type.toLowerCase()} approval request`,
            time: new Date(a.createdAt),
            status: 'neutral',
          })),
        ].sort((a, b) => b.time.getTime() - a.time.getTime());

        setRecentActivity(combinedActivity.slice(0, 5).map(activity => ({
          ...activity,
          time: `${Math.floor((new Date().getTime() - activity.time.getTime()) / (1000 * 60 * 60))} hours ago`,
        })));

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
            <p className="text-xs text-green-600">+{stats.usersThisMonth} this month</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Pending Approvals</p>
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold">{stats.pendingApprovals}</p>
            <p className="text-xs text-yellow-600">Require action</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Revenue (Month - Recieved online)</p>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold">₹{(stats.monthlyRevenue / 100000).toFixed(1)}L</p>
            <p className="text-xs text-green-600">+{stats.revenueGrowth}% vs last month</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Active Projects</p>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold">{stats.activeProjects}</p>
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
                View Pending ({stats.pendingApprovals})
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
            <Link href="/dashboard/settings">
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
          {recentActivity.map((item: any, i) => (
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

export default withRole("analytics", "read")(AdminDashboard)
