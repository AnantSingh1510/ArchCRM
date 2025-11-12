"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import BackButton from "@/components/BackButton"
import { use } from "react"

export default function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // Unwrap the Promise
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    alternatePhone: "",
    joinedDate: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    gstNumber: "",
    panNumber: "",
    aadhaarNumber: "",
    bankAccountNumber: "",
    ifscCode: "",
    status: "",
    kycStatus: "",
  })
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (!id) return // Changed from params.id

    const fetchClient = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        const res = await fetch(`http://localhost:3000/client/${id}`, { // Changed from params.id
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (res.ok) {
          const data = await res.json()
          setFormData({
            ...data,
            joinedDate: data.joinedDate ? new Date(data.joinedDate).toISOString().split("T")[0] : "",
          })
        } else {
          setError("Failed to fetch client")
        }
      } catch (error) {
        setError("An unexpected error occurred. Please try again.")
      }
    }

    fetchClient()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name || !formData.email || !formData.phone) {
      setError("Please fill in all required fields")
      return
    }

    try {
      const token = localStorage.getItem("auth_token")
      const { projects, documents, ...updateData } = formData as any;
      const res = await fetch(`http://localhost:3000/client/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...updateData,
          joinedDate: formData.joinedDate ? new Date(formData.joinedDate).toISOString() : null,
        }),
      })

      if (res.ok) {
        router.push(`/dashboard/clients/${id}`)
      } else {
        const errorData = await res.json()
        setError(errorData.message || "Failed to update client")
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <BackButton />
        <div>
          <h1 className="text-3xl font-bold">Edit Client</h1>
          <p className="text-muted-foreground">Update client details</p>
        </div>
      </div>

      <Card className="p-8">
        {error && (
          <div className="mb-6 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdateClient} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Client Name</label>
              <Input
                type="text"
                name="name"
                placeholder="Client Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Primary Phone</label>
              <Input
                type="text"
                name="phone"
                placeholder="Primary Phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Alternate Phone</label>
              <Input
                type="text"
                name="alternatePhone"
                placeholder="Alternate Phone"
                value={formData.alternatePhone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Joined Date</label>
              <Input
                type="date"
                name="joinedDate"
                value={formData.joinedDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <h2 className="text-xl font-bold pt-4">Address Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Address</label>
              <Input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">City</label>
              <Input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">State</label>
              <Input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">PIN Code</label>
              <Input
                type="text"
                name="pinCode"
                placeholder="PIN Code"
                value={formData.pinCode}
                onChange={handleChange}
              />
            </div>
          </div>

          <h2 className="text-xl font-bold pt-4">Financial & Tax Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">GST Number</label>
              <Input
                type="text"
                name="gstNumber"
                placeholder="GST Number"
                value={formData.gstNumber}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">PAN Number</label>
              <Input
                type="text"
                name="panNumber"
                placeholder="PAN Number"
                value={formData.panNumber}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Aadhaar Number (Last 4 Digits)</label>
              <Input
                type="text"
                name="aadhaarNumber"
                placeholder="Aadhaar Number"
                value={formData.aadhaarNumber}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Bank Account Number</label>
              <Input
                type="text"
                name="bankAccountNumber"
                placeholder="Bank Account Number"
                value={formData.bankAccountNumber}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">IFSC Code</label>
              <Input
                type="text"
                name="ifscCode"
                placeholder="IFSC Code"
                value={formData.ifscCode}
                onChange={handleChange}
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Update Client
          </Button>
        </form>
      </Card>
    </div>
  )
}
