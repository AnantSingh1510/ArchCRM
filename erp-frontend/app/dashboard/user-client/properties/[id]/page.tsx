"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Building2, MapPin, Tag, Calendar, Hash } from "lucide-react"
import BackButton from "@/components/BackButton"
import Image from "next/image"

interface Property {
  id: string
  plotNumber: string
  dimensions: string
  location: string
  type: string
  status: string
  project: {
    name: string
    status: string
    startDate: string
    endDate: string
  }
  createdAt: string
}

export default function PropertyDetailsPage() {
  const params = useParams()
  const { id } = params
  const [property, setProperty] = useState<Property | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const fetchPropertyDetails = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        const res = await fetch(`http://localhost:3000/property/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (res.ok) {
          const data = await res.json()
          setProperty(data)
        } else {
          setError("Failed to fetch property details")
        }
      } catch (error) {
        setError("An unexpected error occurred. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchPropertyDetails()
  }, [id])

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p className="text-destructive">{error}</p>
  }

  if (!property) {
    return <p>Property not found.</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BackButton />
        <div>
          <h1 className="text-3xl font-bold">Property Details</h1>
          <p className="text-muted-foreground">Plot Number: {property.plotNumber}</p>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="relative h-64 w-full">
          <Image
            src="/placeholder.jpg"
            alt={`Image of ${property.plotNumber}`}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="p-6 space-y-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">{property.project.name}</h2>
            <p className="text-lg text-muted-foreground">{property.dimensions}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{property.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              <span>{property.type}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              <span className="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                {property.status}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>
                {new Date(property.project.startDate).toLocaleDateString()} -{" "}
                {new Date(property.project.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Hash className="w-5 h-5" />
              <span>Added on {new Date(property.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
