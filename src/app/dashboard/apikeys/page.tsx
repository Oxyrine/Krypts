"use client"

import { Copy, KeyRound, Plus, Trash2, Eye, EyeOff } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function ApiKeysPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">API Keys</h1>
          <p className="text-muted-foreground">Manage your secret keys to access the Krypts DRM API.</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" /> Create New Key</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Keys</CardTitle>
          <CardDescription>
            These keys grant programmatic access to your account. Do not share them publicly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Environment</TableHead>
                <TableHead>Secret Key</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>

              <TableRow>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">Production Token Service</span>
                    <Badge variant="secondary" className="w-fit text-xs bg-red-500/10 text-red-600">Live</Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 font-mono text-sm bg-muted px-2 py-1 rounded w-fit">
                    krypts_live_********************
                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-2">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">Jan 12, 2025</TableCell>
                <TableCell className="text-muted-foreground">2 mins ago</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" className="text-destructive border-destructive/20 hover:bg-destructive/10">
                    Revoke
                  </Button>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">Staging Integration</span>
                    <Badge variant="secondary" className="w-fit text-xs bg-yellow-500/10 text-yellow-600">Test</Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 font-mono text-sm bg-muted px-2 py-1 rounded w-fit">
                    krypts_test_********************
                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-2">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">Feb 04, 2025</TableCell>
                <TableCell className="text-muted-foreground">14 days ago</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" className="text-destructive border-destructive/20 hover:bg-destructive/10">
                    Revoke
                  </Button>
                </TableCell>
              </TableRow>

            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex gap-4 mt-8">
        <KeyRound className="h-6 w-6 text-blue-500 shrink-0 mt-1" />
        <div>
          <h4 className="font-semibold text-blue-100 mb-1">Rolling API Keys</h4>
          <p className="text-sm text-blue-200/80 leading-relaxed">
            If you suspect a key has been compromised, generate a new one, update your backend services to use the new key, and then revoke the old one to ensure zero downtime.
          </p>
        </div>
      </div>
    </div>
  )
}
