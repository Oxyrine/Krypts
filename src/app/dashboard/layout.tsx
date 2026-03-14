"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Upload, FileStack, Key, ShieldPlus, Activity, Settings, Shield, Bell, LogOut, ChevronDown } from "lucide-react"

import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { title: "Upload Content", href: "/dashboard/upload", icon: Upload },
    { title: "Content Manager", href: "/dashboard/content", icon: FileStack },
    { title: "Token Generator", href: "/dashboard/tokens", icon: Key },
    { title: "Watermark Settings", href: "/dashboard/watermarks", icon: ShieldPlus },
    { title: "Analytics", href: "/dashboard/analytics", icon: Activity },
    { title: "API Keys", href: "/dashboard/apikeys", icon: Settings },
  ]

  return (
    <div className="flex min-h-screen w-full bg-muted/20">

      {/* Sidebar */}
      <aside className="fixed hidden w-64 flex-col border-r bg-background lg:flex h-full">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Shield className="h-6 w-6 text-primary" />
            <span className="">Krypts Admin</span>
          </Link>
        </div>

        <div className="flex-1 overflow-auto py-4">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <div className="mb-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">Main Menu</div>
            {navItems.map((item, index) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all text-sm mb-1 ${isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm">Storage Used</CardTitle>
              <CardDescription>
                You are at 85% of your plan's storage limit.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Button size="sm" className="w-full mt-2" variant="outline">Upgrade Plan</Button>
            </CardContent>
          </Card>
        </div>
      </aside>

      {/* Main Content wrapper */}
      <div className="flex flex-1 flex-col lg:pl-64 h-screen overflow-hidden">

        {/* Top Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6 shrink-0 justify-between">
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold md:text-xl">
              {navItems.find(i => i.href === pathname)?.title || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="h-8 w-8 relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-red-600"></span>
            </Button>

            <ModeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-2 h-8 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors outline-none">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-primary/20 text-primary text-xs">A</AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
