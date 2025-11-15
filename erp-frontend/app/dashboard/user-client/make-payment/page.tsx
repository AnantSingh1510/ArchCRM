"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { useRouter } from "next/navigation"
import BackButton from "../../../../components/BackButton"

export default function MakePaymentPage() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [selectedInvoice, setSelectedInvoice] = useState<string>("")
  const [amount, setAmount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        if (!token) return
        const payload = JSON.parse(atob(token.split('.')[1]))
        const clientId = payload.clientId
        const res = await fetch(`http://localhost:3000/invoice/client/${clientId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (res.ok) {
          const data = await res.json()
          setInvoices(data.filter((invoice: any) => invoice.status === 'PENDING'))
        }
      } catch (error) {
        console.error("Error fetching invoices:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchInvoices()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) return
      const payload = JSON.parse(atob(token.split('.')[1]))
      const clientId = payload.clientId
      const res = await fetch(`http://localhost:3000/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          invoiceId: selectedInvoice,
          amount,
          clientId,
        }),
      })
      if (res.ok) {
        router.push("/dashboard/user-client/payment-details")
      }
    } catch (error) {
      console.error("Error making payment:", error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Make a Payment</h1>
        <BackButton />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>New Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="invoice" className="block text-sm font-medium text-gray-700">
                Select Invoice
              </label>
              <Select onValueChange={setSelectedInvoice} value={selectedInvoice}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an invoice to pay" />
                </SelectTrigger>
                <SelectContent>
                  {invoices.map((invoice) => (
                    <SelectItem key={invoice.id} value={invoice.id}>
                      Invoice #{invoice.id} - ₹{invoice.amount.toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Enter amount"
                required
              />
            </div>
            <Button type="submit">Submit Payment</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
