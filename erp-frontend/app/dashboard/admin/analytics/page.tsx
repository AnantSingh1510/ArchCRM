"use client"

import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card } from "@/components/ui/card"
import { BarChart3, TrendingUp, Users, FileText, AlertCircle, Calendar } from "lucide-react"
import withRole from "@/components/withRole"

function AnalyticsPage() {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3000/analytics/dashboard")
        if (res.ok) {
          const data = await res.json()
          setData(data)
        } else {
          setError("Failed to fetch analytics data")
        }
      } catch (error) {
        setError("An unexpected error occurred. Please try again.")
      }
    }

    fetchData()
  }, [])

  if (error) {
    return <p className="text-destructive">{error}</p>
  }

  if (!data) {
    return <div>Loading...</div>
  }

  const { kpis, projectStatusData, revenueData, clientGrowthData, teamPerformanceData } = data

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">Business Analytics</h1>
          <p className="text-slate-600">Comprehensive insights and KPI tracking</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-medium hover:bg-slate-200">Q2 2024</button>
          <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">Last 6 Months</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        {kpis.map((kpi: any, i: number) => {
          const icons: { [key: string]: React.ElementType } = {
            BarChart3,
            FileText,
            Users,
            TrendingUp,
          };
          const Icon = icons[kpi.icon] || BarChart3
          return (
            <Card key={i} className="p-6 bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${kpi.color} w-fit mb-4`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm text-slate-600 mb-2">{kpi.label}</p>
              <div className="flex items-baseline justify-between">
                <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">{kpi.change}</span>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card className="p-6 bg-white border-0 shadow-sm">
          <h2 className="text-lg font-bold mb-4 text-slate-900">Revenue vs Target vs Expense</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
                labelStyle={{ color: "#f3f4f6" }}
              />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="target" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Project Status Distribution */}
        <Card className="p-6 bg-white border-0 shadow-sm">
          <h2 className="text-lg font-bold mb-4 text-slate-900">Project Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={projectStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {projectStatusData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Client Growth & Team Performance */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Client Growth */}
        <Card className="p-6 bg-white border-0 shadow-sm">
          <h2 className="text-lg font-bold mb-4 text-slate-900">Client Growth Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={clientGrowthData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
                labelStyle={{ color: "#f3f4f6" }}
              />
              <Legend />
              <Bar dataKey="clients" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="activeClients" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Team Performance */}
        <Card className="p-6 bg-white border-0 shadow-sm">
          <h2 className="text-lg font-bold mb-4 text-slate-900">Team Performance Metrics</h2>
          <div className="space-y-4">
            {teamPerformanceData.map((team: any, i: number) => (
              <div key={i} className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-900">{team.team}</span>
                  <span className={`text-sm font-bold ${team.efficiency >= 85 ? "text-green-600" : "text-orange-600"}`}>
                    {team.efficiency}% Efficient
                  </span>
                </div>
                <div className="flex gap-2 text-xs text-slate-600 mb-2">
                  <span>✓ {team.completed} Completed</span>
                  <span>⏳ {team.pending} Pending</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${team.efficiency >= 85 ? "from-green-500 to-green-600" : "from-orange-500 to-orange-600"}`}
                    style={{ width: `${team.efficiency}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Financial Summary & Key Insights */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Financial Summary */}
        <Card className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 border-0">
          <h2 className="text-lg font-bold mb-4 text-slate-900">Financial Summary</h2>
          <div className="space-y-3">
            {[
              { label: "Total Revenue", value: "₹18.4Cr", prev: "₹14.2Cr", change: "+29%" },
              { label: "Total Expenses", value: "₹6.2Cr", prev: "₹5.1Cr", change: "+22%" },
              { label: "Gross Profit", value: "₹12.2Cr", prev: "₹9.1Cr", change: "+34%" },
              { label: "Profit Margin", value: "66.3%", prev: "64.1%", change: "+2.2%" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white">
                <div>
                  <p className="text-xs text-slate-600">{item.label}</p>
                  <p className="text-lg font-bold text-slate-900">{item.value}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">vs {item.prev}</p>
                  <p className="text-sm font-semibold text-green-600">{item.change}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Key Insights & Alerts */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-0">
          <h2 className="text-lg font-bold mb-4 text-slate-900">Key Insights & Alerts</h2>
          <div className="space-y-3">
            {[
              {
                icon: TrendingUp,
                title: "Revenue Growth",
                desc: "Revenue increased 28% YoY",
                color: "bg-green-100 text-green-700",
              },
              {
                icon: AlertCircle,
                title: "Project Delays",
                desc: "2 projects behind schedule",
                color: "bg-orange-100 text-orange-700",
              },
              {
                icon: Users,
                title: "Team Expansion",
                desc: "Added 4 new team members",
                color: "bg-blue-100 text-blue-700",
              },
              {
                icon: Calendar,
                title: "Upcoming Review",
                desc: "Quarterly review scheduled",
                color: "bg-purple-100 text-purple-700",
              },
            ].map((insight, i) => {
              const Icon = insight.icon
              return (
                <div key={i} className="p-3 rounded-lg bg-white border-l-4 border-slate-200">
                  <div className="flex gap-3">
                    <div className={`p-2 rounded ${insight.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 text-sm">{insight.title}</p>
                      <p className="text-xs text-slate-600">{insight.desc}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default withRole("admin")(AnalyticsPage)
