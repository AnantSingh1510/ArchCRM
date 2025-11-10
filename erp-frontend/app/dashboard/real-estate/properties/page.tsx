"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Plus, Grid, List } from "lucide-react"
import type { Property } from "@/lib/types"

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([
    {
      id: "prop-1",
      name: "Unit 501 - Bandra Residency",
      address: "Bandra, Mumbai",
      city: "Mumbai",
      area: 2500,
      price: 55000000,
      projectId: "proj-1",
      clientId: "client-1",
      status: "sold",
      photos: ["/residential-unit.jpg"],
      details: {
        bedrooms: 3,
        bathrooms: 2,
        parking: 2,
        amenities: ["Pool", "Gym", "Security"],
      },
    },
    {
      id: "prop-2",
      name: "Office Space - BKC Tower",
      address: "Bandra Kurla Complex, Mumbai",
      city: "Mumbai",
      area: 8000,
      price: 122000000,
      projectId: "proj-2",
      clientId: "client-2",
      status: "booked",
      paymentPlanId: "pp-1",
      photos: ["/commercial-office.jpg"],
      details: {
        floors: 1,
        configuration: "Open Plan",
        amenities: ["Parking", "Cafeteria", "Telecom Ready"],
      },
    },
    {
      id: "prop-3",
      name: "Retail Unit G-01 - Mixed-Use",
      address: "Lower Parel, Mumbai",
      city: "Mumbai",
      area: 1200,
      price: 28000000,
      projectId: "proj-3",
      clientId: "client-3",
      status: "available",
      photos: ["/retail-shop.jpg"],
      details: {
        floors: 1,
        layout: "Ground Floor Retail",
        amenities: ["High Street Access", "Parking"],
      },
    },
  ])

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const filteredProperties = filterStatus === "all" ? properties : properties.filter((p) => p.status === filterStatus)

  const statusColors: Record<string, string> = {
    available: "bg-green-100 text-green-800",
    booked: "bg-blue-100 text-blue-800",
    sold: "bg-purple-100 text-purple-800",
  }

  const statusIcons: Record<string, any> = {
    available: "✓",
    booked: "⏳",
    sold: "✓✓",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Properties</h1>
          <p className="text-muted-foreground">Real estate listings with payment plans</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Property
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Properties</p>
          <p className="text-3xl font-bold mt-2">{properties.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Available</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {properties.filter((p) => p.status === "available").length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Value</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            ₹{(properties.reduce((sum, p) => sum + p.price, 0) / 10000000).toFixed(0)}Cr
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Area</p>
          <p className="text-3xl font-bold mt-2">
            {(properties.reduce((sum, p) => sum + p.area, 0) / 1000).toFixed(1)}K sqft
          </p>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg bg-background"
        >
          <option value="all">All Properties</option>
          <option value="available">Available</option>
          <option value="booked">Booked</option>
          <option value="sold">Sold</option>
        </select>

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Properties */}
      {viewMode === "grid" ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((prop) => (
            <Card
              key={prop.id}
              className="overflow-hidden border hover:border-primary/50 transition-colors hover:shadow-lg"
            >
              {/* Image */}
              <div className="h-48 bg-secondary/30 relative overflow-hidden">
                <img
                  src={prop.photos[0] || "/placeholder.svg"}
                  alt={prop.name}
                  className="w-full h-full object-cover"
                />
                <div
                  className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusColors[prop.status]}`}
                >
                  {statusIcons[prop.status]} {prop.status.charAt(0).toUpperCase() + prop.status.slice(1)}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-sm">{prop.name}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {prop.address}
                  </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2 bg-secondary/30 rounded text-center">
                    <p className="text-xs text-muted-foreground">Area</p>
                    <p className="font-semibold">{prop.area.toLocaleString()} sqft</p>
                  </div>
                  <div className="p-2 bg-secondary/30 rounded text-center">
                    <p className="text-xs text-muted-foreground">Price</p>
                    <p className="font-semibold">₹{(prop.price / 10000000).toFixed(1)}Cr</p>
                  </div>
                </div>

                {/* Tags */}
                {prop.details && (
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(prop.details)
                      .slice(0, 3)
                      .map(([key, val]) => (
                        <span key={key} className="px-2 py-0.5 text-xs bg-secondary rounded text-muted-foreground">
                          {Array.isArray(val) ? val.join(", ") : val}
                        </span>
                      ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-border/30">
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    View Details
                  </Button>
                  {prop.paymentPlanId && (
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      Payment Plan
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredProperties.map((prop) => (
            <Card key={prop.id} className="p-4 border hover:border-primary/50">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={prop.photos[0] || "/placeholder.svg"}
                    alt={prop.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{prop.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {prop.address}
                    </p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span>{prop.area.toLocaleString()} sqft</span>
                      <span>₹{(prop.price / 10000000).toFixed(1)}Cr</span>
                      <span className={`font-semibold px-2 py-0.5 rounded-full text-xs ${statusColors[prop.status]}`}>
                        {prop.status}
                      </span>
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  View
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
