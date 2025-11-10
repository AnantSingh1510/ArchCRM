"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, Download, Trash2, Eye, CheckCircle, AlertCircle, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface ClientDoc {
  id: string
  documentType: string
  fileName: string
  uploadedBy: string
  uploadedAt: string
  expiryDate?: string
  status: "verified" | "pending_review" | "rejected" | "expired"
  version: number
}

const documentTypes = [
  { value: "aadhaar", label: "Aadhaar Card", required: true },
  { value: "pan", label: "PAN Card", required: true },
  { value: "gst", label: "GST Certificate", required: false },
  { value: "tan", label: "TAN Certificate", required: false },
  { value: "bank_details", label: "Bank Details", required: false },
  { value: "property_deed", label: "Property Deed", required: false },
  { value: "kyc_form", label: "KYC Form", required: true },
  { value: "other", label: "Other Documents", required: false },
]

export default function ClientDocumentsPage({ params }: { params: { id: string } }) {
  const [documents, setDocuments] = useState<ClientDoc[]>([
    {
      id: "doc-1",
      documentType: "aadhaar",
      fileName: "Aadhaar_12345678.pdf",
      uploadedBy: "Admin User",
      uploadedAt: "2024-11-15",
      status: "verified",
      version: 1,
      expiryDate: "2029-11-15",
    },
    {
      id: "doc-2",
      documentType: "pan",
      fileName: "PAN_ABCDE1234F.pdf",
      uploadedBy: "Client",
      uploadedAt: "2024-11-10",
      status: "verified",
      version: 1,
    },
    {
      id: "doc-3",
      documentType: "gst",
      fileName: "GST_Certificate_27AABCT1234H1Z0.pdf",
      uploadedBy: "Admin User",
      uploadedAt: "2024-11-01",
      status: "pending_review",
      version: 2,
      expiryDate: "2025-03-31",
    },
    {
      id: "doc-4",
      documentType: "kyc_form",
      fileName: "KYC_Form_Filled.pdf",
      uploadedBy: "Client",
      uploadedAt: "2024-10-28",
      status: "verified",
      version: 1,
    },
  ])

  const [uploadingType, setUploadingType] = useState<string | null>(null)
  const [newFile, setNewFile] = useState<File | null>(null)

  const handleUpload = () => {
    if (!uploadingType || !newFile) return
    const newDoc: ClientDoc = {
      id: `doc-${Date.now()}`,
      documentType: uploadingType,
      fileName: newFile.name,
      uploadedBy: "Current User",
      uploadedAt: new Date().toISOString().split("T")[0],
      status: "pending_review",
      version: 1,
    }
    setDocuments([...documents, newDoc])
    setUploadingType(null)
    setNewFile(null)
  }

  const handleDelete = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id))
  }

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      verified: <CheckCircle className="w-4 h-4 text-green-600" />,
      pending_review: <Clock className="w-4 h-4 text-yellow-600" />,
      rejected: <AlertCircle className="w-4 h-4 text-red-600" />,
      expired: <AlertCircle className="w-4 h-4 text-orange-600" />,
    }
    return icons[status] || null
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string }> = {
      verified: { bg: "bg-green-100", text: "text-green-800" },
      pending_review: { bg: "bg-yellow-100", text: "text-yellow-800" },
      rejected: { bg: "bg-red-100", text: "text-red-800" },
      expired: { bg: "bg-orange-100", text: "text-orange-800" },
    }
    return badges[status] || { bg: "bg-gray-100", text: "text-gray-800" }
  }

  const requiredDocs = documentTypes.filter((d) => d.required)
  const uploadedRequired = requiredDocs.filter((d) => documents.some((doc) => doc.documentType === d.value))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/dashboard/clients/${params.id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Client Documents & KYC</h1>
          <p className="text-muted-foreground">Manage all client documentation and compliance</p>
        </div>
      </div>

      {/* KYC Completion Status */}
      <Card className="p-6 border-primary/20 bg-primary/5">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">KYC Completion Status</h2>
            <span className="text-2xl font-bold text-primary">
              {Math.round((uploadedRequired.length / requiredDocs.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-3">
            <div
              className="bg-primary rounded-full h-3 transition-all"
              style={{ width: `${(uploadedRequired.length / requiredDocs.length) * 100}%` }}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            {requiredDocs.map((doc) => {
              const isUploaded = documents.some((d) => d.documentType === doc.value)
              return (
                <div key={doc.value} className="flex items-center gap-2">
                  {isUploaded ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-gray-400" />
                  )}
                  <span className={isUploaded ? "font-semibold" : "text-muted-foreground"}>{doc.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </Card>

      {/* Upload Document */}
      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload New Document
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Document Type</label>
            <select
              value={uploadingType || ""}
              onChange={(e) => setUploadingType(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
            >
              <option value="">Select document type...</option>
              {documentTypes.map((doc) => (
                <option key={doc.value} value={doc.value}>
                  {doc.label}
                  {doc.required ? " *" : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Select File</label>
            <Input
              type="file"
              onChange={(e) => setNewFile(e.target.files?.[0] || null)}
              className="cursor-pointer"
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>

          <Button onClick={handleUpload} disabled={!uploadingType || !newFile} className="w-full gap-2">
            <Upload className="w-4 h-4" />
            Upload Document
          </Button>
        </div>
      </Card>

      {/* Documents List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold">Uploaded Documents</h2>
        {documents.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">No documents uploaded yet</Card>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => {
              const docType = documentTypes.find((d) => d.value === doc.documentType)
              const badge = getStatusBadge(doc.status)
              return (
                <Card key={doc.id} className="p-4 hover:border-primary/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">📄</span>
                        <div className="flex-1">
                          <h3 className="font-semibold">{docType?.label}</h3>
                          <p className="text-sm text-muted-foreground">{doc.fileName}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 flex-wrap text-sm text-muted-foreground">
                        <span>Uploaded: {doc.uploadedAt}</span>
                        <span>By: {doc.uploadedBy}</span>
                        <span>v{doc.version}</span>
                        {doc.expiryDate && <span>Expires: {doc.expiryDate}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${badge.bg} ${badge.text}`}
                      >
                        {getStatusIcon(doc.status)}
                        {doc.status.replace("_", " ")}
                      </div>
                      <button className="p-2 hover:bg-secondary rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-secondary rounded">
                        <Download className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(doc.id)} className="p-2 hover:bg-destructive/10 rounded">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
