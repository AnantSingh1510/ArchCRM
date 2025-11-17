"use client"

import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Breadcrumb from "@/components/Breadcrumb"

export default function InventoryPage() {
  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <Breadcrumb items={[{ label: "Inventory" }]} />
      <h1 className="text-3xl font-bold my-6 text-foreground">Inventory Management</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Unit Status Report</CardTitle>
            <CardDescription>View project-wise unit status.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/admin/project-details">
              <Button className="w-full">
                View Report <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Applicant Details</CardTitle>
            <CardDescription>View and manage applicant information.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/admin/applicant-details">
              <Button className="w-full">
                Go to Applicant Details <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
        {/* Add more cards here for future options */}
      </div>
    </div>
  )
}
