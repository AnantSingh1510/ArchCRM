"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, MoreVertical, Mail, Phone, FileText } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface Client {
  id: string
  name: string
  email: string
  phone: string
  projects: any[]
  status: string
  kycStatus: string
  documents: number
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch("http://localhost:3000/client")
        if (res.ok) {
          const data = await res.json()
          setClients(data)
        } else {
          setError("Failed to fetch clients")
        }
      } catch (error) {
        setError("An unexpected error occurred. Please try again.")
      }
    }

    fetchClients()
  }, [])

  const getKYCBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string }> = {
      approved: { bg: "bg-green-100", text: "text-green-800" },
      pending: { bg: "bg-yellow-100", text: "text-yellow-800" },
      incomplete: { bg: "bg-gray-100", text: "text-gray-800" },
    }
    return badges[status] || badges.incomplete
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-muted-foreground">Manage your client relationships and documents</p>
        </div>
        <Link href="/dashboard/clients/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Client
          </Button>
        </Link>
      </div>

      {/* Clients Grid */}
      {error && <p className="text-destructive">{error}</p>}
      <div className="grid gap-6">
        {clients.map((client) => {
          const kycBadge = getKYCBadge(client.kycStatus)
          return (
            <Card key={client.id} className="p-6 hover:border-primary/50 transition-colors hover:shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold">{client.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${kycBadge.bg} ${kycBadge.text}`}>
                      KYC {client.kycStatus}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {client.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {client.phone}
                    </div>
                  </div>
                </div>
                <button className="p-2 hover:bg-secondary rounded-lg">
                  <MoreVertical className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Documents and Status */}
              <div className="flex items-center gap-4 pt-4 border-t border-border flex-wrap">
                <div>
                  <p className="text-xs text-muted-foreground">Active Projects</p>
                  <p className="text-lg font-bold">{client.projects.length}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Documents</p>
                  <p className="text-lg font-bold flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {client.documents}
                  </p>
                </div>
                <span className="ml-auto px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                  {client.status}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <Link href={`/dashboard/clients/${client.id}`} className="flex-1">
                  <Button variant="outline" className="w-full bg-transparent">
                    View Details
                  </Button>
                </Link>
                <Link href={`/dashboard/clients/${client.id}/documents`} className="flex-1">
                  <Button variant="outline" className="w-full gap-2 bg-transparent">
                    <FileText className="w-4 h-4" />
                    Documents
                  </Button>
                </Link>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
