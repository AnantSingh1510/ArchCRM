"use client"

import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { Building2, MapPin, Tag } from "lucide-react"
import { useAuthContext } from "@/context/auth-context"
import Link from "next/link"
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
  }
}

export default function PropertiesPage() {
  const { user, loading, token } = useAuthContext()
  const [properties, setProperties] = useState<Property[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (loading || !token || !user) return

    const fetchProperties = async () => {
      try {
        const res = await fetch(`http://localhost:3000/property/user/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (res.ok) {
          const data = await res.json()
          setProperties(data)
        } else {
          setError("Failed to fetch properties")
        }
      } catch (error) {
        setError("An unexpected error occurred. Please try again.")
      }
    }

    fetchProperties()
  }, [user, loading, token])

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Properties</h1>
      {error && <p className="text-destructive">{error}</p>}
      {properties.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <Link href={`/dashboard/user-client/properties/${property.id}`} key={property.id}>
              <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-lg">
                <div className="relative h-48 w-full">
                  <Image
                    src="/placeholder.jpg"
                    alt={`Thumbnail for ${property.plotNumber}`}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{property.plotNumber}</h3>
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
        </div>
      ) : (
        <Card className="p-6">
          <p>You have no properties.</p>
        </Card>
      )}
    </div>
  )
}
