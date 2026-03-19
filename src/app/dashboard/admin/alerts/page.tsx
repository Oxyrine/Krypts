"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Bell, CheckCircle2, AlertTriangle, ShieldX, RefreshCw, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { api, SecurityAlertResponse } from "@/lib/api"

const AlertTypeBadge = ({ type }: { type: string }) => {
  const map: Record<string, { label: string; class: string }> = {
    rapid_session: { label: "Rapid Session", class: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
    failed_logins: { label: "Failed Logins", class: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
    suspended: { label: "Suspended", class: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    banned: { label: "Banned", class: "bg-red-500/10 text-red-600 border-red-500/20" },
    manual: { label: "Manual", class: "bg-muted text-muted-foreground" },
  }
  const style = map[type] || { label: type, class: "bg-muted" }
  return <Badge variant="outline" className={`text-xs ${style.class}`}>{style.label}</Badge>
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<SecurityAlertResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [markingId, setMarkingId] = useState<string | null>(null)

  const loadAlerts = () => {
    setLoading(true)
    api.admin.securityAlerts()
      .then(setAlerts)
      .catch((err) => toast.error(err.message || "Failed to load alerts"))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadAlerts() }, [])

  const handleMarkRead = async (alertId: string) => {
    setMarkingId(alertId)
    try {
      await api.admin.markAlertRead(alertId)
      setAlerts(prev => prev.map(a => a.alert_id === alertId ? { ...a, status: "read" } : a))
    } catch (err: any) {
      toast.error(err.message || "Failed to update alert")
    } finally {
      setMarkingId(null)
    }
  }

  const handleMarkAllRead = async () => {
    const unread = alerts.filter(a => a.status === "unread")
    for (const alert of unread) {
      await api.admin.markAlertRead(alert.alert_id).catch(() => {})
    }
    setAlerts(prev => prev.map(a => ({ ...a, status: "read" })))
    toast.success(`Marked ${unread.length} alerts as read.`)
  }

  const unreadCount = alerts.filter(a => a.status === "unread").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/admin" className={buttonVariants({ variant: "outline", size: "icon" })}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              Security Alerts
              {unreadCount > 0 && (
                <Badge className="bg-destructive text-destructive-foreground">{unreadCount}</Badge>
              )}
            </h1>
            <p className="text-muted-foreground">Monitor suspicious behavior and security incidents.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadAlerts}>
            <RefreshCw className="mr-2 h-4 w-4" />Refresh
          </Button>
          {unreadCount > 0 && (
            <Button size="sm" onClick={handleMarkAllRead}>
              <CheckCircle2 className="mr-2 h-4 w-4" />Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Alerts", value: alerts.length, icon: Bell, color: "text-primary" },
          { label: "Unread", value: unreadCount, icon: AlertTriangle, color: "text-yellow-500" },
          { label: "Bans", value: alerts.filter(a => a.alert_type === "banned").length, icon: ShieldX, color: "text-destructive" },
          { label: "Rapid Sessions", value: alerts.filter(a => a.alert_type === "rapid_session").length, icon: AlertTriangle, color: "text-orange-500" },
        ].map((s, i) => {
          const Icon = s.icon
          return (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
                <Icon className={`h-4 w-4 ${s.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? "—" : s.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Alerts</CardTitle>
          <CardDescription>Security events triggered by automated behavior detection.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">Loading alerts...</TableCell>
                </TableRow>
              ) : alerts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    No security alerts. Your platform is clean!
                  </TableCell>
                </TableRow>
              ) : (
                alerts.map(alert => (
                  <TableRow key={alert.alert_id} className={alert.status === "unread" ? "bg-muted/30" : ""}>
                    <TableCell><AlertTypeBadge type={alert.alert_type} /></TableCell>
                    <TableCell className="text-sm max-w-[280px]">
                      <span className="line-clamp-2">{alert.description}</span>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                        {alert.user_id.slice(0, 8)}...
                      </code>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {alert.ip_address || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(alert.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={alert.status === "unread" ? "destructive" : "secondary"} className="text-xs">
                        {alert.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {alert.status === "unread" && (
                        <Button
                          variant="ghost" size="sm"
                          onClick={() => handleMarkRead(alert.alert_id)}
                          disabled={markingId === alert.alert_id}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Mark Read
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
