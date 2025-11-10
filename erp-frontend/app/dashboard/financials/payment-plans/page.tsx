"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { CheckCircle, AlertCircle, DollarSign, TrendingUp } from "lucide-react"
import type { PaymentPlan } from "@/lib/types"

export default function PaymentPlansPage() {
  const [paymentPlans] = useState<PaymentPlan[]>([
    {
      id: "pp-1",
      totalAmount: 5500000,
      startDate: new Date("2024-11-01"),
      endDate: new Date("2025-02-01"),
      installments: [
        {
          id: "i1",
          number: 1,
          amount: 1833333,
          dueDate: new Date("2024-12-01"),
          status: "paid",
          paidDate: new Date("2024-11-28"),
        },
        { id: "i2", number: 2, amount: 1833333, dueDate: new Date("2025-01-01"), status: "pending" },
        { id: "i3", number: 3, amount: 1833334, dueDate: new Date("2025-02-01"), status: "pending" },
      ],
    },
    {
      id: "pp-2",
      totalAmount: 9040000,
      startDate: new Date("2024-11-05"),
      endDate: new Date("2025-05-05"),
      installments: [
        { id: "i1", number: 1, amount: 1808000, dueDate: new Date("2024-12-05"), status: "overdue" },
        { id: "i2", number: 2, amount: 1808000, dueDate: new Date("2025-01-05"), status: "pending" },
        { id: "i3", number: 3, amount: 1808000, dueDate: new Date("2025-02-05"), status: "pending" },
        { id: "i4", number: 4, amount: 1808000, dueDate: new Date("2025-03-05"), status: "pending" },
        { id: "i5", number: 5, amount: 1808000, dueDate: new Date("2025-04-05"), status: "pending" },
      ],
    },
  ])

  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null)

  const getTotalPaid = (plan: PaymentPlan) => {
    return plan.installments.filter((i) => i.status === "paid").reduce((sum, i) => sum + i.amount, 0)
  }

  const getTotalPending = (plan: PaymentPlan) => {
    return plan.installments.filter((i) => i.status !== "paid").reduce((sum, i) => sum + i.amount, 0)
  }

  const getOverdueAmount = (plan: PaymentPlan) => {
    return plan.installments.filter((i) => i.status === "overdue").reduce((sum, i) => sum + i.amount, 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Payment Plans</h1>
        <p className="text-muted-foreground">Manage installment schedules and track payments</p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Total Planned
            </p>
            <p className="text-3xl font-bold">₹145.4L</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Total Collected
            </p>
            <p className="text-3xl font-bold text-green-600">₹56.7L</p>
            <p className="text-xs text-green-600">39% collected</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Pending
            </p>
            <p className="text-3xl font-bold text-blue-600">₹88.7L</p>
            <p className="text-xs text-blue-600">61% remaining</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              Overdue
            </p>
            <p className="text-3xl font-bold text-red-600">₹18.1L</p>
            <p className="text-xs text-red-600">2 overdue installments</p>
          </div>
        </Card>
      </div>

      {/* Payment Plans List */}
      <div className="space-y-4">
        {paymentPlans.map((plan) => (
          <Card
            key={plan.id}
            className="p-6 border hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => setSelectedPlan(selectedPlan?.id === plan.id ? null : plan)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">Payment Plan - {plan.id}</h3>
                <p className="text-sm text-muted-foreground">
                  {plan.startDate.toLocaleDateString()} to {plan.endDate.toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">₹{(plan.totalAmount / 100000).toFixed(1)}L</p>
                <p className="text-sm text-muted-foreground">{plan.installments.length} installments</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Progress: {Math.round((getTotalPaid(plan) / plan.totalAmount) * 100)}%</span>
                <span>
                  ₹{(getTotalPaid(plan) / 100000).toFixed(1)}L / ₹{(plan.totalAmount / 100000).toFixed(1)}L
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-3">
                <div
                  className="bg-primary rounded-full h-3 transition-all"
                  style={{ width: `${(getTotalPaid(plan) / plan.totalAmount) * 100}%` }}
                />
              </div>
            </div>

            {/* Expandable Details */}
            {selectedPlan?.id === plan.id && (
              <div className="mt-6 pt-6 border-t border-border space-y-3">
                {plan.installments.map((inst) => (
                  <div key={inst.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <div className="flex items-center gap-4 flex-1">
                      <div>
                        <p className="font-semibold">Installment {inst.number}</p>
                        <p className="text-sm text-muted-foreground">Due: {inst.dueDate.toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{inst.amount.toLocaleString()}</p>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded mt-1 inline-block ${
                          inst.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : inst.status === "overdue"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {inst.status === "paid" ? "✓ Paid" : inst.status === "overdue" ? "⚠ Overdue" : "Pending"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
