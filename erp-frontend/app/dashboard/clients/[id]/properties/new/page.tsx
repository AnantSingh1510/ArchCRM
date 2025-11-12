"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import BackButton from "@/components/BackButton"

export default function NewPropertyPage({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState({
    plotNumber: "",
    dimensions: "",
    projectId: "",
  })
  const [projects, setProjects] = useState<any[]>([])
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        const res = await fetch("http://localhost:3000/project", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (res.ok) {
          const data = await res.json()
          setProjects(data)
        } else {
          setError("Failed to fetch projects")
        }
      } catch (error) {
        setError("An unexpected error occurred. Please try again.")
      }
    }

    fetchProjects()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.plotNumber || !formData.dimensions || !formData.projectId) {
      setError("Please fill in all fields")
      return
    }

    try {
      const token = localStorage.getItem("auth_token")
      const res = await fetch("http://localhost:3000/property", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          clientId: params.id,
        }),
      })

      if (res.ok) {
        router.push(`/dashboard/clients/${params.id}`)
      } else {
        const errorData = await res.json()
        setError(errorData.message || "Failed to create property")
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <h1 className="text-3xl font-bold">New Property</h1>
            <p className="text-muted-foreground">Add a new property to this client</p>
          </div>
        </div>
      </div>

      <Card className="p-8">
        {error && (
          <div className="mb-6 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleCreateProperty} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="plotNumber">Plot Number</Label>
            <Input
              id="plotNumber"
              type="text"
              name="plotNumber"
              value={formData.plotNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dimensions">Dimensions</Label>
            <Input
              id="dimensions"
              type="text"
              name="dimensions"
              value={formData.dimensions}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectId">Project</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, projectId: value })} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            Add Property
          </Button>
        </form>
      </Card>
    </div>
  )
}
