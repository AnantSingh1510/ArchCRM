"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, CheckCircle, Clock, Users, MessageSquare, Target } from "lucide-react"
import Link from "next/link"
import withRole from "@/components/withRole"

function EmployeeDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Employee Dashboard</h1>
        <p className="text-muted-foreground">Your tasks, schedule, and project updates</p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">My Tasks</p>
              <Target className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">12</p>
            <p className="text-xs text-yellow-600">5 due this week</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Completed</p>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold">28</p>
            <p className="text-xs text-green-600">This month</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">In Progress</p>
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold">8</p>
            <p className="text-xs text-blue-600">Currently working</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Assigned Projects</p>
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold">5</p>
            <p className="text-xs text-purple-600">Active assignments</p>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Today's Tasks */}
        <Card className="p-6 md:col-span-2">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Today's Tasks
          </h2>
          <div className="space-y-3">
            {[
              {
                title: "Review blueprints - Site A",
                project: "Bandra Residency",
                priority: "high",
                status: "in-progress",
              },
              { title: "Attend site inspection meeting", project: "BKC Tower", priority: "high", status: "pending" },
              { title: "Prepare progress report", project: "Mixed-Use Dev", priority: "medium", status: "pending" },
              { title: "Client presentation prep", project: "Bandra Residency", priority: "medium", status: "todo" },
            ].map((task, i) => (
              <div
                key={i}
                className="p-3 bg-secondary/30 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{task.project}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-semibold ${
                      task.priority === "high" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Link href="/dashboard/tasks">
            <Button className="w-full mt-4 bg-transparent" variant="outline">
              View All Tasks
            </Button>
          </Link>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link href="/dashboard/tasks">
              <Button className="w-full justify-start text-left bg-transparent" variant="outline">
                ✓ View Tasks
              </Button>
            </Link>
            <Link href="/dashboard/employee/timesheet">
              <Button className="w-full justify-start text-left bg-transparent" variant="outline">
                ⏱️ Log Hours
              </Button>
            </Link>
            <Link href="/dashboard/employee/communication">
              <Button className="w-full justify-start text-left bg-transparent" variant="outline">
                💬 Messages
              </Button>
            </Link>
            <Link href="/dashboard/projects">
              <Button className="w-full justify-start text-left bg-transparent" variant="outline">
                📋 My Projects
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Assigned Projects */}
      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4">My Assigned Projects</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              name: "Bandra Residency",
              progress: 65,
              role: "Design Lead",
              team: 8,
              dueDate: "Mar 2025",
            },
            {
              name: "BKC Commercial Tower",
              progress: 45,
              role: "Site Manager",
              team: 12,
              dueDate: "Jun 2025",
            },
          ].map((project, i) => (
            <Card key={i} className="p-4 border border-border/50">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-sm">{project.name}</h3>
                  <p className="text-xs text-muted-foreground">{project.role}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2 transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t border-border/30">
                  <span>Team: {project.team}</span>
                  <span>{project.dueDate}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Team Communication */}
      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Recent Messages
        </h2>
        <div className="space-y-2">
          {[
            { name: "Project Lead", message: "Please review the latest site photos", time: "2h ago" },
            { name: "Manager", message: "Meeting rescheduled to 3 PM", time: "4h ago" },
            { name: "Colleague", message: "Thanks for the report update", time: "1 day ago" },
          ].map((msg, i) => (
            <div key={i} className="p-3 bg-secondary/20 rounded-lg text-sm">
              <p className="font-medium text-sm">{msg.name}</p>
              <p className="text-muted-foreground">{msg.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{msg.time}</p>
            </div>
          ))}
        </div>
        <Link href="/dashboard/employee/communication">
          <Button className="w-full mt-4 bg-transparent" variant="outline">
            View Messages
          </Button>
        </Link>
      </Card>
    </div>
  )
}

export default withRole("employee")(EmployeeDashboard)
