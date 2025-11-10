"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, TrendingUp, AlertCircle } from "lucide-react"

export default function GSTTrackerPage() {
  const [gstData] = useState([
    {
      month: "October 2024",
      outwardSupply: 5000000,
      igst: 900000,
      cgst: 450000,
      sgst: 450000,
      inputTax: 300000,
      netGST: 1500000,
      returnFiled: true,
      dueDate: new Date("2024-11-15"),
    },
    {
      month: "September 2024",
      outwardSupply: 4500000,
      igst: 810000,
      cgst: 405000,
      sgst: 405000,
      inputTax: 280000,
      netGST: 1340000,
      returnFiled: true,
      dueDate: new Date("2024-10-15"),
    },
  ])

  const [showDetails, setShowDetails] = useState(false)

  const currentMonth = gstData[0]
  const totalOutwardSupply = gstData.reduce((sum, d) => sum + d.outwardSupply, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">GST Compliance Tracker</h1>
          <p className="text-slate-600">Monitor GST filings, returns, and payments for Indian compliance</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-blue-500 to-blue-600">
          <Plus className="w-4 h-4" />
          Record Transaction
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Outward Supply",
            value: `₹${(totalOutwardSupply / 10000000).toFixed(2)}Cr`,
            icon: TrendingUp,
            color: "from-blue-500 to-blue-600",
          },
          {
            label: "Total IGST",
            value: `₹${(gstData.reduce((s, d) => s + d.igst, 0) / 1000000).toFixed(2)}M`,
            color: "from-green-500 to-green-600",
            icon: TrendingUp,
          },
          {
            label: "Total Input Tax",
            value: `₹${(gstData.reduce((s, d) => s + d.inputTax, 0) / 1000000).toFixed(2)}M`,
            color: "from-orange-500 to-orange-600",
            icon: TrendingUp,
          },
          {
            label: "Net GST Payable",
            value: `₹${(gstData.reduce((s, d) => s + d.netGST, 0) / 10000000).toFixed(2)}Cr`,
            color: "from-purple-500 to-purple-600",
            icon: AlertCircle,
          },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={i} className="p-4 bg-white border-0 shadow-sm">
              <div className={`p-2.5 rounded-lg bg-gradient-to-br ${stat.color} w-fit mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs text-slate-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </Card>
          )
        })}
      </div>

      {/* Current Month Details */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">{currentMonth.month}</h2>
            <p className="text-sm text-slate-600">GST Filing Status & Details</p>
          </div>
          <div
            className={`px-4 py-2 rounded-lg font-semibold ${currentMonth.returnFiled ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800"}`}
          >
            {currentMonth.returnFiled ? "✓ Filed" : "Pending"}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Outbound Breakdown */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900">Outward Supply Breakdown</h3>
            <div className="space-y-3">
              {[
                { label: "Outward Supply", value: currentMonth.outwardSupply, highlight: true },
                { label: "IGST (5%)", value: currentMonth.igst },
                { label: "CGST (9%)", value: currentMonth.cgst },
                { label: "SGST (9%)", value: currentMonth.sgst },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`flex justify-between p-3 rounded-lg ${item.highlight ? "bg-white font-bold" : "bg-blue-50/50"}`}
                >
                  <span className="text-slate-700">{item.label}</span>
                  <span className="text-slate-900 font-semibold">₹{(item.value / 100000).toFixed(1)}L</span>
                </div>
              ))}
            </div>
          </div>

          {/* Inbound & Net GST */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900">Input Tax & Net GST</h3>
            <div className="space-y-3">
              <div className="flex justify-between p-3 rounded-lg bg-white font-bold">
                <span className="text-slate-700">Input Tax Credit</span>
                <span className="text-slate-900">₹{(currentMonth.inputTax / 100000).toFixed(1)}L</span>
              </div>
              <div className="text-sm text-slate-600 bg-blue-50 p-3 rounded-lg">
                <p>
                  GST Collected: ₹{((currentMonth.igst + currentMonth.cgst + currentMonth.sgst) / 100000).toFixed(1)}L
                </p>
                <p>GST Paid: ₹{(currentMonth.inputTax / 100000).toFixed(1)}L</p>
              </div>
              <div className="flex justify-between p-4 rounded-lg bg-green-100 font-bold border-2 border-green-300">
                <span className="text-green-900">Net GST Payable</span>
                <span className="text-green-900">₹{(currentMonth.netGST / 100000).toFixed(1)}L</span>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700">Pay GST Now</Button>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-white rounded-lg text-sm text-slate-600">
          <p>
            Due Date:{" "}
            {currentMonth.dueDate.toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })}
          </p>
          <p className="text-xs mt-1">File GSTR-1, GSTR-2, and GSTR-3B returns on time to avoid penalties</p>
        </div>
      </Card>

      {/* Historical GST Records */}
      <Card className="p-6 bg-white border-0">
        <h2 className="text-xl font-bold mb-4 text-slate-900">GST Filing History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b-2 border-slate-200">
                <th className="px-4 py-3 text-left font-semibold">Month</th>
                <th className="px-4 py-3 text-left font-semibold">Outward Supply</th>
                <th className="px-4 py-3 text-left font-semibold">Total GST</th>
                <th className="px-4 py-3 text-left font-semibold">Input Tax</th>
                <th className="px-4 py-3 text-left font-semibold">Net GST</th>
                <th className="px-4 py-3 text-center font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {gstData.map((row, i) => (
                <tr key={i} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{row.month}</td>
                  <td className="px-4 py-3">₹{(row.outwardSupply / 1000000).toFixed(1)}M</td>
                  <td className="px-4 py-3">₹{((row.igst + row.cgst + row.sgst) / 100000).toFixed(1)}L</td>
                  <td className="px-4 py-3">₹{(row.inputTax / 100000).toFixed(1)}L</td>
                  <td className="px-4 py-3 font-semibold">₹{(row.netGST / 100000).toFixed(1)}L</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${row.returnFiled ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                    >
                      {row.returnFiled ? "Filed" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-blue-600 font-semibold cursor-pointer hover:underline">
                    <button onClick={() => setShowDetails(!showDetails)}>View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
