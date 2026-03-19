"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Key, Copy, Clock, Shield } from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { api, FileListResponse, GenerateTokenResponse } from "@/lib/api"

export default function TokensPage() {
  const searchParams = useSearchParams()
  const preselectedFileId = searchParams.get("file_id") || ""

  const [files, setFiles] = useState<FileListResponse[]>([])
  const [selectedFileId, setSelectedFileId] = useState(preselectedFileId)
  const [expiresIn, setExpiresIn] = useState("2h")
  const [ipRestriction, setIpRestriction] = useState("")
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState<GenerateTokenResponse | null>(null)

  useEffect(() => {
    api.files.list()
      .then(setFiles)
      .catch(() => toast.error("Failed to load files"))
  }, [])

  const handleGenerate = async () => {
    if (!selectedFileId) {
      toast.error("Please select a file.")
      return
    }
    setGenerating(true)
    setResult(null)
    try {
      const resp = await api.tokens.generate({
        file_id: selectedFileId,
        expires_in: expiresIn,
        ip_restriction: ipRestriction || undefined,
        permissions: { view: true, download: false },
      })
      setResult(resp)
      toast.success("Token generated successfully!")
    } catch (err: any) {
      toast.error(err.message || "Token generation failed")
    } finally {
      setGenerating(false)
    }
  }

  const selectedFile = files.find(f => f.id === selectedFileId)
  const viewerBase = selectedFile
    ? `/${selectedFile.file_type === "PDF" ? "view/pdf" : selectedFile.file_type === "VIDEO" ? "view/video" : "view/image"}?file_id=${selectedFileId}&token=`
    : null

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Token Generator</h1>
        <p className="text-muted-foreground">Generate signed access tokens for secure content delivery.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Generate Access Token</CardTitle>
          <CardDescription>Tokens are signed JWTs that grant time-limited access to a specific file.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Select File</Label>
            <Select value={selectedFileId} onValueChange={setSelectedFileId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a protected file..." />
              </SelectTrigger>
              <SelectContent>
                {files.map(f => (
                  <SelectItem key={f.id} value={f.id}>
                    <span className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{f.file_type}</Badge>
                      {f.original_filename}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Expiration</Label>
            <Select value={expiresIn} onValueChange={setExpiresIn}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30m">30 minutes</SelectItem>
                <SelectItem value="1h">1 hour</SelectItem>
                <SelectItem value="2h">2 hours</SelectItem>
                <SelectItem value="24h">24 hours</SelectItem>
                <SelectItem value="7d">7 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>IP Restriction (optional)</Label>
            <Input
              placeholder="e.g. 192.168.1.100"
              value={ipRestriction}
              onChange={(e) => setIpRestriction(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Leave blank to allow any IP address.</p>
          </div>

          <Button onClick={handleGenerate} disabled={generating || !selectedFileId} className="w-full">
            <Key className="mr-2 h-4 w-4" />
            {generating ? "Generating..." : "Generate Token"}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-green-500/30 bg-green-500/5">
          <CardHeader>
            <CardTitle className="text-base text-green-600 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Token Generated
            </CardTitle>
            <CardDescription>
              Share this token securely. It expires at {new Date(result.expires_at).toLocaleString()}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Access Token</Label>
              <div className="flex gap-2">
                <Input value={result.token} readOnly className="font-mono text-xs" />
                <Button
                  variant="outline" size="icon"
                  onClick={() => { navigator.clipboard.writeText(result.token); toast.success("Token copied!") }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {viewerBase && typeof window !== "undefined" && (
              <div className="space-y-2">
                <Label>Viewer URL</Label>
                <div className="flex gap-2">
                  <Input
                    value={`${window.location.origin}${viewerBase}${result.token}`}
                    readOnly
                    className="font-mono text-xs"
                  />
                  <Button
                    variant="outline" size="icon"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}${viewerBase}${result.token}`)
                      toast.success("URL copied!")
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              Token ID: {result.id}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
