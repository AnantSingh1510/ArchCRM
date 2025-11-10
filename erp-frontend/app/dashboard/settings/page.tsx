"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Lock, User, Save, AlertCircle, CheckCircle, Palette } from "lucide-react"

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@operahub.com",
    phone: "+1 (555) 123-4567",
    company: "OperaHub Inc",
  })

  const [notifications, setNotifications] = useState({
    projectUpdates: true,
    weeklyReports: true,
    teamActivity: false,
    paymentAlerts: true,
  })

  const [security, setSecurity] = useState({
    twoFactor: false,
    showPasswordForm: false,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [theme, setTheme] = useState("light")
  const [saved, setSaved] = useState(false)

  const handleSaveProfile = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications({ ...notifications, [key]: !notifications[key] })
  }

  const handlePasswordChange = () => {
    if (security.newPassword === security.confirmPassword) {
      setSaved(true)
      setSecurity({
        ...security,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        showPasswordForm: false,
      })
      setTimeout(() => setSaved(false), 3000)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      {/* Save Success Message */}
      {saved && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium">Changes saved successfully</span>
        </div>
      )}

      {/* Profile Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5" />
          <h2 className="text-lg font-bold">Profile Settings</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <Input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <Input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <Input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Company</label>
            <Input
              type="text"
              value={profile.company}
              onChange={(e) => setProfile({ ...profile, company: e.target.value })}
            />
          </div>
          <Button onClick={handleSaveProfile} className="w-full gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5" />
          <h2 className="text-lg font-bold">Notifications</h2>
        </div>
        <div className="space-y-4">
          <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
            <input
              type="checkbox"
              checked={notifications.projectUpdates}
              onChange={() => toggleNotification("projectUpdates")}
              className="w-4 h-4"
            />
            <div className="flex-1">
              <span className="font-medium block">Project Updates</span>
              <span className="text-xs text-muted-foreground">Get notified about project status changes</span>
            </div>
          </label>
          <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
            <input
              type="checkbox"
              checked={notifications.weeklyReports}
              onChange={() => toggleNotification("weeklyReports")}
              className="w-4 h-4"
            />
            <div className="flex-1">
              <span className="font-medium block">Weekly Reports</span>
              <span className="text-xs text-muted-foreground">Receive weekly summary reports</span>
            </div>
          </label>
          <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
            <input
              type="checkbox"
              checked={notifications.teamActivity}
              onChange={() => toggleNotification("teamActivity")}
              className="w-4 h-4"
            />
            <div className="flex-1">
              <span className="font-medium block">Team Activity</span>
              <span className="text-xs text-muted-foreground">Get notified of team member activities</span>
            </div>
          </label>
          <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
            <input
              type="checkbox"
              checked={notifications.paymentAlerts}
              onChange={() => toggleNotification("paymentAlerts")}
              className="w-4 h-4"
            />
            <div className="flex-1">
              <span className="font-medium block">Payment Alerts</span>
              <span className="text-xs text-muted-foreground">Notifications for invoices and payments</span>
            </div>
          </label>
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-5 h-5" />
          <h2 className="text-lg font-bold">Security</h2>
        </div>
        <div className="space-y-4">
          {!security.showPasswordForm ? (
            <>
              <div className="p-4 bg-secondary/50 rounded-lg flex items-start justify-between">
                <div>
                  <p className="font-medium">Password</p>
                  <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSecurity({ ...security, showPasswordForm: true })}
                >
                  Change
                </Button>
              </div>
              <div className="p-4 bg-secondary/50 rounded-lg flex items-start justify-between">
                <div>
                  <p className="font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Two-Factor Authentication
                  </p>
                  <p className="text-sm text-muted-foreground">{security.twoFactor ? "Enabled" : "Disabled"}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setSecurity({
                      ...security,
                      twoFactor: !security.twoFactor,
                    })
                  }
                >
                  {security.twoFactor ? "Disable" : "Enable"}
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Current Password</label>
                <Input
                  type="password"
                  value={security.currentPassword}
                  onChange={(e) =>
                    setSecurity({
                      ...security,
                      currentPassword: e.target.value,
                    })
                  }
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">New Password</label>
                <Input
                  type="password"
                  value={security.newPassword}
                  onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <Input
                  type="password"
                  value={security.confirmPassword}
                  onChange={(e) =>
                    setSecurity({
                      ...security,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="••••••••"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handlePasswordChange}
                  className="flex-1"
                  disabled={!security.newPassword || security.newPassword !== security.confirmPassword}
                >
                  Update Password
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    setSecurity({
                      ...security,
                      showPasswordForm: false,
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    })
                  }
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Appearance Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Palette className="w-5 h-5" />
          <h2 className="text-lg font-bold">Appearance</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-3">Theme</label>
            <div className="flex gap-3">
              {["Light", "Dark", "Auto"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t.toLowerCase())}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    theme === t.toLowerCase()
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-destructive/50 bg-destructive/5">
        <h2 className="text-lg font-bold text-destructive mb-4">Danger Zone</h2>
        <p className="text-sm text-muted-foreground mb-4">These actions are permanent and cannot be undone.</p>
        <Button
          variant="outline"
          className="w-full text-destructive hover:bg-destructive/10 border-destructive/50 bg-transparent"
        >
          Delete Account
        </Button>
      </Card>
    </div>
  )
}
