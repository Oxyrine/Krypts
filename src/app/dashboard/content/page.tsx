"use client"

import { FileVideo, FileText, Image as ImageIcon, Search, Filter, MoreHorizontal, ShieldCheck, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

const files = [
  {
    id: "file_9x8f7d6a",
    name: "Advanced_React_Architecture.mp4",
    type: "video",
    size: "1.2 GB",
    status: "encrypted",
    views: 1245,
    uploadedAt: "Oct 24, 2025"
  },
  {
    id: "file_3k2m1n0v",
    name: "Q4_Enterprise_Financial_Report.pdf",
    type: "pdf",
    size: "4.5 MB",
    status: "encrypted",
    views: 89,
    uploadedAt: "Oct 22, 2025"
  },
  {
    id: "file_7b6v5c4x",
    name: "Proprietary_Algorithm_Architecture.pdf",
    type: "pdf",
    size: "2.1 MB",
    status: "processing",
    views: 0,
    uploadedAt: "Oct 20, 2025"
  },
  {
    id: "file_1q2w3e4r",
    name: "HQ_Product_Mockup_V4.png",
    type: "image",
    size: "8.4 MB",
    status: "encrypted",
    views: 432,
    uploadedAt: "Oct 15, 2025"
  },
  {
    id: "file_9m8n7b6v",
    name: "TypeScript_Mastery_Ep1.mp4",
    type: "video",
    size: "850 MB",
    status: "encrypted",
    views: 3102,
    uploadedAt: "Oct 10, 2025"
  }
]

export default function ContentManagerPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Content Manager</h1>
          <p className="text-muted-foreground">Manage your encrypted files and monitor access metrics.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
          <Button>Upload New</Button>
        </div>
      </div>

      <div className="flex items-center justify-between border-y py-4 px-2">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search files by name or ID..."
            className="pl-8 bg-background border-muted"
          />
        </div>

        <div className="hidden md:flex gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5 border px-3 py-1 rounded-md bg-background"><ShieldCheck className="h-4 w-4 text-green-500" /> 1,248 Encrypted</div>
          <div className="flex items-center gap-1.5 border px-3 py-1 rounded-md bg-background"><FileVideo className="h-4 w-4 text-pink-500" /> 845 Videos</div>
        </div>
      </div>

      <div className="rounded-md border bg-background overflow-hidden relative shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">File Name</TableHead>
              <TableHead>File ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Size</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Uploaded</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file) => (
              <TableRow key={file.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-md ${file.type === 'video' ? 'bg-pink-500/10 text-pink-500' :
                        file.type === 'pdf' ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'
                      }`}>
                      {file.type === 'video' ? <FileVideo className="h-4 w-4" /> :
                        file.type === 'pdf' ? <FileText className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
                    </div>
                    <span className="truncate max-w-[200px]" title={file.name}>{file.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{file.id}</code>
                </TableCell>
                <TableCell>
                  {file.status === 'encrypted' ? (
                    <Badge variant="outline" className="border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400 gap-1">
                      <ShieldCheck className="h-3 w-3" /> Encrypted
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30 animate-pulse">
                      Processing...
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">{file.size}</TableCell>
                <TableCell className="text-right text-muted-foreground">{file.views.toLocaleString()}</TableCell>
                <TableCell className="text-right text-muted-foreground whitespace-nowrap">{file.uploadedAt}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground outline-none">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem className="cursor-pointer" onClick={() => navigator.clipboard.writeText(file.id)}>
                        Copy File ID
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        Generate Token
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer text-primary">
                        View Analytics
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground">
                        Delete File
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

    </div>
  )
}
