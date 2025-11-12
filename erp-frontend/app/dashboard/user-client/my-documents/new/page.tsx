"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import BackButton from "@/components/BackButton"

export default function NewClientDocumentPage() {
  const [file, setFile] = useState<File | null>(null)
  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [tags, setTags] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!file) {
      setError("Please select a file")
      return
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("clientId", localStorage.getItem("client_id") || "")
    formData.append("name", name)
    formData.append("type", type)
    formData.append("tags", tags)

    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("http://localhost:3000/document/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        router.push(`/dashboard/user-client/my-documents`);
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to upload document");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <BackButton />
        <div>
          <h1 className="text-3xl font-bold">New Document</h1>
          <p className="text-muted-foreground">Upload a new document</p>
        </div>
      </div>

      <Card className="p-8">
        {error && (
          <div className="mb-6 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Document Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Document Type</Label>
            <Select onValueChange={setType} required>
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aadhaar">Aadhaar Card</SelectItem>
                <SelectItem value="pan">PAN Card</SelectItem>
                <SelectItem value="gst">GST Certificate</SelectItem>
                <SelectItem value="tan">TAN Certificate</SelectItem>
                <SelectItem value="bank">Bank Statement</SelectItem>
                <SelectItem value="property">Property Deed</SelectItem>
                <SelectItem value="kyc">KYC Document</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">Document</Label>
            <Input
              id="file"
              type="file"
              name="file"
              onChange={handleFileChange}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Upload Document
          </Button>
        </form>
      </Card>
    </div>
  )
}
