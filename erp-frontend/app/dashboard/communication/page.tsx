"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, MessageCircle, Send, Globe } from "lucide-react"
import type { Communication } from "@/lib/types"
import withRole from "@/components/withRole"

function CommunicationPage() {
  const [communications, setCommunications] = useState<Communication[]>([
    {
      id: "msg-1",
      type: "email",
      recipient: "client@bandra.com",
      subject: "Invoice INV-2024-001 Ready for Payment",
      body: "Dear Client, your invoice is ready. Please find details attached.",
      status: "sent",
      relatedTo: "invoice",
      relatedId: "inv-1",
      createdAt: new Date(Date.now() - 3600000),
      sentAt: new Date(Date.now() - 3600000),
    },
    {
      id: "msg-2",
      type: "whatsapp",
      recipient: "+91-9876-543-210",
      subject: "",
      body: "Project update: 65% complete. Site inspection tomorrow at 10 AM.",
      status: "sent",
      relatedTo: "project",
      relatedId: "proj-1",
      createdAt: new Date(Date.now() - 7200000),
      sentAt: new Date(Date.now() - 7200000),
    },
    {
      id: "msg-3",
      type: "email",
      recipient: "finance@bkc.com",
      subject: "Payment Reminder - INV-2024-002",
      body: "Friendly reminder: Your payment of ₹9,04,000 is due on Dec 5, 2024.",
      status: "sending",
      relatedTo: "invoice",
      relatedId: "inv-2",
      createdAt: new Date(Date.now() - 1800000),
    },
  ])

  const [activeTab, setActiveTab] = useState<"inbox" | "send">("inbox")
  const [selectedComm, setSelectedComm] = useState<Communication | null>(null)
  const [showComposeForm, setShowComposeForm] = useState(false)
  const [formData, setFormData] = useState({
    type: "email" as "email" | "whatsapp",
    recipient: "",
    subject: "",
    body: "",
    relatedTo: "invoice" as const,
    relatedId: "inv-1",
  })

  const handleSendMessage = () => {
    if (!formData.recipient || !formData.body) return

    const newComm: Communication = {
      id: `msg-${Date.now()}`,
      type: formData.type,
      recipient: formData.recipient,
      subject: formData.subject,
      body: formData.body,
      status: "sending",
      relatedTo: formData.relatedTo,
      relatedId: formData.relatedId,
      createdAt: new Date(),
    }

    setCommunications([newComm, ...communications])
    setFormData({ type: "email", recipient: "", subject: "", body: "", relatedTo: "invoice", relatedId: "inv-1" })
    setShowComposeForm(false)

    // Simulate sending
    setTimeout(() => {
      setCommunications((comms) =>
        comms.map((c) => (c.id === newComm.id ? { ...c, status: "sent", sentAt: new Date() } : c)),
      )
    }, 2000)
  }

  const quickTemplates = [
    {
      name: "Invoice Sent",
      type: "email",
      subject: "Your Invoice is Ready",
      body: "Dear [Client Name],\n\nYour invoice is ready for payment.\n\nAmount: [Amount]\nDue Date: [Date]\n\nPlease arrange payment at your earliest convenience.\n\nBest regards",
    },
    {
      name: "Payment Reminder",
      type: "email",
      subject: "Payment Reminder",
      body: "Dear [Client Name],\n\nThis is a reminder that your payment of [Amount] is due on [Date].\n\nPlease arrange payment to avoid any late fees.\n\nThank you",
    },
    {
      name: "Project Update",
      type: "whatsapp",
      body: "Hi! Project update: [Progress]% complete. Next milestone: [Task]. Contact us if you have questions!",
    },
  ]

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      sent: "bg-green-100 text-green-800",
      sending: "bg-blue-100 text-blue-800",
      failed: "bg-red-100 text-red-800",
      draft: "bg-gray-100 text-gray-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const getTypeIcon = (type: string) => {
    return type === "email" ? <Mail className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Communication Center</h1>
          <p className="text-muted-foreground">Email and WhatsApp integration for automated notifications</p>
        </div>
        <Button onClick={() => setShowComposeForm(true)} className="gap-2">
          <Send className="w-4 h-4" />
          New Message
        </Button>
      </div>

      {/* Compose Form */}
      {showComposeForm && (
        <Card className="p-6 bg-primary/5 border-2 border-primary/20">
          <h2 className="text-lg font-bold mb-4">Compose Message</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Message Type</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setFormData({ ...formData, type: "email" })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    formData.type === "email"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary"
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  Email
                </button>
                <button
                  onClick={() => setFormData({ ...formData, type: "whatsapp" })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    formData.type === "whatsapp"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary"
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Recipient</label>
              <Input
                type={formData.type === "email" ? "email" : "tel"}
                placeholder={formData.type === "email" ? "email@example.com" : "+91-9999-999-999"}
                value={formData.recipient}
                onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
              />
            </div>
          </div>

          {formData.type === "email" && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Subject</label>
              <Input
                placeholder="Message subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea
              placeholder="Type your message..."
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              rows={4}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Related To (Optional)</label>
            <select
              value={formData.relatedTo}
              onChange={(e) => setFormData({ ...formData, relatedTo: e.target.value as any })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
            >
              <option value="invoice">Invoice</option>
              <option value="payment">Payment</option>
              <option value="project">Project</option>
              <option value="task">Task</option>
            </select>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSendMessage}>Send Message</Button>
            <Button variant="outline" onClick={() => setShowComposeForm(false)}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Quick Templates */}
      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4">Quick Templates</h2>
        <div className="grid md:grid-cols-3 gap-3">
          {quickTemplates.map((template, i) => (
            <button
              key={i}
              onClick={() => {
                setFormData({
                  type: template.type as "email" | "whatsapp",
                  recipient: "",
                  subject: template.subject || "",
                  body: template.body,
                  relatedTo: "invoice",
                  relatedId: "inv-1",
                })
                setShowComposeForm(true)
              }}
              className="p-4 border border-border rounded-lg hover:border-primary/50 hover:bg-secondary/30 transition-colors text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                {template.type === "email" ? <Mail className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
                <span className="font-semibold text-sm">{template.name}</span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{template.body.substring(0, 50)}...</p>
            </button>
          ))}
        </div>
      </Card>

      {/* Communication History */}
      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4">Communication History</h2>
        <div className="space-y-3">
          {communications.map((comm) => (
            <div
              key={comm.id}
              onClick={() => setSelectedComm(selectedComm?.id === comm.id ? null : comm)}
              className="p-4 border border-border rounded-lg hover:border-primary/50 hover:bg-secondary/30 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 rounded-lg bg-secondary">{getTypeIcon(comm.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm capitalize">{comm.type}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full font-semibold ${getStatusColor(comm.status)}`}>
                        {comm.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{comm.recipient}</p>
                    {comm.subject && <p className="text-sm font-medium mt-1">{comm.subject}</p>}
                    <p className="text-sm mt-1 line-clamp-2">{comm.body}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                  {comm.createdAt.toLocaleDateString()}
                </p>
              </div>

              {selectedComm?.id === comm.id && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm">
                    <strong>Full Message:</strong>
                  </p>
                  <p className="text-sm mt-2 whitespace-pre-wrap">{comm.body}</p>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline">
                      Reply
                    </Button>
                    <Button size="sm" variant="outline">
                      Resend
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Integration Settings */}
      <Card className="p-6 border-2 border-purple-600/20">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          API Integration Status
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Integration
              </p>
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
            </div>
            <p className="text-sm text-muted-foreground">Connected to SendGrid</p>
            <Button size="sm" variant="outline" className="mt-2 bg-transparent">
              Configure
            </Button>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                WhatsApp Integration
              </p>
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
            </div>
            <p className="text-sm text-muted-foreground">Connected to Twilio</p>
            <Button size="sm" variant="outline" className="mt-2 bg-transparent">
              Configure
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default withRole("communication", "read")(CommunicationPage)
