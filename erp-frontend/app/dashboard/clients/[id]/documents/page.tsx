"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search, FileText, Download, Eye, Trash2, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { Document } from "@/lib/types"
import Link from "next/link"
import { use } from "react"
import BackButton from "@/components/BackButton"

export default function ClientDocumentsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // Unwrap the Promise
  const [documents, setDocuments] = useState<Document[]>([])
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      verified: { bg: "bg-green-100", text: "text-green-800", icon: <CheckCircle className="w-4 h-4" /> },
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", icon: <Clock className="w-4 h-4" /> },
      rejected: { bg: "bg-red-100", text: "text-red-800", icon: <AlertCircle className="w-4 h-4" /> },
    }
    return badges[status] || { bg: "bg-gray-100", text: "text-gray-800", icon: null }
  }

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const res = await fetch(`http://localhost:3000/document/client/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setDocuments(data);
        } else {
          setError("Failed to fetch documents");
        }
      } catch (error) {
        setError("An unexpected error occurred. Please try again.");
      }
    };

    if (id) {
      fetchDocuments();
    }
  }, [id]);

  const filteredDocuments = documents.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <BackButton />
        <div>
          <h1 className="text-3xl font-bold">Client Documents</h1>
          <p className="text-muted-foreground">Manage documents for this client</p>
        </div>
        <Link href={`/dashboard/clients/${id}/documents/new`}>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Document
          </Button>
        </Link>
      </div>

      <Card className="p-4 border border-border">
        <div className="flex gap-2">
          <Search className="w-5 h-5 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search documents by name or type..."
            className="border-0 bg-transparent"
          />
        </div>
      </Card>

      {error && <p className="text-destructive">{error}</p>}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredDocuments.map((doc) => (
          <Card key={doc.id} className="p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-start gap-3 mb-4">
                <FileText className="w-5 h-5 text-slate-400 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{doc.name}</h3>
                  <div
                    className={`flex items-center gap-2 mt-1 text-xs font-semibold ${
                      getStatusBadge(doc.status).text
                    }`}
                  >
                    {getStatusBadge(doc.status).icon}
                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                  </div>
                </div>
              </div>
              <div className="text-xs text-slate-500 space-y-1">
                <p>Uploaded on {new Date(doc.uploadedDate).toLocaleDateString("en-IN")} by {doc.uploadedBy}</p>
                {doc.expiryDate && (
                  <p>Expires: {new Date(doc.expiryDate).toLocaleDateString("en-IN")}</p>
                )}
                <p>Size: {doc.size}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <a href={`http://localhost:3000/document/download/${doc.url.split('\\').pop()}`} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button variant="outline" className="w-full gap-2">
                  <Eye className="w-4 h-4" />
                  View
                </Button>
              </a>
              <a href={`http://localhost:3000/document/download/${doc.url.split('\\').pop()}`} download className="flex-1">
                <Button variant="outline" className="w-full gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </a>
              <Button
                onClick={async () => {
                  try {
                    const token = localStorage.getItem("auth_token");
                    const res = await fetch(`http://localhost:3000/document/${doc.id}`, {
                      method: "PATCH",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({ status: "verified" }),
                    });
                    if (res.ok) {
                      setDocuments(
                        documents.map((d) =>
                          d.id === doc.id ? { ...d, status: "verified" } : d
                        )
                      );
                    } else {
                      setError("Failed to verify document");
                    }
                  } catch (error) {
                    setError("An unexpected error occurred. Please try again.");
                  }
                }}
                className="p-2 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <CheckCircle className="w-4 h-4 text-green-600" />
              </Button>
              <button
                onClick={async () => {
                  try {
                    const token = localStorage.getItem("auth_token");
                    const res = await fetch(`http://localhost:3000/document/${doc.id}`, {
                      method: "DELETE",
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    });
                    if (res.ok) {
                      setDocuments(documents.filter((d) => d.id !== doc.id));
                    } else {
                      setError("Failed to delete document");
                    }
                  } catch (error) {
                    setError("An unexpected error occurred. Please try again.");
                  }
                }}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
