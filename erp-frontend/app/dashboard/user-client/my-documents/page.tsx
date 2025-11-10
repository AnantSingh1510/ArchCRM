"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, Download, Eye, CheckCircle, Clock, AlertCircle } from "lucide-react"

interface MyDoc {
  id: string
  documentType: string
  fileName: string
  uploadedAt: string
  status: "approved" | "pending" | "rejected"
  uploadedBy: string
}

const documentTypes = [
  { value: "aadhaar", label: "Aadhaar Card", required: true },
  { value: "pan", label: "PAN Card", required: true },
  { value: "gst", label: "GST Certificate", required: false },
  { value: "bank_details", label: "Bank Details", required: false },
  { value: "kyc_form", label: "KYC Form", required: true },
  { value: "other", label: "Other Documents", required: false },
]

export default function MyDocumentsPage() {
  const [myDocuments, setMyDocuments] = useState<MyDoc[]>([
    {
      id: "doc-1",
      documentType: "aadhaar",
      fileName: "My_Aadhaar.pdf",
      uploadedAt: "2024-11-18",
      status: "approved",
      uploadedBy: "Me",
    },
    {
      id: "doc-2",
      documentType: "pan",
      fileName: "My_PAN.pdf",
      uploadedAt: "2024-11-15",
      status: "approved",
      uploadedBy: "Me",
    },
    {
      id: "doc-3",
      documentType: "kyc_form",
      fileName: "KYC_Form_2024.pdf",
      uploadedAt: "2024-11-20",
      status: "pending",
      uploadedBy: "Me",
    },
  ])

  const [uploadingType, setUploadingType] = useState<string | null>(null)
  const [newFile, setNewFile] = useState<File | null>(null)

  const handleUpload = () => {
    if (!uploadingType || !newFile) return
    const newDoc: MyDoc = {
      id: `doc-${Date.now()}`,
      documentType: uploadingType,
      fileName: newFile.name,
      uploadedAt: new Date().toISOString().split("T")[0],
      status: "pending",
      uploadedBy: "Me",
    }
    setMyDocuments([...myDocuments, newDoc])
    setUploadingType(null)
    setNewFile(null)
  }

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      approved: <CheckCircle className="w-4 h-4 text-green-600" />,
      pending: <Clock className="w-4 h-4 text-yellow-600" />,
      rejected: <AlertCircle className="w-4 h-4 text-red-600" />,
    }
    return icons[status] || null
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string }> = {
      approved: { bg: "bg-green-100", text: "text-green-800" },
      pending: { bg: "bg-yellow-100", text: "text-yellow-800" },
      rejected: { bg: "bg-red-100", text: "text-red-800" },
    }
    return badges[status] || { bg: "bg-gray-100", text: "text-gray-800" }
  }

  const requiredDocs = documentTypes.filter((d) => d.required)
  const uploadedRequired = requiredDocs.filter((d) => myDocuments.some((doc) => doc.documentType === d.value))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">My Documents</h1>
        <p className="text-muted-foreground">Upload and manage your personal and business documents</p>
      </div>

      {/* Submission Status */}
      <Card className="p-6 border-primary/20 bg-primary/5">
        <div className="space-y-4">
          <h2 className="text-lg font-bold">Document Submission Status</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Required Documents</p>
              <p className="text-3xl font-bold text-primary">{requiredDocs.length}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Approved</p>
              <p className="text-3xl font-bold text-green-600">
                {myDocuments.filter((d) => d.status === "approved").length}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Pending Review</p>
              <p className="text-3xl font-bold text-yellow-600">
                {myDocuments.filter((d) => d.status === "pending").length}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Upload Section */}
      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Document
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
            <label className="block text-sm font-medium mb-2">Select File (PDF, JPG, PNG)</label>
            <Input
              type="file"
              onChange={(e) => setNewFile(e.target.files?.[0] || null)}
              className="cursor-pointer"
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Max file size: 5 MB</p>
            <p>Only clear, readable copies are accepted</p>
          </div>

          <Button onClick={handleUpload} disabled={!uploadingType || !newFile} className="w-full gap-2">
            <Upload className="w-4 h-4" />
            Upload Document
          </Button>
        </div>
      </Card>

      {/* My Documents */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold">My Uploaded Documents</h2>
        {myDocuments.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            No documents uploaded yet. Start by uploading your required documents.
          </Card>
        ) : (
          <div className="space-y-3">
            {myDocuments.map((doc) => {
              const docType = documentTypes.find((d) => d.value === doc.documentType)
              const badge = getStatusBadge(doc.status)
              return (
                <Card key={doc.id} className="p-4 hover:border-primary/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">📄</span>
                        <div>
                          <h3 className="font-semibold">{docType?.label}</h3>
                          <p className="text-sm text-muted-foreground">{doc.fileName}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">Uploaded: {doc.uploadedAt}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${badge.bg} ${badge.text}`}
                      >
                        {getStatusIcon(doc.status)}
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </div>

                      {doc.status === "rejected" && (
                        <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                          <Upload className="w-3 h-3" />
                          Reupload
                        </Button>
                      )}
                      <button className="p-2 hover:bg-secondary rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-secondary rounded">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Guidelines */}
      <Card className="p-6 bg-secondary/30">
        <h2 className="text-lg font-bold mb-4">Document Upload Guidelines</h2>
        <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
          <li>Required documents must be in colour and clearly readable</li>
          <li>Aadhaar and PAN: Front and back are required</li>
          <li>GST Certificate: Valid and not expired</li>
          <li>KYC Form: Must be duly filled and signed</li>
          <li>Bank Details: Cancelled cheque or bank statement</li>
          <li>File formats: PDF, JPG, PNG (Max 5 MB each)</li>
          <li>All documents will be verified within 24-48 hours</li>
        </ul>
      </Card>
    </div>
  )
}
