"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, AlertCircle, CheckCircle2, TrendingUp } from "lucide-react"

export default function TDSManagementPage() {
  const [tdsData] = useState([
    {
      id: "tds-1",
      vendorName: "ABC Construction Supplies",
      invoiceNo: "INV-2024-001",
      amount: 500000,
      tdsRate: 2,
      tdsAmount: 10000,
      paymentDate: new Date("2024-11-05"),
      certificateStatus: "Not Generated",
      status: "pending",
    },
    {
      id: "tds-2",
      vendorName: "XYZ Consultants",
      invoiceNo: "INV-2024-002",
      amount: 250000,
      tdsRate: 10,
      tdsAmount: 25000,
      paymentDate: new Date("2024-11-10"),
      certificateStatus: "Generated",
      status: "deducted",
    },
    {
      id: "tds-3",
      vendorName: "Prime Labour Services",
      invoiceNo: "INV-2024-003",
      amount: 750000,
      tdsRate: 1,
      tdsAmount: 7500,
      paymentDate: new Date("2024-11-12"),
      certificateStatus: "Not Generated",
      status: "pending",
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const totalAmount = tdsData.reduce((sum, t) => sum + t.amount, 0)
  const totalTDS = tdsData.reduce((sum, t) => sum + t.tdsAmount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">TDS Management</h1>
          <p className="text-slate-600">Track Tax Deducted at Source for vendor payments</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-green-500 to-green-600" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4" />
          Record TDS Deduction
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4 bg-white border-0">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 w-fit mb-3">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <p className="text-xs text-slate-600 mb-1">Total Amount Paid</p>
          <p className="text-2xl font-bold">₹{(totalAmount / 1000000).toFixed(1)}M</p>
        </Card>
        <Card className="p-4 bg-white border-0">
          <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-red-600 w-fit mb-3">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <p className="text-xs text-slate-600 mb-1">Total TDS Deducted</p>
          <p className="text-2xl font-bold">₹{(totalTDS / 100000).toFixed(1)}L</p>
        </Card>
        <Card className="p-4 bg-white border-0">
          <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-green-600 w-fit mb-3">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <p className="text-xs text-slate-600 mb-1">Pending Certificates</p>
          <p className="text-2xl font-bold">{tdsData.filter((t) => t.certificateStatus === "Not Generated").length}</p>
        </Card>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-0">
          <h2 className="text-lg font-bold mb-4">Add TDS Deduction Record</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Vendor Name</label>
              <input
                type="text"
                placeholder="Enter vendor name"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Invoice Amount</label>
              <input
                type="number"
                placeholder="Amount in ₹"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">TDS Rate (%)</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                <option>1%</option>
                <option>2%</option>
                <option>5%</option>
                <option>10%</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Payment Date</label>
              <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button className="bg-green-600 hover:bg-green-700">Save Record</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* TDS Records Table */}
      <Card className="p-6 bg-white border-0">
        <h2 className="text-xl font-bold mb-4">TDS Deduction Records</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b-2 border-slate-200">
                <th className="px-4 py-3 text-left font-semibold">Vendor</th>
                <th className="px-4 py-3 text-left font-semibold">Invoice</th>
                <th className="px-4 py-3 text-right font-semibold">Amount</th>
                <th className="px-4 py-3 text-center font-semibold">TDS Rate</th>
                <th className="px-4 py-3 text-right font-semibold">TDS Amount</th>
                <th className="px-4 py-3 text-left font-semibold">Payment Date</th>
                <th className="px-4 py-3 text-center font-semibold">Certificate</th>
                <th className="px-4 py-3 text-center font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {tdsData.map((row) => (
                <tr key={row.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{row.vendorName}</td>
                  <td className="px-4 py-3">{row.invoiceNo}</td>
                  <td className="px-4 py-3 text-right">₹{(row.amount / 100000).toFixed(1)}L</td>
                  <td className="px-4 py-3 text-center font-semibold">{row.tdsRate}%</td>
                  <td className="px-4 py-3 text-right font-semibold text-red-600">
                    -₹{(row.tdsAmount / 1000).toFixed(0)}K
                  </td>
                  <td className="px-4 py-3">{row.paymentDate.toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${row.certificateStatus === "Generated" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                    >
                      {row.certificateStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${row.status === "deducted" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}
                    >
                      {row.status === "deducted" ? "Deducted" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Important Notes */}
      <Card className="p-4 bg-blue-50 border-l-4 border-blue-500">
        <h3 className="font-semibold text-blue-900 mb-2">Important Reminders</h3>
        <ul className="space-y-1 text-sm text-blue-800">
          <li>• TDS certificates must be provided to vendors within 15 days of deduction</li>
          <li>• File TDS returns (Form 24Q) within 7 days of filing monthly returns</li>
          <li>• Ensure all vendor PAN details are correct in the system</li>
          <li>• TDS cannot be paid without proper vendor verification</li>
        </ul>
      </Card>
    </div>
  )
}
