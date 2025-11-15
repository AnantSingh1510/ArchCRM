"use client"

import { useEffect, useState } from "react"
import { Card } from "../../../../components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table"
import { Badge } from "../../../../components/ui/badge"
import { useRouter } from "next/navigation"

export default function InvoicesPage() {
  const router = useRouter()
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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
          setInvoices(data)
        }
      } catch (error) {
        console.error("Error fetching invoices:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchInvoices()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Invoices</h1>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow
                key={invoice.id}
                onClick={() => router.push(`/dashboard/user-client/invoices/${invoice.id}`)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <TableCell>{invoice.id}</TableCell>
                <TableCell>₹{invoice.amount.toLocaleString()}</TableCell>
                <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      invoice.status === "PENDING"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }
                  >
                    {invoice.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
