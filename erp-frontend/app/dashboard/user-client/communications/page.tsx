"use client"

import { useEffect, useState } from "react"
import { Card } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Textarea } from "../../../../components/ui/textarea"
import { MessageSquare } from "lucide-react"
import Link from "next/link"

export default function CommunicationsPage() {
  const [communications, setCommunications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

  const fetchCommunications = async () => {
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
        setCommunications(data.communications)
      }
    } catch (error) {
      console.error("Error fetching communications:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCommunications()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) return
      const payload = JSON.parse(atob(token.split('.')[1]))
      const clientId = payload.clientId
      const res = await fetch(`http://localhost:3000/communication`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "MESSAGE",
          subject,
          message,
          clientId,
        }),
      })
      if (res.ok) {
        setSubject("")
        setMessage("")
        fetchCommunications()
      }
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Messages</h1>
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Send a new message</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
              Subject
            </label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject"
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message"
              required
            />
          </div>
          <Button type="submit">Send Message</Button>
        </form>
      </Card>
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Message History</h2>
        <div className="space-y-4">
          {communications.map((comm) => (
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
    </div>
  )
}
