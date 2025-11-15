"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import {
  Building2,
  FileText,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Home,
  TrendingUp,
  CreditCard,
  FileCheck,
  MapPin,
  MessageSquare,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { UserRole } from "@/lib/auth-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout: authLogout } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    authLogout()
    router.push("/login")
  }

  const getNavItems = (role?: UserRole) => {
    const baseItems = [
      { icon: Home, label: "Dashboard", href: "/dashboard", section: "main" },
      { icon: Building2, label: "Projects", href: "/dashboard/projects", section: "main" },
      { icon: FileText, label: "Tasks", href: "/dashboard/tasks", section: "main" },
      { icon: BarChart3, label: "Billing", href: "/dashboard/billing", section: "main" },
    ]

    const roleSpecificItems: Record<UserRole, typeof baseItems> = {
      admin: [
        { icon: Home, label: "Dashboard", href: "/dashboard", section: "main" },
        { icon: Users, label: "Clients", href: "/dashboard/clients", section: "main" },
        { icon: Users, label: "User Management", href: "/dashboard/admin/users", section: "admin" },
        { icon: Building2, label: "Projects", href: "/dashboard/projects", section: "main" },
        { icon: FileCheck, label: "Approvals", href: "/dashboard/admin/approvals", section: "admin" },
        { icon: BarChart3, label: "Analytics", href: "/dashboard/admin/analytics", section: "analytics" },
        { icon: CreditCard, label: "Financial", href: "/dashboard/financials/invoices", section: "financial" },
        { icon: FileText, label: "Reports", href: "/dashboard/reports", section: "analytics" },
        { icon: BarChart3, label: "Billing", href: "/dashboard/billing", section: "main" },
        { icon: Settings, label: "System Settings", href: "/dashboard/settings", section: "settings" },
      ],
      owner: [
        { icon: Home, label: "Dashboard", href: "/dashboard", section: "main" },
        { icon: Users, label: "Clients", href: "/dashboard/clients", section: "main" },
        { icon: TrendingUp, label: "Approvals", href: "/dashboard/owner/approvals", section: "financial" },
        { icon: CreditCard, label: "Financials", href: "/dashboard/financials/invoices", section: "financial" },
        { icon: BarChart3, label: "Analytics", href: "/dashboard/owner/analytics", section: "analytics" },
        { icon: Building2, label: "Projects", href: "/dashboard/projects", section: "main" },
        { icon: Users, label: "Team Management", href: "/dashboard/teams", section: "team" },
        { icon: BarChart3, label: "Billing", href: "/dashboard/billing", section: "main" },
        { icon: FileText, label: "Reports", href: "/dashboard/reports", section: "analytics" },
      ],
      employee: [
        { icon: Home, label: "Dashboard", href: "/dashboard", section: "main" },
        { icon: FileText, label: "My Tasks", href: "/dashboard/tasks", section: "main" },
        { icon: Users, label: "Clients", href: "/dashboard/clients", section: "main" },
        { icon: Building2, label: "Projects", href: "/dashboard/projects", section: "main" },
        { icon: MapPin, label: "Properties", href: "/dashboard/real-estate/properties", section: "main" },
        { icon: Users, label: "Team", href: "/dashboard/teams", section: "team" },
        { icon: MessageSquare, label: "Communication", href: "/dashboard/communication", section: "team" },
        { icon: BarChart3, label: "Billing", href: "/dashboard/billing", section: "main" },
        { icon: FileText, label: "Documents", href: "/dashboard/documents", section: "main" },
      ],
      user: [
        { icon: Home, label: "Dashboard", href: "/dashboard", section: "main" },
        { icon: MapPin, label: "Properties", href: "/dashboard/real-estate/properties", section: "main" },
        { icon: CreditCard, label: "Invoices", href: "/dashboard/financials/payment-plans", section: "financial" },
        { icon: FileText, label: "Documents", href: "/dashboard/documents", section: "main" },
        { icon: MessageSquare, label: "Messages", href: "/dashboard/communication", section: "team" },
      ],
    }

    return role ? roleSpecificItems[role] : baseItems
  }

  const navItems = getNavItems(user?.role.toLowerCase() as UserRole)

  const isActive = (href: string) => {
    if (href === "/dashboard" && pathname === "/dashboard") return true
    if (href !== "/dashboard" && pathname.startsWith(href)) return true
    return false
  }

  if (!mounted) return null

  if (user?.role.toLowerCase() === 'user') {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar - Enhanced Professional Design */}
      <aside className="hidden md:flex w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 border-r border-slate-700/50 flex-col shadow-xl">
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-700/50 flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-lg text-white">SHF Homes</div>
            <div className="text-xs text-slate-400">Enterprise ERP</div>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {/* Group navigation by section */}
          {["main", "admin", "financial", "analytics", "team", "settings"].map((section) => {
            const sectionItems = (navItems || []).filter((item) => item.section === section)
            if (sectionItems.length === 0) return null

            const sectionLabels: Record<string, string> = {
              main: "Main",
              admin: "Administration",
              financial: "Financial",
              analytics: "Insights",
              team: "Collaboration",
              settings: "Settings",
            }

            return (
              <div key={section}>
                <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {sectionLabels[section]}
                </div>
                <div className="space-y-1">
                  {sectionItems.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.href)
                    return (
                      <Link key={item.href} href={item.href}>
                        <button
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                            active
                              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20"
                              : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                          }`}
                        >
                          <Icon className="w-5 h-5 flex-shrink-0" />
                          <span className="font-medium text-sm">{item.label}</span>
                          {active && <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>}
                        </button>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-700/50 space-y-2">
          <Link href="/dashboard/settings">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800/50 hover:text-white transition-all duration-200">
              <Settings className="w-5 h-5" />
              <span className="font-medium text-sm">Settings</span>
            </button>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Professional Top Bar */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-4 md:px-8 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-slate-700" /> : <Menu className="w-6 h-6 text-slate-700" />}
            </button>
            <h1 className="text-xl font-bold text-slate-900">
              {user?.role && user.role.charAt(0).toUpperCase() + user.role.slice(1)} Portal
            </h1>
          </div>
          <div className="flex items-center gap-6">
            {/* Quick Stats */}
            <div className="hidden lg:flex items-center gap-6 px-6 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-slate-600">System Online</span>
              </div>
            </div>

            {/* User Profile */}
            {mounted && user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-sm font-bold text-white">
                      {user.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase() || "U"}
                    </div>
                    <div className="flex flex-col hidden sm:block">
                      <span className="text-sm font-semibold text-slate-900">{user.name || "User"}</span>
                      <span className="text-xs text-slate-500 capitalize">{user.role}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden bg-slate-50 border-b border-slate-200 p-4 space-y-1 max-h-96 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link key={item.href} href={item.href}>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                      active ? "bg-blue-500 text-white font-medium" : "text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </Link>
              )
            })}
          </nav>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8 bg-gradient-to-br from-slate-50 to-slate-100">{children}</main>
      </div>
    </div>
  )
}
