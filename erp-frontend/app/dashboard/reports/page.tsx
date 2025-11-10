"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Filter, BarChart3, Calendar, X, FileText } from "lucide-react"

interface Report {
  id: number
  title: string
  date: string
  type: "PDF" | "Excel" | "CSV"
  category: "Financial" | "Project" | "Team" | "Client"
  size: string
  downloads: number
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([
    {
      id: 1,
      title: "Monthly Project Summary",
      date: "2024-12-01",
      type: "PDF",
      category: "Project",
      size: "2.4 MB",
      downloads: 5,
    },
    {
      id: 2,
      title: "Quarterly Financial Report",
      date: "2024-10-01",
      type: "Excel",
      category: "Financial",
      size: "1.8 MB",
      downloads: 12,
    },
    {
      id: 3,
      title: "Team Performance Analytics",
      date: "2024-11-15",
      type: "PDF",
      category: "Team",
      size: "3.2 MB",
      downloads: 8,
    },
    {
      id: 4,
      title: "Client Satisfaction Survey",
      date: "2024-11-30",
      type: "PDF",
      category: "Client",
      size: "1.5 MB",
      downloads: 3,
    },
  ])

  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [showGenerateForm, setShowGenerateForm] = useState(false)

  const filteredReports = filterCategory ? reports.filter((r) => r.category === filterCategory) : reports

  const deleteReport = (id: number) => {
    setReports(reports.filter((r) => r.id !== id))
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Financial":
        return "bg-green-50 text-green-700"
      case "Project":
        return "bg-blue-50 text-blue-700"
      case "Team":
        return "bg-purple-50 text-purple-700"
      case "Client":
        return "bg-orange-50 text-orange-700"
      default:
        return "bg-gray-50 text-gray-700"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">View and download reports</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            {/* Filter Dropdown */}
            <div className="absolute right-0 mt-1 hidden peer-open:block bg-card border border-border rounded-lg shadow-lg p-2 z-10">
              {["All", "Financial", "Project", "Team", "Client"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat === "All" ? null : cat)}
                  className={`block w-full text-left px-4 py-2 rounded hover:bg-secondary ${
                    (cat === "All" && !filterCategory) || filterCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={() => setShowGenerateForm(true)} className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Generate Report Form */}
      {showGenerateForm && (
        <Card className="p-6 bg-secondary/30 border-primary/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Generate New Report</h3>
            <button onClick={() => setShowGenerateForm(false)} className="p-1 hover:bg-secondary rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Report Type</label>
                <select className="w-full px-4 py-2 border border-border rounded-lg bg-background">
                  <option>Monthly Summary</option>
                  <option>Quarterly Report</option>
                  <option>Annual Review</option>
                  <option>Project Analytics</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Format</label>
                <select className="w-full px-4 py-2 border border-border rounded-lg bg-background">
                  <option>PDF</option>
                  <option>Excel</option>
                  <option>CSV</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setShowGenerateForm(false)} className="flex-1">
                Generate
              </Button>
              <Button variant="outline" onClick={() => setShowGenerateForm(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Report Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Total Reports</p>
          <p className="text-2xl font-bold">{reports.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Total Downloads</p>
          <p className="text-2xl font-bold">{reports.reduce((sum, r) => sum + r.downloads, 0)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-1">This Month</p>
          <p className="text-2xl font-bold">{reports.filter((r) => r.date.startsWith("2024-12")).length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Avg File Size</p>
          <p className="text-2xl font-bold">2.2 MB</p>
        </Card>
      </div>

      {/* Reports Grid */}
      <div className="grid gap-4">
        {filteredReports.map((report) => (
          <Card key={report.id} className="p-6 hover:border-primary/50 transition-all flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div className="p-3 rounded-lg bg-secondary/50">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg">{report.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getCategoryColor(report.category)}`}>
                    {report.category}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {report.date}
                  </div>
                  <div>{report.size}</div>
                  <div>{report.downloads} downloads</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-50 text-blue-700">{report.type}</span>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                Download
              </Button>
              <button
                onClick={() => deleteReport(report.id)}
                className="p-2 hover:bg-destructive/10 rounded-lg text-destructive"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
