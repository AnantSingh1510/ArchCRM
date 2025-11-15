"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, Download, Eye, CheckCircle, Clock, AlertCircle, X } from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface MyDoc {
  id: string
  name: string
  documentType: string
  fileName: string
  uploadedAt: string;
  uploadedDate: string;
  status: "approved" | "pending" | "rejected"
  uploadedBy: string;
  url: string;
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
  const [myDocuments, setMyDocuments] = useState<MyDoc[]>([])

  const [uploadingType, setUploadingType] = useState<string | null>(null)
  const [newFile, setNewFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [previewDoc, setPreviewDoc] = useState<MyDoc | null>(null)
  const [isViewerOpen, setIsViewerOpen] = useState(false)

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        if (!token) {
          setError("No token found. Please log in again.")
          return
        }
        const payload = JSON.parse(atob(token.split('.')[1]))
        const clientId = payload.clientId
        if (!clientId) {
          setError("No client ID found. Please log in again.")
          return
        }
        const res = await fetch(`http://localhost:3000/document/client/${clientId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (res.ok) {
          const data = await res.json()
          setMyDocuments(data)
        } else {
          setError("Failed to fetch documents")
        }
      } catch (error) {
        setError("An unexpected error occurred. Please try again.")
      }
    }

    fetchDocuments()
  }, [])

  const handleUpload = async () => {
    if (!uploadingType || !newFile) return
    const formData = new FormData()
    formData.append("file", newFile)
    formData.append("clientId", localStorage.getItem("client_id") || "")
    formData.append("name", newFile.name)
    formData.append("type", uploadingType)
    formData.append("tags", "")

    try {
      const token = localStorage.getItem("auth_token")
      const res = await fetch("http://localhost:3000/document/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (res.ok) {
        const newDoc = await res.json()
        setMyDocuments([...myDocuments, newDoc])
        setUploadingType(null)
        setNewFile(null)
      } else {
        const errorData = await res.json()
        setError(errorData.message || "Failed to upload document")
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
    }
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

  const openDocumentViewer = (doc: MyDoc) => {
    setPreviewDoc(doc)
    setIsViewerOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Documents</h1>
          <p className="text-muted-foreground">Upload and manage your personal and business documents</p>
        </div>
        <Link href="/dashboard/user-client/my-documents/new">
          <Button className="gap-2 w-full sm:w-auto">
            <Upload className="w-4 h-4" />
            Upload Document
          </Button>
        </Link>
      </div>

      {/* Submission Status */}
      <Card className="p-6 border-primary/20 bg-primary/5">
        <div className="space-y-4">
          <h2 className="text-lg font-bold">Document Submission Status</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-bold">My Uploaded Documents</h2>
        </div>
        <div className="border-t overflow-x-auto">
          {myDocuments.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No documents uploaded yet. Start by uploading your required documents.
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-6 py-3 text-left text-sm font-semibold">Document</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Uploaded</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myDocuments.map((doc) => {
                  const docType = documentTypes.find((d) => d.value === doc.documentType)
                  const badge = getStatusBadge(doc.status)
                  return (
                    <tr key={doc.id} className="border-b hover:bg-secondary/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold">{doc.name}</div>
                        <div className="text-sm text-muted-foreground">{docType?.label}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(doc.uploadedDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${badge.bg} ${badge.text}`}
                        >
                          {getStatusIcon(doc.status)}
                          {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-2"
                            onClick={() => openDocumentViewer(doc)}
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                          <a href={`http://localhost:3000/document/download/${doc.url.split('\\').pop()}`} download>
                            <Button variant="outline" size="sm" className="gap-2">
                              <Download className="w-4 h-4" />
                              Download
                            </Button>
                          </a>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </Card>

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

      {/* Full Screen Document Viewer */}
      {isViewerOpen && previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
          {/* Header */}
          <div className="bg-gray-900 border-b border-gray-700 px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-white truncate">{previewDoc.name}</h2>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 text-xs sm:text-sm text-gray-400">
                  <span className="truncate">{documentTypes.find((d) => d.value === previewDoc.documentType)?.label}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="whitespace-nowrap">{new Date(previewDoc.uploadedDate).toLocaleDateString()}</span>
                  <span className="hidden sm:inline">•</span>
                  <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusBadge(previewDoc.status).bg} ${getStatusBadge(previewDoc.status).text}`}>
                    {getStatusIcon(previewDoc.status)}
                    {previewDoc.status.charAt(0).toUpperCase() + previewDoc.status.slice(1)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a href={`http://localhost:3000/document/download/${previewDoc.url.split('\\').pop()}`} download>
                  <Button variant="outline" size="sm" className="gap-2 bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Download</span>
                  </Button>
                </a>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsViewerOpen(false)}
                  className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Document Content */}
          <div className="flex-1 p-2 sm:p-4 overflow-hidden">
            <div className="h-full bg-white rounded-lg shadow-2xl overflow-hidden">
              <iframe
                src={`http://localhost:3000/document/download/${previewDoc.url.split('\\').pop()}`}
                className="w-full h-full"
                title={previewDoc.name}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}