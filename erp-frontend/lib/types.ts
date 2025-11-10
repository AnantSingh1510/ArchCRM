// Central types file for the ERP system

import type { User, UserRole, Permission } from "./auth-context"

export type { User, UserRole, Permission }

export interface ApprovalRequest {
  id: string
  type: "invoice" | "payment" | "project" | "client"
  status: "pending" | "approved" | "rejected"
  requester: User
  approver?: User
  data: Record<string, any>
  createdAt: Date
  dueDate: Date
  comments?: string
}

export interface Invoice {
  id: string
  number: string
  clientId: string
  projectId: string
  amount: number
  subtotal: number
  gst: number
  tds: number
  total: number
  status: "draft" | "pending_approval" | "approved" | "sent" | "paid" | "overdue"
  issueDate: Date
  dueDate: Date
  lineItems: InvoiceLineItem[]
  paymentPlan?: PaymentPlan
  approvalRequest?: ApprovalRequest
  createdBy: string
  createdAt: Date
}

export interface InvoiceLineItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
  gstRate: number
}

export interface PaymentPlan {
  id: string
  totalAmount: number
  installments: Installment[]
  startDate: Date
  endDate: Date
}

export interface Installment {
  id: string
  number: number
  amount: number
  dueDate: Date
  status: "pending" | "paid" | "overdue"
  paidDate?: Date
}

export interface Communication {
  id: string
  type: "email" | "whatsapp" | "sms"
  recipient: string
  subject?: string
  body: string
  status: "draft" | "sending" | "sent" | "failed"
  relatedTo: "invoice" | "payment" | "project" | "task"
  relatedId: string
  createdAt: Date
  sentAt?: Date
}

export interface Document {
  id: string
  name: string
  type: string
  url: string
  projectId: string
  uploadedBy: string
  uploadedAt: Date
  version: number
  tags: string[]
  accessControl: string[] // User IDs with access
}

export interface Property {
  id: string
  name: string
  address: string
  city: string
  area: number
  price: number
  projectId: string
  clientId: string
  status: "available" | "booked" | "sold"
  paymentPlanId?: string
  photos: string[]
  details: Record<string, any>
}

export interface ClientDocument {
  id: string
  clientId: string
  documentType: "aadhaar" | "pan" | "gst" | "tan" | "bank_details" | "property_deed" | "kyc_form" | "other"
  fileName: string
  fileUrl: string
  uploadedBy: string // User ID who uploaded
  uploadedAt: Date
  expiryDate?: Date
  status: "pending_review" | "verified" | "rejected" | "expired"
  verifiedBy?: string // Admin/Employee ID
  verificationDate?: Date
  notes?: string
  version: number
  accessControl: string[] // User IDs with access
}

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  aadharNumber?: string
  panNumber?: string
  gstNumber?: string
  businessType: string
  kyc_status: "incomplete" | "pending" | "approved" | "rejected"
  projects: string[]
  documents: ClientDocument[]
  createdAt: Date
  createdBy: string
  lastUpdated: Date
}
