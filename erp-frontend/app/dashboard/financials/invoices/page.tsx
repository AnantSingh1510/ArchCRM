"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Download, Eye, Filter, Printer } from "lucide-react"
import type { Invoice } from "@/lib/types"

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "inv-1",
      number: "INV-2024-001",
      clientId: "client-1",
      projectId: "proj-1",
      amount: 500000,
      subtotal: 500000,
      gst: 90000,
      tds: 25000,
      total: 565000,
      status: "pending_approval",
      issueDate: new Date("2024-11-01"),
      dueDate: new Date("2024-12-01"),
      lineItems: [
        { id: "1", description: "Design Services", quantity: 1, rate: 300000, amount: 300000, gstRate: 18 },
        { id: "2", description: "Site Management", quantity: 1, rate: 200000, amount: 200000, gstRate: 18 },
      ],
      createdBy: "admin-1",
      createdAt: new Date("2024-11-01"),
    },
    {
      id: "inv-2",
      number: "INV-2024-002",
      clientId: "client-1",
      projectId: "proj-1",
      amount: 800000,
      subtotal: 800000,
      gst: 144000,
      tds: 40000,
      total: 904000,
      status: "approved",
      issueDate: new Date("2024-11-05"),
      dueDate: new Date("2024-12-05"),
      lineItems: [
        { id: "1", description: "Construction Materials", quantity: 1, rate: 500000, amount: 500000, gstRate: 18 },
        { id: "2", description: "Labor Charges", quantity: 1, rate: 300000, amount: 300000, gstRate: 18 },
      ],
      createdBy: "admin-1",
      createdAt: new Date("2024-11-05"),
    },
  ])

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const filteredInvoices = filterStatus === "all" ? invoices : invoices.filter((inv) => inv.status === filterStatus)

  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800",
    pending_approval: "bg-yellow-100 text-yellow-800",
    approved: "bg-blue-100 text-blue-800",
    sent: "bg-purple-100 text-purple-800",
    paid: "bg-green-100 text-green-800",
    overdue: "bg-red-100 text-red-800",
  }

  const calculatePaymentSchedule = (total: number, months = 3) => {
    const monthlyAmount = Math.round(total / months)
    return Array.from({ length: months }, (_, i) => ({
      id: `inst-${i + 1}`,
      number: i + 1,
      amount: i === months - 1 ? total - monthlyAmount * (months - 1) : monthlyAmount,
      dueDate: new Date(Date.now() + (i + 1) * 30 * 24 * 60 * 60 * 1000),
      status: i === 0 ? ("paid" as const) : ("pending" as const),
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Invoices & Billing</h1>
          <p className="text-muted-foreground">Manage invoices with GST, TDS, and payment plans</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Invoice
        </Button>
      </div>

      {/* Create Invoice Form */}
      {showCreateForm && (
        <Card className="p-6 bg-primary/5 border-2 border-primary/20">
          <h2 className="text-lg font-bold mb-4">Create New Invoice</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Client</label>
              <select className="w-full px-3 py-2 border border-border rounded-lg bg-background">
                <option>Select Client</option>
                <option>Bandra Residency</option>
                <option>BKC Tower</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Project</label>
              <select className="w-full px-3 py-2 border border-border rounded-lg bg-background">
                <option>Select Project</option>
                <option>Residential Complex</option>
                <option>Commercial Tower</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Invoice Amount</label>
              <Input type="number" placeholder="500,000" />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">GST %</label>
              <select className="w-full px-3 py-2 border border-border rounded-lg bg-background">
                <option>18%</option>
                <option>12%</option>
                <option>5%</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">TDS %</label>
              <Input type="number" placeholder="2" defaultValue="2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Payment Terms (Days)</label>
              <Input type="number" placeholder="30" defaultValue="30" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button>Save Invoice</Button>
            <Button variant="outline" onClick={() => setShowCreateForm(false)}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Filter & Search */}
      <Card className="p-4 flex items-center gap-2">
        <Filter className="w-5 h-5 text-muted-foreground" />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg bg-background flex-1"
        >
          <option value="all">All Invoices</option>
          <option value="draft">Draft</option>
          <option value="pending_approval">Pending Approval</option>
          <option value="approved">Approved</option>
          <option value="sent">Sent</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
      </Card>

      {/* Invoices Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary/50 border-b border-border">
                <th className="px-6 py-3 text-left text-sm font-semibold">Invoice Number</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">GST</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">TDS</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Total</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Due Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4 font-medium">{invoice.number}</td>
                  <td className="px-6 py-4 text-sm">₹{(invoice.subtotal / 100000).toFixed(1)}L</td>
                  <td className="px-6 py-4 text-sm">₹{(invoice.gst / 100000).toFixed(1)}L</td>
                  <td className="px-6 py-4 text-sm">₹{(invoice.tds / 100000).toFixed(1)}L</td>
                  <td className="px-6 py-4 text-sm font-semibold">₹{(invoice.total / 100000).toFixed(1)}L</td>
                  <td className="px-6 py-4 text-sm">{invoice.dueDate.toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[invoice.status]}`}>
                      {invoice.status.replace(/_/g, " ").toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => setSelectedInvoice(invoice)}
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <Card className="p-8 border-2 border-primary/30 print:border-0">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-6">
              <div>
                <h1 className="text-3xl font-bold">INVOICE</h1>
                <p className="text-muted-foreground">{selectedInvoice.number}</p>
              </div>
              <div className="text-right space-y-2">
                <p className="text-sm text-muted-foreground">
                  Issue Date: {selectedInvoice.issueDate.toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Due Date: {selectedInvoice.dueDate.toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Line Items */}
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50 border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left">Description</th>
                    <th className="px-4 py-3 text-center">Quantity</th>
                    <th className="px-4 py-3 text-right">Rate</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.lineItems.map((item) => (
                    <tr key={item.id} className="border-b border-border/50">
                      <td className="px-4 py-3">{item.description}</td>
                      <td className="px-4 py-3 text-center">{item.quantity}</td>
                      <td className="px-4 py-3 text-right">₹{item.rate.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">₹{item.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations */}
            <div className="flex justify-end">
              <div className="w-80 space-y-2 text-sm">
                <div className="flex justify-between border-b border-border pb-2">
                  <span>Subtotal</span>
                  <span>₹{selectedInvoice.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span>₹{selectedInvoice.gst.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-destructive">
                  <span>TDS (2%)</span>
                  <span>-₹{selectedInvoice.tds.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-border pt-2 mt-2">
                  <span>Total Amount Due</span>
                  <span>₹{selectedInvoice.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payment Plan */}
            {selectedInvoice.paymentPlan || (
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="text-lg font-bold mb-4">Payment Schedule</h3>
                <div className="grid grid-cols-3 gap-2">
                  {calculatePaymentSchedule(selectedInvoice.total).map((inst) => (
                    <div key={inst.id} className="p-3 border border-border rounded-lg">
                      <p className="text-sm font-semibold">Installment {inst.number}</p>
                      <p className="text-lg font-bold">₹{inst.amount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{inst.dueDate.toLocaleDateString()}</p>
                      <p
                        className={`text-xs font-semibold mt-1 ${inst.status === "paid" ? "text-green-600" : "text-yellow-600"}`}
                      >
                        {inst.status === "paid" ? "✓ Paid" : "Pending"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 border-t border-border pt-6">
              <Button className="gap-2">
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Printer className="w-4 h-4" />
                Print
              </Button>
              <Button variant="outline" onClick={() => setSelectedInvoice(null)}>
                Close
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
