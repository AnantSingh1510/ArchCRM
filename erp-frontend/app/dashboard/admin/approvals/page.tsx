"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle, FileText, DollarSign, Building2, Users } from "lucide-react"
import type { ApprovalRequest } from "@/lib/types"

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([])
  const [error, setError] = useState<string | null>(null)

  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null)
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [comment, setComment] = useState("")
  const [filterType, setFilterType] = useState<string>("all")

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const res = await fetch("http://localhost:3000/approval")
        if (res.ok) {
          const data = await res.json()
          setApprovals(data)
        } else {
          setError("Failed to fetch approvals")
        }
      } catch (error) {
        setError("An unexpected error occurred. Please try again.")
      }
    }

    fetchApprovals()
  }, [])

  const filteredApprovals = filterType === "all" ? approvals : approvals.filter((a) => a.type === filterType)

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3000/approval/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "approved" }),
      });
      if (res.ok) {
        setApprovals(
          approvals.map((a) => (a.id === id ? { ...a, status: "approved" } : a))
        );
        setSelectedApproval(null);
      } else {
        setError("Failed to approve request");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3000/approval/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "rejected" }),
      });
      if (res.ok) {
        setApprovals(
          approvals.map((a) => (a.id === id ? { ...a, status: "rejected" } : a))
        );
        setSelectedApproval(null);
      } else {
        setError("Failed to reject request");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const getPendingCount = () => approvals.filter((a) => a.status === "pending").length
  const getTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      invoice: FileText,
      payment: DollarSign,
      project: Building2,
      client: Users,
    }
    return icons[type] || FileText
  }

  const typeColors: Record<string, string> = {
    invoice: "bg-blue-100 text-blue-800",
    payment: "bg-green-100 text-green-800",
    project: "bg-purple-100 text-purple-800",
    client: "bg-orange-100 text-orange-800",
  }

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Approval Workflows</h1>
        <p className="text-muted-foreground">Review and approve pending requests</p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              Pending
            </p>
            <p className="text-3xl font-bold text-yellow-600">{getPendingCount()}</p>
            <p className="text-xs">Require action</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Approved
            </p>
            <p className="text-3xl font-bold text-green-600">
              {approvals.filter((a) => a.status === "approved").length}
            </p>
            <p className="text-xs">This month</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-600" />
              Rejected
            </p>
            <p className="text-3xl font-bold text-red-600">{approvals.filter((a) => a.status === "rejected").length}</p>
            <p className="text-xs">This month</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              Value Pending
            </p>
            <p className="text-3xl font-bold">₹74.1L</p>
            <p className="text-xs">Under review</p>
          </div>
        </Card>
      </div>

      {/* Filter */}
      <Card className="p-4">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg bg-background"
        >
          <option value="all">All Requests</option>
          <option value="invoice">Invoices</option>
          <option value="payment">Payments</option>
          <option value="project">Projects</option>
          <option value="client">Clients</option>
        </select>
      </Card>

      {/* Approvals List */}
      <div className="space-y-3">
        {filteredApprovals.map((approval) => {
          const TypeIcon = getTypeIcon(approval.type)
          const isSelected = selectedApproval?.id === approval.id

          return (
            <Card
              key={approval.id}
              className={`p-6 border cursor-pointer transition-all ${
                isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
              onClick={() => setSelectedApproval(isSelected ? null : approval)}
            >
              {/* Main Row */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-3 rounded-lg ${typeColors[approval.type]}`}>
                    <TypeIcon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold capitalize">{approval.type} Approval</h3>
                      <span className={`px-2 py-1 text-xs rounded-full font-semibold ${statusColors[approval.status]}`}>
                        {approval.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">From: {approval.requester.name}</p>
                    <div className="grid md:grid-cols-2 gap-2 text-sm">
                      {Object.entries(approval.data).map(([key, value]) => (
                        <p key={key} className="text-muted-foreground">
                          <span className="font-medium">{key.replace(/([A-Z])/g, " $1").toLowerCase()}:</span>{" "}
                          {String(value)}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{approval.createdAt.toLocaleTimeString()}</p>
                </div>
              </div>

              {/* Expandable Details */}
              {isSelected && approval.status === "pending" && (
                <div className="mt-6 pt-6 border-t border-border space-y-4">
                  {/* Comment Section */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Add Comment</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment (optional)"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
                      rows={3}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprove(approval.id)}
                      className="gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </Button>
                    <Button onClick={() => handleReject(approval.id)} variant="destructive" className="gap-2">
                      <XCircle className="w-4 h-4" />
                      Reject
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedApproval(null)
                        setComment("")
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Approved/Rejected Info */}
              {isSelected && approval.status !== "pending" && (
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Status:</span> {approval.status.toUpperCase()}
                  </p>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
