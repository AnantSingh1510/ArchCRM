"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, MoreVertical, MapPin, Users, Search } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Image from "next/image"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"

interface Project {
  id: string
  name: string
  location: string
  status: string
  progress: number
  photos: string[]
  clients: { client: { id: string, name: string } }[]
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)
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

  const handleDeleteClick = (project: Project, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setProjectToDelete(project)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!projectToDelete) return

    try {
      const token = localStorage.getItem("auth_token")
      const res = await fetch(`http://localhost:3000/project/${projectToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== projectToDelete.id))
        setDeleteDialogOpen(false)
        setProjectToDelete(null)
      } else {
        setError("Failed to delete project")
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
    }
  }

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

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

      <Card className="p-4 border border-border">
        <div className="flex gap-2">
          <Search className="w-5 h-5 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects by name or location..."
            className="border-0 bg-transparent"
          />
        </div>
      </Card>

      {error && <p className="text-destructive">{error}</p>}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <div key={project.id} className="block">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
              <Link href={`/dashboard/projects/${project.id}`}>
                <div className="relative h-48 w-full">
                  <Image
                    src={project.photos.length > 0 ? `http://localhost:3000/${project.photos[0]}` : "/placeholder.jpg"}
                    alt={`Thumbnail for ${project.name}`}
                    layout="fill"
                    objectFit="cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.jpg"
                    }}
                  />
                </div>
              </Link>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <Link href={`/dashboard/projects/${project.id}`} className="flex-1">
                    <div>
                      <h3 className="text-xl font-bold">{project.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {project.location}
                      </div>
                    </div>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 hover:bg-secondary rounded-lg">
                        <MoreVertical className="w-5 h-5 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/dashboard/projects/${project.id}/edit`)
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => handleDeleteClick(project, e)}
                        className="text-red-600 focus:text-red-600"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 flex-wrap">
                  <Users className="w-4 h-4" />
                  {project.clients.map((c, i) => (
                    <Link
                      key={c.client.id}
                      href={`/dashboard/clients/${c.client.id}`}
                      className="hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {c.client.name}{i < project.clients.length - 1 ? ', ' : ''}
                    </Link>
                  ))}
                </div>
                <Link href={`/dashboard/projects/${project.id}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-muted-foreground">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} />
                </Link>
              </div>
            </Card>
          </div>
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{projectToDelete?.name}"? This action cannot be undone and will remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}