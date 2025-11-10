"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, MoreVertical, DollarSign, Calendar, TrendingUp, Download, X } from "lucide-react"

interface Invoice {
  id: string
  client: { name: string }
  amount: number
  date: string
  dueDate: string
  status: "PAID" | "PENDING" | "OVERDUE"
  description?: string
}

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [error, setError] = useState<string | null>(null)

  const [showForm, setShowForm] = useState(false)
  const [newInvoice, setNewInvoice] = useState({
    client: "",
    amount: "",
    description: "",
  })
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null)

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch("http://localhost:3000/invoice")
        if (res.ok) {
          const data = await res.json()
          setInvoices(data)
        } else {
          setError("Failed to fetch invoices")
        }
      } catch (error) {
        setError("An unexpected error occurred. Please try again.")
      }
    }

    fetchInvoices()
  }, [])

  const handleAddInvoice = async () => {
    if (newInvoice.client && newInvoice.amount) {
      try {
        const res = await fetch("http://localhost:3000/invoice", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...newInvoice,
            amount: Number(newInvoice.amount),
            date: new Date(),
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setInvoices([...invoices, data]);
          setNewInvoice({ client: "", amount: "", description: "" });
          setShowForm(false);
        } else {
          setError("Failed to create invoice");
        }
      } catch (error) {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const markAsPaid = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3000/invoice/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "PAID" }),
      });
      if (res.ok) {
        setInvoices(
          invoices.map((inv) =>
            inv.id === id ? { ...inv, status: "PAID" } : inv
          )
        );
      } else {
        setError("Failed to update invoice status");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const deleteInvoice = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3000/invoice/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setInvoices(invoices.filter((inv) => inv.id !== id));
        setSelectedInvoice(null);
      } else {
        setError("Failed to delete invoice");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0)
  const paidAmount = invoices.filter((inv) => inv.status === "PAID").reduce((sum, inv) => sum + inv.amount, 0)
  const pendingAmount = invoices.filter((inv) => inv.status !== "PAID").reduce((sum, inv) => sum + inv.amount, 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-50 text-green-700"
      case "PENDING":
        return "bg-yellow-50 text-yellow-700"
      case "OVERDUE":
        return "bg-red-50 text-red-700"
      default:
        return "bg-gray-50 text-gray-700"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Billing</h1>
          <p className="text-muted-foreground">Manage invoices and track payments</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Invoice
        </Button>
      </div>

      {/* Add Invoice Form */}
      {showForm && (
        <Card className="p-6 bg-secondary/30 border-primary/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Create New Invoice</h3>
            <button onClick={() => setShowForm(false)} className="p-1 hover:bg-secondary rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <Input
              placeholder="Client Name"
              value={newInvoice.client}
              onChange={(e) => setNewInvoice({ ...newInvoice, client: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Amount (USD)"
              value={newInvoice.amount}
              onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
            />
            <Input
              placeholder="Invoice Description"
              value={newInvoice.description}
              onChange={(e) => setNewInvoice({ ...newInvoice, description: e.target.value })}
            />
            <div className="flex gap-3">
              <Button onClick={handleAddInvoice} className="flex-1">
                Create Invoice
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Financial Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-green-700">Total Revenue</p>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-900">${totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-green-700 mt-2">{invoices.length} invoices</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-blue-700">Paid</p>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-900">${paidAmount.toLocaleString()}</p>
          <p className="text-xs text-blue-700 mt-2">{invoices.filter((i) => i.status === "PAID").length} paid</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-orange-700">Pending</p>
            <Calendar className="w-4 h-4 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-orange-900">${pendingAmount.toLocaleString()}</p>
          <p className="text-xs text-orange-700 mt-2">{invoices.filter((i) => i.status !== "PAID").length} pending</p>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">All Invoices</h2>
        <div className="space-y-3">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className={`p-4 border rounded-lg hover:border-primary/50 transition-all cursor-pointer ${
                selectedInvoice === invoice.id ? "border-primary/50 bg-primary/5" : "border-border"
              }`}
              onClick={() => setSelectedInvoice(selectedInvoice === invoice.id ? null : invoice.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">{invoice.id}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{invoice.client.name}</p>
                </div>
                <div className="text-right mr-4">
                  <p className="font-semibold">${invoice.amount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Due: {invoice.dueDate}</p>
                </div>
                <button className="p-2 hover:bg-secondary rounded-lg">
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Expanded Details */}
              {selectedInvoice === invoice.id && (
                <div className="pt-4 border-t border-border space-y-4 mt-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Description</p>
                    <p className="text-sm text-muted-foreground">{invoice.description || "No description"}</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-muted-foreground">{invoice.date}</p>
                    </div>
                    <div>
                      <p className="font-medium">Due Date</p>
                      <p className="text-muted-foreground">{invoice.dueDate}</p>
                    </div>
                    <div>
                      <p className="font-medium">Amount</p>
                      <p className="text-muted-foreground">${invoice.amount.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    {invoice.status !== "PAID" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          markAsPaid(invoice.id)
                        }}
                        className="flex-1 gap-2"
                      >
                        <DollarSign className="w-4 h-4" />
                        Mark as Paid
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="flex-1 gap-2 bg-transparent">
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteInvoice(invoice.id)
                      }}
                      className="flex-1 gap-2 text-destructive hover:bg-destructive/10"
                    >
                      <X className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
