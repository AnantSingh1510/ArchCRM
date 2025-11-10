"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, DollarSign, AlertCircle, Home } from "lucide-react"
import Link from "next/link"

export default function UserClientDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Your Projects & Invoices</h1>
        <p className="text-muted-foreground">Track your purchases and project progress</p>
      </div>

      {/* Key Info */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Total Invoices</p>
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">6</p>
            <p className="text-xs text-muted-foreground">3 unpaid</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Outstanding</p>
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold">₹15.5L</p>
            <p className="text-xs text-orange-600">Due within 30 days</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Active Properties</p>
              <Home className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold">3</p>
            <p className="text-xs text-green-600">Under development</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Documents</p>
              <AlertCircle className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold">12</p>
            <p className="text-xs text-blue-600">Ready to download</p>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Pending Invoices */}
        <Card className="p-6 md:col-span-2">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Your Invoices
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-2">Invoice</th>
                  <th className="text-left py-2 px-2">Amount</th>
                  <th className="text-left py-2 px-2">Due Date</th>
                  <th className="text-left py-2 px-2">Status</th>
                  <th className="text-left py-2 px-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: "INV-001", amount: "₹5.5L", due: "Dec 15", status: "overdue" },
                  { id: "INV-002", amount: "₹8.2L", due: "Dec 20", status: "pending" },
                  { id: "INV-003", amount: "₹3.1L", due: "Jan 10", status: "pending" },
                  { id: "INV-004", amount: "₹4.5L", due: "Jan 20", status: "paid" },
                ].map((inv, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="py-3 px-2 font-medium">{inv.id}</td>
                    <td className="py-3 px-2">{inv.amount}</td>
                    <td className="py-3 px-2">{inv.due}</td>
                    <td className="py-3 px-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-semibold ${
                          inv.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : inv.status === "overdue"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <Link href={`/dashboard/user-client/invoice/${inv.id}`}>
                        <button className="text-primary hover:underline text-xs font-medium">View</button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link href="/dashboard/billing">
            <Button className="w-full mt-4 bg-transparent" variant="outline">
              View All Invoices
            </Button>
          </Link>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Actions</h2>
          <div className="space-y-2">
            <Link href="/dashboard/billing">
              <Button className="w-full justify-start text-left bg-transparent" variant="outline">
                📄 View Invoices
              </Button>
            </Link>
            <Link href="/dashboard/user-client/payment-plans">
              <Button className="w-full justify-start text-left bg-transparent" variant="outline">
                💳 Payment Plans
              </Button>
            </Link>
            <Link href="/dashboard/projects">
              <Button className="w-full justify-start text-left bg-transparent" variant="outline">
                🏗️ Progress
              </Button>
            </Link>
            <Link href="/dashboard/user-client/communication">
              <Button className="w-full justify-start text-left bg-transparent" variant="outline">
                💬 Message
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Properties */}
      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Home className="w-5 h-5" />
          Your Properties
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { name: "Bandra Residency - Unit 501", area: "2,500 sq.ft", price: "₹5.5Cr", progress: "75%" },
            { name: "BKC Tower - Office Space", area: "8,000 sq.ft", price: "₹12.2Cr", progress: "45%" },
            { name: "Mixed-Use - Retail Unit", area: "1,200 sq.ft", price: "₹2.8Cr", progress: "60%" },
          ].map((prop, i) => (
            <Card key={i} className="p-4 border border-border/50">
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">{prop.name}</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Area: {prop.area}</p>
                  <p className="font-semibold text-foreground">Price: {prop.price}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span>{prop.progress}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary rounded-full h-2" style={{ width: prop.progress }} />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  )
}
