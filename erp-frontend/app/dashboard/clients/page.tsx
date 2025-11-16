"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, MoreVertical, Mail, Phone, FileText, Search, Building2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/context/auth-context"

interface Client {
  id: string
  name: string
  email: string
  phone: string
  properties: { project: { name: string } }[]
  status: string
  kycStatus: string
  documents: number
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null)
  const router = useRouter();
  const { token } = useAuthContext();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch("http://localhost:3000/client", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
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

  const handleDeleteClick = (client: Client, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setClientToDelete(client)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!clientToDelete) return

    try {
      const token = localStorage.getItem("auth_token")
      const res = await fetch(`http://localhost:3000/client/${clientToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (res.ok) {
        setClients(clients.filter((c) => c.id !== clientToDelete.id))
        setDeleteDialogOpen(false)
        setClientToDelete(null)
      } else {
        setError("Failed to delete client")
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
    }
  }

  const getKYCBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string }> = {
      approved: { bg: "bg-green-100", text: "text-green-800" },
      pending: { bg: "bg-yellow-100", text: "text-yellow-800" },
      incomplete: { bg: "bg-gray-100", text: "text-gray-800" },
    }
    return badges[status] || badges.incomplete
  }

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

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

      {/* Search Bar */}
      <Card className="p-4 border border-border">
        <div className="flex gap-2">
          <Search className="w-5 h-5 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search clients by name or email..."
            className="border-0 bg-transparent"
          />
        </div>
      </Card>

      {/* Clients Grid */}
      {error && <p className="text-destructive">{error}</p>}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map((client) => {
          const kycBadge = getKYCBadge(client.kycStatus)
          return (
            <Card key={client.id} className="p-4 flex flex-col justify-between">
              <div>
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 hover:bg-secondary rounded-lg">
                        <MoreVertical className="w-5 h-5 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/dashboard/clients/${client.id}`)
                        }}
                      >
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/dashboard/clients/${client.id}/edit`)
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/dashboard/clients/${client.id}/documents`)
                        }}
                      >
                        Documents
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => handleDeleteClick(client, e)}
                        className="text-red-600 focus:text-red-600"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-border flex-wrap">
                  <div>
                    <p className="text-xs text-muted-foreground">Project</p>
                    <p className="text-lg font-bold flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {client.properties && client.properties.length > 0
                        ? client.properties[0].project.name
                        : "No Project"}
                    </p>
                  </div>
                  <span className="ml-auto px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                    {client.status}
                  </span>
                </div>
              </div>
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Client</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{clientToDelete?.name}"? This action cannot be undone and will remove all associated data including documents and project relationships.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}