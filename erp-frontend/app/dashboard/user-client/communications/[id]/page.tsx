"use client"

import { useEffect, useState } from "react"
import { Card } from "../../../../../components/ui/card"
import { MessageSquare } from "lucide-react"
import { useParams } from "next/navigation"
import BackButton from "../../../../../components/BackButton"

export default function MessageDetailPage() {
  const [message, setMessage] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        if (!token) return
        const res = await fetch(`http://localhost:3000/communication/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (res.ok) {
          const data = await res.json()
          setMessage(data)
        }
      } catch (error) {
        console.error("Error fetching message:", error)
      } finally {
        setLoading(false)
      }
    }
    if (id) {
      fetchMessage()
    }
  }, [id])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!message) {
    return <div>Message not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Message Details</h1>
        <BackButton />
      </div>
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center">
            <MessageSquare className="mr-2" /> {message.subject}
          </h2>
          <p className="text-sm text-gray-500">{new Date(message.date).toLocaleDateString()}</p>
        </div>
        <p className="text-gray-700">{message.message}</p>
      </Card>
    </div>
  )
}
