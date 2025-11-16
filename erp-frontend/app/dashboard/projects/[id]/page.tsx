"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Tag, Calendar, Users, Image as ImageIcon, ChevronsUpDown } from "lucide-react"
import BackButton from "@/components/BackButton"
import Image from "next/image"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface Project {
  id: string
  name: string
  location: string
  status: string
  startDate: string
  endDate: string
  progress: number
  photos: string[]
  clients: { client: { id: string; name: string } }[]
  phases: { name: string }[]
  members: { name: string }[]
  properties: { plotNumber: string }[]
}

export default function ProjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params
  const [project, setProject] = useState<Project | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!id) return

    const fetchProjectDetails = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        const res = await fetch(`http://localhost:3000/project/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (res.ok) {
          const data = await res.json()
          setProject(data)
        } else {
          setError("Failed to fetch project details")
        }
      } catch (error) {
        setError("An unexpected error occurred. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchProjectDetails()
  }, [id])

  if (loading) return <p>Loading...</p>
  if (error) return <p className="text-destructive">{error}</p>
  if (!project) return <p>Project not found.</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BackButton />
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground">{project.location}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Project Details */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Project Details</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">{project.progress}%</span>
              </div>
              <Progress value={project.progress} />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                    {project.status}
                  </span>
                </div>
                {project.startDate && project.endDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>
                      {new Date(project.startDate).toLocaleDateString()} -{" "}
                      {new Date(project.endDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Photos */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Project Photos</h2>
            {project.photos.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {project.photos.map((photo, index) => (
                  <div key={index} className="relative h-48 w-full">
                    <Image
                      src={`http://localhost:3000/${photo}`}
                      alt={`Project photo ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement
                        target.src = "/placeholder.jpg"
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
                <ImageIcon className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Clients */}
          <Card className="p-6">
            <Collapsible>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Clients</h2>
                  <ChevronsUpDown className="w-5 h-5" />
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent className="mt-4 space-y-4">
                {project.clients && project.clients.length > 0 ? (
                  <>
                    <input
                      type="text"
                      placeholder="Search clients..."
                      className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {project.clients
                        .filter((c) =>
                          c.client.name.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((c, i) => (
                          <button
                            key={i}
                            onClick={() =>
                              router.push(
                                `/dashboard/clients/${
                                  c.client.id || "ckz9f0g7p0001rj1y4c7r2u6p"
                                }`
                              )
                            }
                            className="flex items-center gap-2 text-blue-600 hover:underline w-full text-left"
                          >
                            <Users className="w-5 h-5" />
                            <span>{c.client.name}</span>
                          </button>
                        ))}

                      {project.clients.filter((c) =>
                        c.client.name.toLowerCase().includes(searchTerm.toLowerCase())
                      ).length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          No matching clients found.
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">No clients assigned.</p>
                )}
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Phases */}
          <Card className="p-6">
            <Collapsible>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Phases</h2>
                  <ChevronsUpDown className="w-5 h-5" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-2">
                {project.phases?.length ? (
                  project.phases.map((phase, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span>{phase.name}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No phases found.</p>
                )}
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Team */}
          <Card className="p-6">
            <Collapsible>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Team</h2>
                  <ChevronsUpDown className="w-5 h-5" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-2">
                {project.members?.length ? (
                  project.members.map((member, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span>{member.name}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No team members assigned.</p>
                )}
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Properties */}
          <Card className="p-6">
            <Collapsible>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Properties</h2>
                  <ChevronsUpDown className="w-5 h-5" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-2">
                {project.properties?.length ? (
                  project.properties.map((prop, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span>{prop.plotNumber}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No properties found.</p>
                )}
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </div>
      </div>
    </div>
  )
}
