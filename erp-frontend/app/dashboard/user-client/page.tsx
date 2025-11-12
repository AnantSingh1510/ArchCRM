"use client"

import { useEffect, useState } from "react"
import { Card } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { ArrowLeft, Mail, Phone, MapPin, FileText, Download, Eye, Trash2, Plus, Calendar, Edit } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ClientPortalPage() {
  const [client, setClient] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        
        if (!token) {
          setError("Please log in.")
          setLoading(false)
          router.push("/login")
          return
        }
        
        // Decode JWT to extract client ID from 'clientId' claim
        const payload = JSON.parse(atob(token.split('.')[1]))
        const clientId = payload.clientId
        
        if (!clientId) {
          setError("Invalid token. Please log in again.")
          setLoading(false)
          router.push("/login")
          return
        }
        
        const res = await fetch(`http://localhost:3000/client/${clientId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        
        if (res.ok) {
          const data = await res.json()
          setClient(data)
        } else if (res.status === 401) {
          setError("Session expired. Please log in again.")
          router.push("/login")
        } else {
          setError("Failed to fetch client data")
        }
      } catch (error) {
        console.error("Error:", error)
        setError("An unexpected error occurred. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchClient()
  }, [router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <p className="text-destructive">{error}</p>
  }

  if (!client) {
    return <div>Client not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {client.name}</h1>
          <p className="text-muted-foreground">Here's an overview of your account.</p>
        </div>
        <Button variant="outline" onClick={() => {
          localStorage.removeItem("auth_token")
          router.push("/login")
        }}>
          Log Out
        </Button>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Your Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-semibold text-slate-600">Email Address</label>
            <p className="text-slate-900 mt-2">{client.email}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">Primary Phone</label>
            <p className="text-slate-900 mt-2">{client.phone}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">Alternate Phone</label>
            <p className="text-slate-900 mt-2">{client.alternatePhone}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">Joined Date</label>
            <p className="text-slate-900 mt-2">{new Date(client.joinedDate).toLocaleDateString()}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Address Information</h2>
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
            <p className="text-slate-900 mt-2">{client.pinCode}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Financial & Tax Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-semibold text-slate-600">GST Number</label>
            <p className="text-slate-900 mt-2">{client.gstNumber}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">PAN Number</label>
            <p className="text-slate-900 mt-2">{client.panNumber}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">Aadhaar Number (Last 4 Digits)</label>
            <p className="text-slate-900 mt-2">{client.aadhaarNumber}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">Bank Account Number</label>
            <p className="text-slate-900 mt-2">{client.bankAccountNumber}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">IFSC Code</label>
            <p className="text-slate-900 mt-2">{client.ifscCode}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
