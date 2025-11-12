"use client"

import { Card } from "@/components/ui/card"

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Messages</h1>
      <Card className="p-6">
        <p>You have no messages.</p>
      </Card>
    </div>
  )
}
