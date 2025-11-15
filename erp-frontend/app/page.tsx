import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Building2, Users, FileText, BarChart3, CheckCircle } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">SHF Homes</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance leading-tight">
              Your Firm's Operations. <span className="text-primary">Unified.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Streamline project management, client relationships, and financial workflows. Everything your architecture
              and construction firm needs in one elegant platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Book a Demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Complete ERP Modules</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Building2, title: "Projects", desc: "Manage phases, timelines, and deliverables with precision" },
              { icon: Users, title: "Clients", desc: "Centralize client information and communication history" },
              { icon: FileText, title: "Tasks", desc: "Kanban boards and assignments for seamless workflows" },
              { icon: BarChart3, title: "Billing", desc: "Track invoices, payments, and financial metrics" },
              { icon: Users, title: "Teams", desc: "Manage roles, assignments, and team collaboration" },
              { icon: FileText, title: "Reports", desc: "Real-time dashboards and comprehensive analytics" },
            ].map((feature, i) => (
              <Card key={i} className="p-6 border border-border hover:border-primary/50 transition-colors">
                <feature.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Built for Modern Firms</h2>
              {[
                "Intuitive interface inspired by industry leaders",
                "Real-time collaboration across teams",
                "Secure data management and access controls",
                "Scalable architecture as you grow",
              ].map((benefit, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-lg">{benefit}</span>
                </div>
              ))}
            </div>
            <Card className="p-8 bg-secondary/50 border-primary/20">
              <div className="space-y-4">
                <div className="h-48 bg-muted/30 rounded-lg flex items-center justify-center text-muted-foreground">
                  Dashboard Preview
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              <span className="font-semibold">SHF Homes</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 SHF Homes. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
