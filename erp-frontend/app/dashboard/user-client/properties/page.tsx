"use client"

import { Card } from "@/components/ui/card"

export default function PropertiesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Properties</h1>
      <Card className="p-6">
        <p>You have no properties.</p>
      </Card>
    </div>
  )
}
