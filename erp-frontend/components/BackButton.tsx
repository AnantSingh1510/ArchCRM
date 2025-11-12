"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function BackButton() {
  const router = useRouter()

  return (
    <Button variant="outline" onClick={() => router.back()} className="gap-2">
      <ArrowLeft className="w-4 h-4" />
      Back
    </Button>
  )
}
