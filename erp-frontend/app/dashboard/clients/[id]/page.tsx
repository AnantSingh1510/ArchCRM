"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  FileText,
  Download,
  Eye,
  Trash2,
  Plus,
  Calendar,
  Edit,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
  DollarSign,
  Users,
  Briefcase,
  Home,
} from "lucide-react"

interface Document {
  id: string
  name: string
  type: "aadhaar" | "pan" | "gst" | "tan" | "bank" | "property" | "kyc" | "other"
  status: "verified" | "pending" | "rejected" | "expired"
  uploadedDate: string
  uploadedBy: string
  expiryDate?: string
  size: string
}

interface ClientDetail {
  id: string
  name: string
  email: string
  phone: string
  alternatePhone: string
  address: string
  city: string
  state: string
  pinCode: string
  gstNumber: string
  panNumber: string
  aadhaarNumber: string
  bankAccountNumber: string
  ifscCode: string
  joinedDate: string
  status: "active" | "inactive" | "suspended"
  kycStatus: "approved" | "pending" | "incomplete" | "rejected"
  documents: Document[]
  properties: Property[]
}

interface Property {
  id: string
  plotNumber: string
  dimensions: string
  project: {
    name: string
  }
}

export default function ClientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Unwrap params first
  useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchClient = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const res = await fetch(`http://localhost:3000/client/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setClient(data);
        } else {
          setError("Failed to fetch client");
        }
      } catch (error) {
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      active: { bg: "bg-green-100", text: "text-green-800", icon: <CheckCircle2 className="w-4 h-4" /> },
      inactive: { bg: "bg-gray-100", text: "text-gray-800", icon: <Clock className="w-4 h-4" /> },
      suspended: { bg: "bg-red-100", text: "text-red-800", icon: <AlertCircle className="w-4 h-4" /> },
      verified: { bg: "bg-green-100", text: "text-green-800", icon: <CheckCircle2 className="w-4 h-4" /> },
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", icon: <Clock className="w-4 h-4" /> },
      rejected: { bg: "bg-red-100", text: "text-red-800", icon: <AlertCircle className="w-4 h-4" /> },
      expired: { bg: "bg-orange-100", text: "text-orange-800", icon: <AlertCircle className="w-4 h-4" /> },
      approved: { bg: "bg-green-100", text: "text-green-800", icon: <CheckCircle2 className="w-4 h-4" /> },
      incomplete: { bg: "bg-gray-100", text: "text-gray-800", icon: <Clock className="w-4 h-4" /> },
    }
    return badges[status] || { bg: "bg-gray-100", text: "text-gray-800", icon: null }
  }

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`http://localhost:3000/client/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        router.push("/dashboard/clients");
      } else {
        setError("Failed to delete client");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <p className="text-destructive">{error}</p>;
  }

  if (!client) {
    return <div>Client not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/clients">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{client.name}</h1>
            <p className="text-muted-foreground">Client profile and document management</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 ${getStatusBadge(client.status).bg} ${getStatusBadge(client.status).text}`}
          >
            {getStatusBadge(client.status).icon}
            {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
          </span>
          <Link href={`/dashboard/clients/${id}/edit`}>
            <Button variant="outline" className="gap-2">
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          </Link>
          <Button variant="destructive" className="gap-2" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </div>

      {client.kycStatus !== "approved" && (
        <Card className="p-4 bg-yellow-50 border border-yellow-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-900">
                KYC Status: {client.kycStatus.charAt(0).toUpperCase() + client.kycStatus.slice(1)}
              </h3>
              <p className="text-sm text-yellow-800">Please upload remaining documents to complete KYC verification.</p>
            </div>
          </div>
        </Card>
      )}

      {/* Contact Information */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Contact Information
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-semibold text-slate-600">Email Address</label>
            <div className="flex items-center gap-2 mt-2">
              <Mail className="w-4 h-4 text-slate-400" />
              <p className="text-slate-900">{client.email}</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">Primary Phone</label>
            <div className="flex items-center gap-2 mt-2">
              <Phone className="w-4 h-4 text-slate-400" />
              <p className="text-slate-900">{client.phone}</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">Alternate Phone</label>
            <div className="flex items-center gap-2 mt-2">
              <Phone className="w-4 h-4 text-slate-400" />
              <p className="text-slate-900">{client.alternatePhone}</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">Joined Date</label>
            <div className="flex items-center gap-2 mt-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <p className="text-slate-900">{new Date(client.joinedDate).toLocaleDateString("en-IN")}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Address Information */}
      <Card className="p-6">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-blue-600" />
          Address Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-semibold text-slate-600">Address</label>
            <p className="text-slate-900 mt-2">{client.address}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">City</label>
            <p className="text-slate-900 mt-2">{client.city}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">State</label>
            <p className="text-slate-900 mt-2">{client.state}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">PIN Code</label>
            <p className="text-slate-900 mt-2">{client.pinCode}</p>
          </div>
        </div>
      </Card>

      {/* Financial Information */}
      <Card className="p-6">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-blue-600" />
          Financial & Tax Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-semibold text-slate-600">GST Number</label>
            <p className="text-slate-900 mt-2 font-mono">{client.gstNumber}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">PAN Number</label>
            <p className="text-slate-900 mt-2 font-mono">{client.panNumber}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">Aadhaar Number (Last 4 Digits)</label>
            <p className="text-slate-900 mt-2 font-mono">{client.aadhaarNumber}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">Bank Account Number</label>
            <p className="text-slate-900 mt-2 font-mono">{client.bankAccountNumber}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">IFSC Code</label>
            <p className="text-slate-900 mt-2 font-mono">{client.ifscCode}</p>
          </div>
        </div>
      </Card>

      {/* Documents Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Documents & Compliance
          </h2>
          <Link href={`/dashboard/clients/${id}/documents`}>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Manage Documents
            </Button>
          </Link>
        </div>

        <div className="space-y-3">
          {client.documents.map((doc) => {
            const badge = getStatusBadge(doc.status)
            return (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
              >
                <div className="flex items-start gap-3 flex-1">
                  <FileText className="w-5 h-5 text-slate-400 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{doc.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1 ${badge.bg} ${badge.text}`}
                      >
                        {badge.icon}
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </span>
                      <span className="text-xs text-slate-500">
                        Uploaded on {new Date(doc.uploadedDate).toLocaleDateString("en-IN")} by {doc.uploadedBy}
                      </span>
                      {doc.expiryDate && (
                        <span className="text-xs text-slate-500">
                          Expires: {new Date(doc.expiryDate).toLocaleDateString("en-IN")}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-2">{doc.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                    <Eye className="w-4 h-4 text-slate-600" />
                  </button>
                  <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                    <Download className="w-4 h-4 text-slate-600" />
                  </button>
                  <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {client.documents.length === 0 && (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No documents uploaded yet</p>
            <p className="text-sm text-slate-400 mt-1">Start by uploading KYC documents</p>
          </div>
        )}
      </Card>

      {/* Properties Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Home className="w-5 h-5 text-blue-600" />
            Properties
          </h2>
          <Link href={`/dashboard/clients/${id}/properties/new`}>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Property
            </Button>
          </Link>
        </div>

        <div className="space-y-3">
          {client.properties.map((prop) => (
            <div
              key={prop.id}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
            >
              <div className="flex items-start gap-3 flex-1">
                <Home className="w-5 h-5 text-slate-400 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">Plot No. {prop.plotNumber}</h3>
                  <p className="text-sm text-slate-500">{prop.dimensions}</p>
                  <p className="text-xs text-slate-500 mt-2">{prop.project.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                  <Eye className="w-4 h-4 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {client.properties.length === 0 && (
          <div className="text-center py-8">
            <Home className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No properties assigned yet</p>
          </div>
        )}
      </Card>
    </div>
  )
}
