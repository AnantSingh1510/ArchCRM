"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { CreditCard, Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "../../../../components/ui/button"
import { useRouter } from "next/navigation"

export default function PaymentDetailsPage() {
  const router = useRouter()
  const [clientData, setClientData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        if (!token) return
        const payload = JSON.parse(atob(token.split('.')[1]))
        const clientId = payload.clientId
        const res = await fetch(`http://localhost:3000/client/${clientId}/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (res.ok) {
          const data = await res.json()
          setClientData(data)
        }
      } catch (error) {
        console.error("Error fetching payment details:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPaymentDetails()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Payment Details</h1>
        <Button onClick={() => router.push('/dashboard/user-client/make-payment')}>
          Make a Payment
        </Button>
      </div>

      {clientData?.invoices && clientData.invoices.length > 0 && (
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-yellow-800 flex items-center">
              <Calendar className="mr-2" /> Next Payment Due
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="text-lg font-bold text-gray-800">₹{clientData.invoices[0].amount.toLocaleString()}</p>
            <p className="font-semibold text-gray-600">Due on {new Date(clientData.invoices[0].dueDate).toLocaleDateString()}</p>
          </CardContent>
        </Card>
      )}

      {clientData?.properties?.map((prop: any) => {
        const totalPaid = clientData.payments?.reduce((acc: number, p: any) => acc + p.amount, 0) || 0
        const outstanding = prop.totalAmount - totalPaid
        const progress = (totalPaid / prop.totalAmount) * 100

        return (
          <Card key={prop.id} className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <CreditCard className="mr-2" /> {prop.project?.name || 'Project Name Not Available'}
            </h2>
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
              {clientData.payments?.map((payment: any) => (
                <Link key={payment.id} href={`/dashboard/user-client/invoices/${payment.invoiceId}`}>
                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg cursor-pointer hover:bg-gray-100">
                    <div>
                      <p className="font-semibold text-gray-800">₹{payment.amount.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{new Date(payment.date).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${payment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                      {payment.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
