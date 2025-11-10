"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, AlertCircle, Wallet, Building2, Calendar, LineChart, PieChart } from "lucide-react"
import Link from "next/link"

export default function OwnerDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Owner Dashboard</h1>
        <p className="text-muted-foreground">Financial performance and business insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold">₹85.2L</p>
            <p className="text-xs text-green-600">+22% YoY growth</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Pending Approvals</p>
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold">8</p>
            <p className="text-xs text-yellow-600">₹12.5L pending approval</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Outstanding Dues</p>
              <Wallet className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold">₹28.3L</p>
            <p className="text-xs text-orange-600">From 12 invoices</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Active Projects</p>
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">18</p>
            <p className="text-xs text-primary">5 at critical stage</p>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Revenue Trends */}
        <Card className="p-6 md:col-span-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <LineChart className="w-5 h-5" />
                Revenue Trends (6 Months)
              </h2>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
            <div className="h-64 bg-secondary/30 rounded-lg flex items-center justify-center text-muted-foreground">
              Revenue chart placeholder - Connect to API
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link href="/dashboard/owner/approvals">
              <Button className="w-full justify-start text-left bg-transparent" variant="outline">
                ✓ Approve Invoices (8)
              </Button>
            </Link>
            <Link href="/dashboard/billing">
              <Button className="w-full justify-start text-left bg-transparent" variant="outline">
                💰 View Outstanding
              </Button>
            </Link>
            <Link href="/dashboard/projects">
              <Button className="w-full justify-start text-left bg-transparent" variant="outline">
                🏗️ Project Status
              </Button>
            </Link>
            <Link href="/dashboard/owner/analytics">
              <Button className="w-full justify-start text-left bg-transparent" variant="outline">
                📊 Analytics
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Project Profitability */}
      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <PieChart className="w-5 h-5" />
          Project Profitability Analysis
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { name: "Residential Complex - Bandra", profit: "₹45L", margin: "28%", status: "on-track" },
            { name: "Commercial Tower - BKC", profit: "₹32L", margin: "22%", status: "on-track" },
            { name: "Mixed-Use Development", profit: "₹8.2L", margin: "12%", status: "delayed" },
          ].map((project, i) => (
            <Card key={i} className="p-4 border border-border/50">
              <h3 className="font-semibold text-sm mb-2">{project.name}</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">Profit: </span>
                  <strong>{project.profit}</strong>
                </p>
                <p>
                  <span className="text-muted-foreground">Margin: </span>
                  <strong>{project.margin}</strong>
                </p>
                <p
                  className={`text-xs font-semibold ${project.status === "on-track" ? "text-green-600" : "text-yellow-600"}`}
                >
                  {project.status === "on-track" ? "✓ On Track" : "⚠ Delayed"}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Payment Calendar */}
      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Upcoming Payment Due Dates
        </h2>
        <div className="space-y-2">
          {[
            { date: "Dec 15, 2024", amount: "₹8.5L", client: "Bandra Residency", invoice: "INV-2024-045" },
            { date: "Dec 20, 2024", amount: "₹12.3L", client: "BKC Tower", invoice: "INV-2024-046" },
            { date: "Dec 28, 2024", amount: "₹5.2L", client: "Mixed-Use Dev", invoice: "INV-2024-047" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
              <div>
                <p className="text-sm font-medium">{item.client}</p>
                <p className="text-xs text-muted-foreground">{item.invoice}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{item.amount}</p>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
