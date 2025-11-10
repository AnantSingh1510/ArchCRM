"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card } from "@/components/ui/card"
import {
  Building2,
  Users,
  FileText,
  BarChart3,
  TrendingUp,
  Clock,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from "lucide-react"
import withAuth from "@/components/withAuth"

function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<any[]>([])
  const [recentProjects, setRecentProjects] = useState<any[]>([])
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          fetch("http://localhost:3000/project"),
          fetch("http://localhost:3000/task"),
        ]);

        const projects = await projectsRes.json();
        const tasks = await tasksRes.json();

        setStats([
          {
            icon: Building2,
            label: "Active Projects",
            value: projects.length,
            change: "+2",
            changeType: "up",
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50",
          },
          {
            icon: Users,
            label: "Total Clients",
            value: "28", // Mock data
            change: "+4",
            changeType: "up",
            color: "from-green-500 to-green-600",
            bgColor: "bg-green-50",
          },
          {
            icon: FileText,
            label: "Pending Tasks",
            value: tasks.filter((t: any) => t.status === "PENDING").length,
            change: "-3",
            changeType: "down",
            color: "from-orange-500 to-orange-600",
            bgColor: "bg-orange-50",
          },
          {
            icon: BarChart3,
            label: "Revenue (Current Month)",
            value: "₹145.2L", // Mock data
            change: "+12%",
            changeType: "up",
            color: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-50",
          },
        ]);

        setRecentProjects(projects.slice(0, 3));
        setPendingApprovals([
          { type: "Invoice", amount: "₹5.2L", status: "Pending", date: "2 days ago" },
          { type: "Payment", amount: "₹12.5L", status: "Pending", date: "1 day ago" },
          { type: "Project", amount: "New Client", status: "Pending", date: "3 days ago" },
        ]);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Welcome back, {user?.username}!</h1>
        <p className="text-slate-600">
          Here's your operational overview for{" "}
          {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Stats Grid - Enhanced Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          const isPositive = stat.changeType === "up"
          return (
            <Card
              key={i}
              className={`p-6 border-0 bg-white hover:shadow-lg transition-all duration-300 ${stat.bgColor}/10`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                    isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
              <p className="text-slate-600 text-sm mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            </Card>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <Card className="p-6 border-0 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Active Projects</h2>
              <a href="/dashboard/projects" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                View All →
              </a>
            </div>
            <div className="space-y-4">
              {recentProjects.map((project, i) => (
                <div
                  key={i}
                  className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{project.name}</h3>
                      <p className="text-sm text-slate-500">{project.client}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          project.status === "In Progress" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {project.timeline}
                      </div>
                      <div>{project.budget}</div>
                    </div>
                    <span>{project.progress}%</span>
                  </div>

                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Pending Approvals */}
        <div>
          <Card className="p-6 border-0 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Pending Approvals</h2>
              <AlertCircle className="w-5 h-5 text-orange-500" />
            </div>
            <div className="space-y-3">
              {pendingApprovals.map((item, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200"
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-sm font-semibold text-slate-900">{item.type}</span>
                    <span className="text-xs text-slate-500">{item.date}</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{item.amount}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-xs text-orange-700 font-medium">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { icon: TrendingUp, label: "This Month", value: "₹42.5L", bg: "from-blue-500 to-blue-600" },
          { icon: Users, label: "Team Members", value: "8", bg: "from-green-500 to-green-600" },
          { icon: Clock, label: "Avg. Project Time", value: "4.2 months", bg: "from-orange-500 to-orange-600" },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={i} className="p-6 border-0 bg-white shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.bg}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default withAuth(DashboardPage)
