"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search, FileText, Download, Eye, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { Document } from "@/lib/types"
import Link from "next/link"

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const res = await fetch("http://localhost:3000/document", {
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

    fetchDocuments();
  }, []);

  const filteredDocuments = documents.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = async (url: string) => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`http://localhost:3000/document/download/${url.split('\\').pop()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const blob = await res.blob();
        const fileURL = URL.createObjectURL(blob);
        window.open(fileURL, '_blank');
      } else {
        setError("Failed to view document");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const handleDownload = async (url: string, name: string) => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`http://localhost:3000/document/download/${url.split('\\').pop()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const blob = await res.blob();
        const fileURL = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = fileURL;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        setError("Failed to download document");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-muted-foreground">Manage all your documents</p>
        </div>
        <Link href="/dashboard/documents/new">
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
      <div className="space-y-3">
        {filteredDocuments.map((doc) => (
          <Card key={doc.id} className="p-4 flex items-center justify-between">
            <div className="flex items-start gap-3 flex-1">
              <FileText className="w-5 h-5 text-slate-400 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{doc.name}</h3>
                <div className="flex items-center gap-3 mt-1">
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
              <button onClick={() => handleView(doc.url)} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                <Eye className="w-4 h-4 text-slate-600" />
              </button>
              <button onClick={() => handleDownload(doc.url, doc.name)} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                <Download className="w-4 h-4 text-slate-600" />
              </button>
              <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
