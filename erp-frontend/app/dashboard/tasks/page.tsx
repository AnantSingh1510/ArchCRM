"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, GripVertical } from "lucide-react"
import { useEffect, useState } from "react"

interface Task {
  id: string
  name: string
  project: string
  priority: "HIGH" | "MEDIUM" | "LOW"
  dueDate: string
  status: "PENDING" | "IN_PROGRESS" | "IN_REVIEW" | "DONE"
  assignee?: { name: string }
  phase: { project: { name: string } }
}

const STATUSES = ["PENDING", "IN_PROGRESS", "IN_REVIEW", "DONE"] as const

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [error, setError] = useState<string | null>(null)
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("http://localhost:3000/task")
        if (res.ok) {
          const data = await res.json()
          setTasks(data)
        } else {
          setError("Failed to fetch tasks")
        }
      } catch (error) {
        setError("An unexpected error occurred. Please try again.")
      }
    }

    fetchTasks()
  }, [])

  const handleDragStart = (task: Task) => {
    setDraggedTask(task)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = async (status: Task["status"]) => {
    if (!draggedTask) return
    if (draggedTask.status === status) {
      setDraggedTask(null)
      return
    }

    try {
      const res = await fetch(`http://localhost:3000/task/${draggedTask.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (res.ok) {
        setTasks(
          tasks.map((task) =>
            task.id === draggedTask.id ? { ...task, status } : task
          )
        )
      } else {
        setError("Failed to update task status")
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setDraggedTask(null)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-50 text-red-700 border-red-200"
      case "MEDIUM":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "LOW":
        return "bg-green-50 text-green-700 border-green-200"
      default:
        return "bg-gray-50 text-gray-700"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-slate-50 border-slate-200"
      case "IN_PROGRESS":
        return "bg-blue-50 border-blue-200"
      case "IN_REVIEW":
        return "bg-purple-50 border-purple-200"
      case "DONE":
        return "bg-green-50 border-green-200"
      default:
        return "bg-white"
    }
  }

  const getTasksByStatus = (status: Task["status"]) => tasks.filter((task) => task.status === status)

  return (
    <div className="space-y-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">Manage tasks with Kanban board</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Task
        </Button>
      </div>

      {error && <p className="text-destructive">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-[calc(100vh-250px)]">
        {STATUSES.map((status) => {
          const statusTasks = getTasksByStatus(status)
          return (
            <div
              key={status}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(status)}
              className={`rounded-lg border-2 border-dashed p-4 flex flex-col transition-colors ${getStatusColor(status)}`}
            >
              <div className="mb-4">
                <h2 className="font-semibold text-lg">{status}</h2>
                <p className="text-xs text-muted-foreground">
                  {statusTasks.length} task{statusTasks.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto">
                {statusTasks.map((task) => (
                  <Card
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    className={`p-4 cursor-grab active:cursor-grabbing border hover:shadow-md transition-all ${
                      draggedTask?.id === task.id ? "opacity-50" : ""
                    }`}
                  >
                    <div className="flex gap-2 mb-3">
                      <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm line-clamp-2">{task.name}</h3>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-muted-foreground truncate">{task.phase.project.name}</span>
                        <span
                          className={`px-2 py-0.5 rounded font-semibold flex-shrink-0 ${getPriorityColor(task.priority)}`}
                        >
                          {task.priority}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-muted-foreground">{new Date(task.dueDate).toLocaleDateString()}</span>
                        {task.assignee && (
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-semibold text-primary">
                              {task.assignee.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}

                {statusTasks.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <p className="text-sm">No tasks yet</p>
                    <p className="text-xs">Drag tasks here</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
