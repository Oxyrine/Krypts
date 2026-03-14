"use client"

import { useState } from "react"
import { Copy, Key, ShieldAlert, CheckCircle2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function TokenGeneratorPage() {
  const [generatedToken, setGeneratedToken] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setGeneratedToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaWxlSWQiOiJmaWxlXzkiLCJ1c2VySWQiOiJ1c2VyXzEifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c")
      setIsGenerating(false)
      setCopied(false)
    }, 800)
  }

  const copyToClipboard = () => {
    if (generatedToken) {
      navigator.clipboard.writeText(generatedToken)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Token Generator</h1>
          <p className="text-muted-foreground">Manually generate JWT access tokens for testing or admin overrides.</p>
        </div>
        <Button variant="outline"><Key className="mr-2 h-4 w-4" /> Manage API Keys</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Token Configuration</CardTitle>
              <CardDescription>
                Configure the payload claims for the JWT token.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-2">
                <Label htmlFor="file-id">Target File ID <span className="text-destructive">*</span></Label>
                <Select defaultValue="file_1">
                  <SelectTrigger id="file-id">
                    <SelectValue placeholder="Select a file" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="file_1">Advanced_React_Architecture.mp4 (file_9x8f7d6a)</SelectItem>
                    <SelectItem value="file_2">Q4_Enterprise_Financial_Report.pdf (file_3k2m1n0v)</SelectItem>
                    <SelectItem value="file_3">HQ_Product_Mockup_V4.png (file_1q2w3e4r)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="user-id">End-User ID (Optional)</Label>
                <Input id="user-id" placeholder="e.g. user_12345" />
                <p className="text-xs text-muted-foreground">Binds the token to a specific user for watermark tracking.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiration">Expiration</Label>
                  <Select defaultValue="2h">
                    <SelectTrigger id="expiration">
                      <SelectValue placeholder="Select expiry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15m">15 Minutes</SelectItem>
                      <SelectItem value="1h">1 Hour</SelectItem>
                      <SelectItem value="2h">2 Hours</SelectItem>
                      <SelectItem value="24h">24 Hours</SelectItem>
                      <SelectItem value="7d">7 Days</SelectItem>
                      <SelectItem value="never">Never (Not Recommended)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ip-bind">IP Restriction</Label>
                  <Input id="ip-bind" placeholder="e.g. 192.168.1.1" />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-sm font-medium">Permissions Override</h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Allow Download</Label>
                    <div className="text-xs text-muted-foreground text-red-500 flex items-center gap-1">
                      <ShieldAlert className="h-3 w-3" /> Disables DRM encryption
                    </div>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Dynamic Watermarking</Label>
                    <div className="text-xs text-muted-foreground">Force overlay on content</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Block Screen Capture</Label>
                    <div className="text-xs text-muted-foreground">Hardware/OS level blocks</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

            </CardContent>
            <CardFooter className="bg-muted/50 p-4 border-t flex justify-between">
              <Button variant="ghost">Reset</Button>
              <Button onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating ? "Signing Token..." : "Generate Token"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className={`h-full flex flex-col \${!generatedToken && !isGenerating ? 'opacity-50' : ''}`}>
            <CardHeader>
              <CardTitle>Generated Token</CardTitle>
              <CardDescription>
                Pass this JWT to the Krypts Client SDK to initialize playback.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>JWT Header & Payload</Label>
                  {generatedToken && <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">Valid for 2h</Badge>}
                </div>
                
                <div className="relative border rounded-md bg-slate-950 p-4 min-h-[120px]">
                  {isGenerating ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm">
                      <div className="animate-pulse flex space-x-2">
                        <div className="h-2 w-2 bg-primary rounded-full"></div>
                        <div className="h-2 w-2 bg-primary rounded-full delay-75"></div>
                        <div className="h-2 w-2 bg-primary rounded-full delay-150"></div>
                      </div>
                    </div>
                  ) : null}
                  
                  {generatedToken ? (
                    <div className="font-mono text-sm break-all leading-relaxed">
                      <span className="text-red-400">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9</span><span className="text-slate-500">.</span>
                      <span className="text-purple-400">eyJmaWxlSWQiOiJmaWxlXzkiLCJ1c2VySWQiOiJ1c2VyXzEifQ</span><span className="text-slate-500">.</span>
                      <span className="text-blue-400">SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c</span>
                    </div>
                  ) : (
                    <div className="text-slate-500 font-mono text-sm">
                      Token will appear here...
                    </div>
                  )}
                  
                  {generatedToken && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="absolute top-2 right-2 h-8 hover:bg-slate-800 text-slate-300"
                      onClick={copyToClipboard}
                    >
                      {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  )}
                </div>
              </div>

              {generatedToken && (
                <Tabs defaultValue="react" className="w-full pt-4">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="react">React</TabsTrigger>
                    <TabsTrigger value="html">Vanilla HTML</TabsTrigger>
                  </TabsList>
                  <TabsContent value="react" className="mt-4">
                    <div className="bg-slate-950 p-4 rounded-md overflow-x-auto text-xs font-mono text-slate-300 border border-slate-800">
                      <pre><code>
{`import { KryptsViewer } from '@krypts/react';

export default function App() {
  return (
    <KryptsViewer 
      token="\${generatedToken.substring(0, 15)}..."
      onReady={() => console.log('Secured')}
      onError={(err) => console.error(err)}
    />
  );
}`}
                      </code></pre>
                    </div>
                  </TabsContent>
                  <TabsContent value="html" className="mt-4">
                    <div className="bg-slate-950 p-4 rounded-md overflow-x-auto text-xs font-mono text-slate-300 border border-slate-800">
                      <pre><code>
{`<div id="krypts-container"></div>
<script src="https://cdn.krypts.com/v1/viewer.js"></script>
<script>
  const viewer = new Krypts.Viewer('#krypts-container', {
    token: "\${generatedToken.substring(0, 15)}..."
  });
</script>`}
                      </code></pre>
                    </div>
                  </TabsContent>
                </Tabs>
              )}

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
