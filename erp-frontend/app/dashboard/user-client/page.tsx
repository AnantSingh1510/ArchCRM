"use client"

import { useEffect, useState } from "react"
import { Card } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { ArrowLeft, Mail, Phone, MapPin, FileText, Download, Eye, Trash2, Plus, Calendar, Edit, Building2, Tag } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthContext } from "../../../context/auth-context"

export default function ClientPortalPage() {
  const [client, setClient] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { token } = useAuthContext()

  useEffect(() => {
    const fetchClient = async () => {
      try {        
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
          router.push("/dashboard")
          return
        }
        
        const res = await fetch(`http://localhost:3000/client/${clientId}/dashboard`, {
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
    <div className="space-y-8 p-4 md:p-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {client.name}</h1>
          <p className="text-gray-500">Here's a snapshot of your account with us.</p>
        </div>
        <Button variant="outline" onClick={() => {
          localStorage.removeItem("auth_token")
          router.push("/login")
        }}>
          Log Out
        </Button>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center">
              <FileText className="mr-2" /> Projects & Units
            </h2>
            {client.properties?.map((property: any) => (
              <Link href={`/dashboard/user-client/properties/${property.id}`} key={property.id}>
                <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-lg mb-6">
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2">{property.project.name}</h3>
                    <p className="text-muted-foreground mb-4">{property.dimensions}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{property.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        <span>{property.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {property.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </Card>

          <Card className="p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center">
              <Calendar className="mr-2" /> Payment Details
            </h2>
            {client.properties?.map((prop: any) => {
              const totalPaid = client.payments?.reduce((acc: number, p: any) => acc + p.amount, 0) || 0
              const outstanding = prop.totalAmount - totalPaid
              const progress = (totalPaid / prop.totalAmount) * 100

              return (
                <div key={prop.id}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Total Payable</label>
                      <p className="text-lg font-bold text-gray-800 mt-1">₹{prop.totalAmount?.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Amount Paid</label>
                      <p className="text-lg font-bold text-green-600 mt-1">₹{totalPaid.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Outstanding</label>
                      <p className="text-lg font-bold text-red-600 mt-1">₹{outstanding.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-700 mt-8 mb-4">Payment History</h3>
                  <div className="space-y-4">
                    {client.payments?.map((payment: any) => (
                      <div key={payment.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                        <div>
                          <p className="font-semibold text-gray-800">₹{payment.amount.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">{new Date(payment.date).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${payment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                          {payment.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </Card>

          <Card className="p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center">
              <FileText className="mr-2" /> Financial & Tax Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <p><span className="font-semibold">GST Number:</span> {client.gstNumber}</p>
              <p><span className="font-semibold">PAN Number:</span> {client.panNumber}</p>
              <p><span className="font-semibold">Aadhaar Number:</span> {client.aadhaarNumber}</p>
              <p><span className="font-semibold">Bank Account Number:</span> {client.bankAccountNumber}</p>
              <p><span className="font-semibold">IFSC Code:</span> {client.ifscCode}</p>
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          {client.invoices && client.invoices.length > 0 && (
            <Card className="p-6 shadow-sm bg-yellow-50 border-yellow-200">
              <h2 className="text-2xl font-bold text-yellow-800 mb-4 flex items-center">
                <Calendar className="mr-2" /> Next Payment Due
              </h2>
              <div className="space-y-2 text-sm">
                <p className="text-lg font-bold text-gray-800">₹{client.invoices[0].amount.toLocaleString()}</p>
                <p className="font-semibold text-gray-600">Due on {new Date(client.invoices[0].dueDate).toLocaleDateString()}</p>
              </div>
            </Card>
          )}

          <Card className="p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center">
              <Mail className="mr-2" /> Recent Communications
            </h2>
            <div className="space-y-4">
              {client.communications?.map((comm: any) => (
                <Link key={comm.id} href={`/dashboard/user-client/communications/${comm.id}`}>
                  <div className="border-b pb-4 hover:bg-gray-50 p-2 rounded-lg cursor-pointer">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-gray-800">{comm.subject}</p>
                      <p className="text-xs text-gray-500">{new Date(comm.date).toLocaleDateString()}</p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 truncate">{comm.message}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          <Card className="p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center">
              <Phone className="mr-2" /> Contact Information
            </h2>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">Email:</span> {client.email}</p>
              <p><span className="font-semibold">Primary Phone:</span> {client.phone}</p>
              <p><span className="font-semibold">Alternate Phone:</span> {client.alternatePhone}</p>
              <p><span className="font-semibold">Joined:</span> {new Date(client.joinedDate).toLocaleDateString()}</p>
            </div>
          </Card>

          <Card className="p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center">
              <MapPin className="mr-2" /> Address
            </h2>
            <div className="space-y-2 text-sm">
              <p>{client.address}</p>
              <p>{client.city}, {client.state} - {client.pinCode}</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
