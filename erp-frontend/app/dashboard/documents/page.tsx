"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, Download, Trash2, Eye, Lock, Clock, Filter, Tag, Search } from "lucide-react"
import type { Document } from "@/lib/types"

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "doc-1",
      name: "Architectural Blueprints - Block A",
      type: "pdf",
      url: "/documents/blueprints-a.pdf",
      projectId: "proj-1",
      uploadedBy: "emp-1",
      uploadedAt: new Date("2024-11-01"),
      version: 3,
      tags: ["blueprints", "design", "approved"],
      accessControl: ["emp-1", "emp-2", "owner-1", "admin-1"],
    },
    {
      id: "doc-2",
      name: "Site Inspection Photos - November",
      type: "image",
      url: "/documents/site-photos.zip",
      projectId: "proj-1",
      uploadedBy: "emp-2",
      uploadedAt: new Date("2024-11-15"),
      version: 1,
      tags: ["photos", "inspection", "site"],
      accessControl: ["emp-1", "emp-2", "owner-1"],
    },
    {
      id: "doc-3",
      name: "Construction Contract - Bandra Residency",
      type: "pdf",
      url: "/documents/contract.pdf",
      projectId: "proj-1",
      uploadedBy: "admin-1",
      uploadedAt: new Date("2024-10-15"),
      version: 2,
      tags: ["contract", "legal", "signed"],
      accessControl: ["admin-1", "owner-1"],
    },
    {
      id: "doc-4",
      name: "Structural Drawings - Phase 2",
      type: "pdf",
      url: "/documents/structural-phase2.pdf",
      projectId: "proj-1",
      uploadedBy: "emp-1",
      uploadedAt: new Date("2024-10-20"),
      version: 1,
      tags: ["structural", "engineering", "phase2"],
      accessControl: ["emp-1", "emp-2", "emp-3"],
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("recent")

  const allTags = Array.from(new Set(documents.flatMap((d) => d.tags)))

  const filteredDocs = documents.filter(
    (doc) =>
      (doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (selectedTag === null || doc.tags.includes(selectedTag)),
  )

  const sortedDocs = [...filteredDocs].sort((a, b) => {
    if (sortBy === "recent") return b.uploadedAt.getTime() - a.uploadedAt.getTime()
    if (sortBy === "name") return a.name.localeCompare(b.name)
    return b.version - a.version
  })

  const handleDelete = (id: string) => {
    setDocuments(documents.filter((d) => d.id !== id))
  }

  const getFileIcon = (type: string) => {
    const icons: Record<string, string> = {
      pdf: "📄",
      image: "🖼️",
      zip: "📦",
      doc: "📝",
    }
    return icons[type] || "📄"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Project Documents</h1>
          <p className="text-muted-foreground">Manage blueprints, contracts, and project files</p>
        </div>
        <Button className="gap-2">
          <Upload className="w-4 h-4" />
          Upload Document
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Documents</p>
          <p className="text-3xl font-bold mt-2">{documents.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Size</p>
          <p className="text-3xl font-bold mt-2">2.4 GB</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Latest Version</p>
          <p className="text-3xl font-bold mt-2">v{Math.max(...documents.map((d) => d.version))}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Active Tags</p>
          <p className="text-3xl font-bold mt-2">{allTags.length}</p>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card className="p-4 space-y-3">
        <div className="flex gap-2">
          <Search className="w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-0 bg-transparent flex-1"
          />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">FILTER BY TAG</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                selectedTag === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-3 py-1 text-xs rounded-full font-medium transition-colors flex items-center gap-1 ${
                  selectedTag === tag
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                <Tag className="w-3 h-3" />
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
          >
            <option value="recent">Most Recent</option>
            <option value="name">By Name</option>
            <option value="version">Latest Version</option>
          </select>
        </div>
      </Card>

      {/* Documents Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedDocs.map((doc) => (
          <Card key={doc.id} className="p-4 border hover:border-primary/50 transition-colors hover:shadow-lg">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-2xl">{getFileIcon(doc.type)}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm line-clamp-2">{doc.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">v{doc.version}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 hover:opacity-100 transition-opacity">
                  <button className="p-1 hover:bg-secondary rounded">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(doc.id)} className="p-1 hover:bg-destructive/10 rounded">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>

              {/* Meta */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {doc.uploadedAt.toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock className="w-3 h-3" />
                  {doc.accessControl.length} people
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {doc.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 text-xs bg-secondary rounded-full text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-border/30">
                <Button size="sm" variant="outline" className="flex-1 gap-1 bg-transparent">
                  <Download className="w-3 h-3" />
                  Download
                </Button>
                <Button size="sm" variant="outline" className="flex-1 gap-1 bg-transparent">
                  <Eye className="w-3 h-3" />
                  Preview
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Version History */}
      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Version Updates
        </h2>
        <div className="space-y-2">
          {documents.slice(0, 5).map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg text-sm">
              <div>
                <p className="font-medium">{doc.name}</p>
                <p className="text-xs text-muted-foreground">
                  Version {doc.version} • {doc.uploadedAt.toLocaleDateString()}
                </p>
              </div>
              <Button size="sm" variant="outline">
                View All Versions
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
