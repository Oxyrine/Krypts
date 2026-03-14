"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, ShieldCheck, Film, FileText, ArrowUpRight, ArrowDownRight, Users } from "lucide-react"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

const analyticsData = [
  { name: "Mon", sessions: 4000, blocked: 240 },
  { name: "Tue", sessions: 3000, blocked: 139 },
  { name: "Wed", sessions: 2000, blocked: 980 },
  { name: "Thu", sessions: 2780, blocked: 390 },
  { name: "Fri", sessions: 1890, blocked: 480 },
  { name: "Sat", sessions: 2390, blocked: 380 },
  { name: "Sun", sessions: 3490, blocked: 430 },
]

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Protected Files</CardTitle>
            <ShieldCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-green-500 flex items-center"><ArrowUpRight className="h-3 w-3" /> +12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tokens</CardTitle>
            <Users className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14,293</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-green-500 flex items-center"><ArrowUpRight className="h-3 w-3" /> +4.1%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked Attempts</CardTitle>
            <Activity className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,039</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-red-500 flex items-center"><ArrowUpRight className="h-3 w-3" /> +19%</span> piracy blocked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bandwidth Saved</CardTitle>
            <Film className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2 TB</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-green-500 flex items-center"><ArrowUpRight className="h-3 w-3" /> +8.2%</span> from last month
            </p>
          </CardContent>
        </Card>

      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Usage Analytics</CardTitle>
            <CardDescription>
              Authenticated sessions vs blocked piracy attempts.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-0 pb-4 pr-4 border-t pt-4">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={analyticsData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `\${value}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area type="monotone" dataKey="sessions" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSessions)" />
                  <Area type="monotone" dataKey="blocked" stroke="#ef4444" fillOpacity={1} fill="url(#colorBlocked)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Real-time feed of DRM events and alerts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { time: "2 min ago", user: "user_789 (US)", action: "Failed token auth", file: "Advanced_React.mp4", type: "error" },
                { time: "15 min ago", user: "Api System", action: "Encrypted 4 files", file: "", type: "success" },
                { time: "1 hr ago", user: "user_123 (UK)", action: "Viewed content", file: "Q3_Report.pdf", type: "info" },
                { time: "2 hrs ago", user: "dev_system", action: "Generated 500 tokens", file: "", type: "info" },
                { time: "3 hrs ago", user: "user_456 (IN)", action: "Blocked download attempt", file: "Masterclass.mp4", type: "error" }
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`mt-0.5 h-2 w-2 rounded-full ring-4 ring-background \${
                    activity.type === 'error' ? 'bg-destructive ring-destructive/20' : 
                    activity.type === 'success' ? 'bg-green-500 ring-green-500/20' : 'bg-blue-500 ring-blue-500/20'
                  }`}></div>
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.action}
                    </p>
                    <p className="text-sm text-muted-foreground flex justify-between items-center">
                      <span>{activity.user} {activity.file && <span className="text-foreground ml-1">{activity.file}</span>}</span>
                      <span className="text-xs">{activity.time}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
