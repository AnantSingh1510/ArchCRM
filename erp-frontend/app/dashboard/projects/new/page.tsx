"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MultiSelect } from "@/components/ui/multi-select"
import { FileUpload } from "@/components/ui/file-upload"
import BackButton from "@/components/BackButton"

export default function NewProjectPage() {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    groupName: "",
    unitType: "",
    tower: "",
    floor: "",
    clientIds: [] as string[],
  })
  const [files, setFiles] = useState<File[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        const res = await fetch("http://localhost:3000/client", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (res.ok) {
          const data = await res.json()
          setClients(data)
        } else {
          setError("Failed to fetch clients")
        }
      } catch (error) {
        setError("An unexpected error occurred. Please try again.")
      }
    }

    fetchClients()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name || !formData.location) {
      setError("Please fill in all fields")
      return
    }

    const projectData = new FormData()
    projectData.append("name", formData.name)
    projectData.append("location", formData.location)
    projectData.append("groupName", formData.groupName)
    projectData.append("unitType", formData.unitType)
    projectData.append("tower", formData.tower)
    projectData.append("floor", formData.floor)
    formData.clientIds.forEach((id) => projectData.append("clientIds[]", id))
    files.forEach((file) => projectData.append("photos", file))

    try {
      const token = localStorage.getItem("auth_token")
      const res = await fetch("http://localhost:3000/project", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: projectData,
      })

      if (res.ok) {
        router.push("/dashboard/projects")
      } else {
        const errorData = await res.json()
        setError(errorData.message || "Failed to create project")
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
    }
  }

  const clientOptions = clients.map((client) => ({
    value: client.id,
    label: client.name,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BackButton />
        <div>
          <h1 className="text-3xl font-bold">New Project</h1>
          <p className="text-muted-foreground">Create a new project and assign it to clients</p>
        </div>
      </div>

      <Card className="p-8">
        {error && (
          <div className="mb-6 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleCreateProject} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="groupName">Group Name</Label>
              <Input
                id="groupName"
                type="text"
                name="groupName"
                value={formData.groupName}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unitType">Unit Type</Label>
              <Input
                id="unitType"
                type="text"
                name="unitType"
                value={formData.unitType}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tower">Tower</Label>
              <Input
                id="tower"
                type="text"
                name="tower"
                value={formData.tower}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="floor">Floor</Label>
              <Input
                id="floor"
                type="text"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Project Photos</Label>
            <FileUpload onFilesChange={setFiles} />
          </div>
          <Button type="submit" className="w-full">
            Create Project
          </Button>
        </form>
      </Card>
    </div>
  )
}
