"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, MoreVertical, MapPin, Calendar } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"

interface Project {
  id: string
  name: string
  location: string
  startDate: string
  endDate: string
  status: string
  progress: number
  team: number
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("http://localhost:3000/project")
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage and track all your projects</p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </Link>
      </div>

      {error && <p className="text-destructive">{error}</p>}
      <div className="grid gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="p-6 hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {project.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(project.startDate).toLocaleDateString()} to {new Date(project.endDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <button className="p-2 hover:bg-secondary rounded-lg">
                <MoreVertical className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">{project.progress}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all" style={{ width: `${project.progress}%` }}></div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Team Size</p>
                <p className="text-lg font-bold">{project.team}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                {project.status}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
