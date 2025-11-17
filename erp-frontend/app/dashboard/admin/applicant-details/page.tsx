"use client"

import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Breadcrumb from "@/components/Breadcrumb"

export default function ApplicantDetailsPage() {
  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <Breadcrumb
        items={[
          { label: "Inventory", href: "/dashboard/admin/inventory" },
          { label: "Applicant Details" },
        ]}
      />
      <h1 className="text-3xl font-bold my-6 text-foreground">Applicant Details</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Applicant Payment File</CardTitle>
            <CardDescription>View and manage applicant payment files.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/admin/applicant-payment-file">
              <Button className="w-full">
                Go to Applicant Payment File <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Applicant Ledger</CardTitle>
            <CardDescription>View applicant ledger details.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Demand Letter</CardTitle>
            <CardDescription>Generate and manage demand letters.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Allotment Letter</CardTitle>
            <CardDescription>Generate and manage allotment letters.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Welcome Letter</CardTitle>
            <CardDescription>Generate and manage welcome letters.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Offer Letter</CardTitle>
            <CardDescription>Generate and manage offer letters.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Cost Sheet</CardTitle>
            <CardDescription>View and manage cost sheets.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Payment Schedule</CardTitle>
            <CardDescription>View and manage payment schedules.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
