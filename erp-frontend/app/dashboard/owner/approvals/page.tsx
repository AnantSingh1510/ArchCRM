"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, FileText, DollarSign } from "lucide-react"

export default function OwnerApprovalsPage() {
  const pendingApprovals = [
    {
      id: "1",
      type: "invoice",
      number: "INV-2024-001",
      amount: 500000,
      client: "Bandra Residency",
      status: "pending",
      requestedBy: "Rajesh Kumar",
      date: new Date(Date.now() - 3600000),
    },
    {
      id: "2",
      type: "payment",
      number: "PAY-2024-001",
      amount: 1833333,
      client: "BKC Tower",
      status: "pending",
      requestedBy: "Finance Team",
      date: new Date(Date.now() - 7200000),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Pending Approvals</h1>
        <p className="text-muted-foreground">Invoice and payment approvals requiring your attention</p>
      </div>

      {/* Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Pending Amount</p>
            <p className="text-3xl font-bold">₹23.3L</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Pending Count</p>
            <p className="text-3xl font-bold">{pendingApprovals.length}</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Oldest Request</p>
            <p className="text-3xl font-bold">2 hrs</p>
          </div>
        </Card>
      </div>

      {/* Pending Items */}
      <div className="space-y-3">
        {pendingApprovals.map((item) => (
          <Card key={item.id} className="p-6 border hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div
                  className={`p-3 rounded-lg ${item.type === "invoice" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}
                >
                  {item.type === "invoice" ? <FileText className="w-6 h-6" /> : <DollarSign className="w-6 h-6" />}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{item.number}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.client} • From: {item.requestedBy}
                  </p>
                  <p className="text-2xl font-bold mt-2">₹{(item.amount / 100000).toFixed(1)}L</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="gap-2" size="sm">
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </Button>
                <Button variant="outline" size="sm">
                  Decline
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
