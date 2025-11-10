"use client"

import React, { useState, use } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  FileText,
  Download,
  Eye,
  Trash2,
  Plus,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
  DollarSign,
  Users,
  Briefcase,
} from "lucide-react"

interface Document {
  id: string
  name: string
  type: "aadhaar" | "pan" | "gst" | "tan" | "bank" | "property" | "kyc" | "other"
  status: "verified" | "pending" | "rejected" | "expired"
  uploadedDate: string
  uploadedBy: string
  expiryDate?: string
  size: string
}

interface ClientDetail {
  id: string
  name: string
  email: string
  phone: string
  altPhone: string
  address: string
  city: string
  state: string
  zipCode: string
  gstNumber: string
  panNumber: string
  aadhaarNumber: string
  bankAccountNumber: string
  ifscCode: string
  joinedDate: string
  status: "active" | "inactive" | "suspended"
  kycStatus: "approved" | "pending" | "incomplete" | "rejected"
  totalProjects: number
  totalInvoices: number
  totalPaid: string
  totalPending: string
  documents: Document[]
}

export default function ClientDetailsPage({ params }: { params: { id: string } }) {
  const { id } = use(params);
  const [client] = useState<ClientDetail>({
    id: id,
    name: "Urban Developers Inc",
    email: "contact@urbandevelopers.com",
    phone: "+91 98765 43210",
    altPhone: "+91 98765 43211",
    address: "456 Business Park, Tech Avenue",
    city: "Bangalore",
    state: "Karnataka",
    zipCode: "560001",
    gstNumber: "29AABCU9603R1Z0",
    panNumber: "AABCU9603R",
    aadhaarNumber: "****-****-5678",
    bankAccountNumber: "12345678901234",
    ifscCode: "HDFC0001234",
    joinedDate: "2023-03-15",
    status: "active",
    kycStatus: "approved",
    totalProjects: 2,
    totalInvoices: 12,
    totalPaid: "₹45,00,000",
    totalPending: "₹8,50,000",
    documents: [
      {
        id: "1",
        name: "Aadhaar Card",
        type: "aadhaar",
        status: "verified",
        uploadedDate: "2023-03-15",
        uploadedBy: "Admin",
        size: "2.4 MB",
      },
      {
        id: "2",
        name: "PAN Card",
        type: "pan",
        status: "verified",
        uploadedDate: "2023-03-15",
        uploadedBy: "Admin",
        size: "1.8 MB",
      },
      {
        id: "3",
        name: "GST Certificate",
        type: "gst",
        status: "verified",
        uploadedDate: "2023-04-10",
        uploadedBy: "Client",
        expiryDate: "2025-12-31",
        size: "3.2 MB",
      },
      {
        id: "4",
        name: "Bank Details Proof",
        type: "bank",
        status: "pending",
        uploadedDate: "2024-01-20",
        uploadedBy: "Client",
        size: "2.1 MB",
      },
      {
        id: "5",
        name: "KYC Form",
        type: "kyc",
        status: "verified",
        uploadedDate: "2023-03-16",
        uploadedBy: "Admin",
        size: "1.5 MB",
      },
    ],
  })

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      active: { bg: "bg-green-100", text: "text-green-800", icon: <CheckCircle2 className="w-4 h-4" /> },
      inactive: { bg: "bg-gray-100", text: "text-gray-800", icon: <Clock className="w-4 h-4" /> },
      suspended: { bg: "bg-red-100", text: "text-red-800", icon: <AlertCircle className="w-4 h-4" /> },
      verified: { bg: "bg-green-100", text: "text-green-800", icon: <CheckCircle2 className="w-4 h-4" /> },
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", icon: <Clock className="w-4 h-4" /> },
      rejected: { bg: "bg-red-100", text: "text-red-800", icon: <AlertCircle className="w-4 h-4" /> },
      expired: { bg: "bg-orange-100", text: "text-orange-800", icon: <AlertCircle className="w-4 h-4" /> },
      approved: { bg: "bg-green-100", text: "text-green-800", icon: <CheckCircle2 className="w-4 h-4" /> },
      incomplete: { bg: "bg-gray-100", text: "text-gray-800", icon: <Clock className="w-4 h-4" /> },
    }
    return badges[status] || { bg: "bg-gray-100", text: "text-gray-800", icon: null }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/clients">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{client.name}</h1>
            <p className="text-muted-foreground">Client profile and document management</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 ${getStatusBadge(client.status).bg} ${getStatusBadge(client.status).text}`}
          >
            {getStatusBadge(client.status).icon}
            {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
          </span>
        </div>
      </div>

      {client.kycStatus !== "approved" && (
        <Card className="p-4 bg-yellow-50 border border-yellow-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-900">
                KYC Status: {client.kycStatus.charAt(0).toUpperCase() + client.kycStatus.slice(1)}
              </h3>
              <p className="text-sm text-yellow-800">Please upload remaining documents to complete KYC verification.</p>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Total Projects</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{client.totalProjects}</p>
            </div>
            <Briefcase className="w-8 h-8 text-blue-600 opacity-20" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Total Paid</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{client.totalPaid}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600 opacity-20" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Pending</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{client.totalPending}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600 opacity-20" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Documents</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{client.documents.length}</p>
            </div>
            <FileText className="w-8 h-8 text-purple-600 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Contact Information */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Contact Information
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-semibold text-slate-600">Email Address</label>
            <div className="flex items-center gap-2 mt-2">
              <Mail className="w-4 h-4 text-slate-400" />
              <p className="text-slate-900">{client.email}</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">Primary Phone</label>
            <div className="flex items-center gap-2 mt-2">
              <Phone className="w-4 h-4 text-slate-400" />
              <p className="text-slate-900">{client.phone}</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">Alternate Phone</label>
            <div className="flex items-center gap-2 mt-2">
              <Phone className="w-4 h-4 text-slate-400" />
              <p className="text-slate-900">{client.altPhone}</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">Joined Date</label>
            <div className="flex items-center gap-2 mt-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <p className="text-slate-900">{new Date(client.joinedDate).toLocaleDateString("en-IN")}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Address Information */}
      <Card className="p-6">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-blue-600" />
          Address Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-semibold text-slate-600">Address</label>
            <p className="text-slate-900 mt-2">{client.address}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">City</label>
            <p className="text-slate-900 mt-2">{client.city}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">State</label>
            <p className="text-slate-900 mt-2">{client.state}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">PIN Code</label>
            <p className="text-slate-900 mt-2">{client.zipCode}</p>
          </div>
        </div>
      </Card>

      {/* Financial Information */}
      <Card className="p-6">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-blue-600" />
          Financial & Tax Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-semibold text-slate-600">GST Number</label>
            <p className="text-slate-900 mt-2 font-mono">{client.gstNumber}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">PAN Number</label>
            <p className="text-slate-900 mt-2 font-mono">{client.panNumber}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">Aadhaar Number (Last 4 Digits)</label>
            <p className="text-slate-900 mt-2 font-mono">{client.aadhaarNumber}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">Bank Account Number</label>
            <p className="text-slate-900 mt-2 font-mono">{client.bankAccountNumber}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">IFSC Code</label>
            <p className="text-slate-900 mt-2 font-mono">{client.ifscCode}</p>
          </div>
        </div>
      </Card>

      {/* Documents Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Documents & Compliance
          </h2>
          <Link href={`/dashboard/clients/${params.id}/documents`}>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Manage Documents
            </Button>
          </Link>
        </div>

        <div className="space-y-3">
          {client.documents.map((doc) => {
            const badge = getStatusBadge(doc.status)
            return (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
              >
                <div className="flex items-start gap-3 flex-1">
                  <FileText className="w-5 h-5 text-slate-400 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{doc.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1 ${badge.bg} ${badge.text}`}
                      >
                        {badge.icon}
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </span>
                      <span className="text-xs text-slate-500">
                        Uploaded on {new Date(doc.uploadedDate).toLocaleDateString("en-IN")} by {doc.uploadedBy}
                      </span>
                      {doc.expiryDate && (
                        <span className="text-xs text-slate-500">
                          Expires: {new Date(doc.expiryDate).toLocaleDateString("en-IN")}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-2">{doc.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                    <Eye className="w-4 h-4 text-slate-600" />
                  </button>
                  <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                    <Download className="w-4 h-4 text-slate-600" />
                  </button>
                  <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {client.documents.length === 0 && (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No documents uploaded yet</p>
            <p className="text-sm text-slate-400 mt-1">Start by uploading KYC documents</p>
          </div>
        )}
      </Card>
    </div>
  )
}
