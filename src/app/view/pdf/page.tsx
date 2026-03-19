"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Shield, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { API_BASE } from "@/lib/api"

function PdfViewerInner() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || ""
  const fileId = searchParams.get("file_id") || ""

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages] = useState(10)  // We try pages until they fail
  const [zoom, setZoom] = useState(100)
  const [failedPages, setFailedPages] = useState<Set<number>>(new Set())
  const [validToken, setValidToken] = useState(!!token && !!fileId)

  useEffect(() => {
    if (!token || !fileId) setValidToken(false)

    // Anti-piracy measures
    const handleContextMenu = (e: MouseEvent) => e.preventDefault()
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && (e.key === "p" || e.key === "s" || e.key === "c")) || e.key === "PrintScreen") {
        e.preventDefault()
      }
    }
    const beforePrint = () => { document.body.style.display = "none" }
    const afterPrint = () => { document.body.style.display = "block" }

    document.addEventListener("contextmenu", handleContextMenu)
    document.addEventListener("keydown", handleKeyDown)
    window.addEventListener("beforeprint", beforePrint)
    window.addEventListener("afterprint", afterPrint)
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("beforeprint", beforePrint)
      window.removeEventListener("afterprint", afterPrint)
    }
  }, [token, fileId])

  if (!validToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-center p-8">
          <AlertTriangle className="h-10 w-10 text-destructive" />
          <h2 className="text-xl font-semibold">Access Denied</h2>
          <p className="text-muted-foreground text-sm">
            A valid content token and file ID are required to view this document.
          </p>
        </div>
      </div>
    )
  }

  const pageUrl = `${API_BASE}/pdf/${fileId}/page/${currentPage}?token=${token}`

  return (
    <div
      className="flex flex-col min-h-screen bg-zinc-900 select-none"
      onCopy={(e) => e.preventDefault()}
    >
      {/* Header toolbar */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 h-12 bg-zinc-800 border-b border-zinc-700 text-white">
        <div className="flex items-center gap-2 text-sm">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-zinc-300">Protected by Krypts DRM</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-300 hover:text-white hover:bg-zinc-700" onClick={() => setZoom(z => Math.max(50, z - 10))}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm text-zinc-300 w-12 text-center">{zoom}%</span>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-300 hover:text-white hover:bg-zinc-700" onClick={() => setZoom(z => Math.min(200, z + 10))}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-300 hover:text-white hover:bg-zinc-700" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-zinc-300">Page {currentPage}</span>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-300 hover:text-white hover:bg-zinc-700" onClick={() => setCurrentPage(p => p + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF page display */}
      <div className="flex-1 flex items-start justify-center p-6 overflow-auto">
        <div style={{ width: `${zoom}%`, maxWidth: 900 }}>
          <object
            data={pageUrl}
            type="application/pdf"
            className="w-full min-h-[800px] rounded shadow-xl"
            onError={() => setFailedPages(prev => new Set([...prev, currentPage]))}
          >
            {/* Fallback: render as image */}
            <img
              src={pageUrl}
              alt={`Page ${currentPage}`}
              className="w-full rounded shadow-xl"
              draggable={false}
              onError={() => setFailedPages(prev => new Set([...prev, currentPage]))}
            />
          </object>
          {failedPages.has(currentPage) && (
            <div className="mt-4 text-center text-zinc-400 text-sm">
              Could not load page {currentPage}. The document may have fewer pages.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SecurePdfViewer() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-zinc-900 text-white">Loading viewer...</div>}>
      <PdfViewerInner />
    </Suspense>
  )
}
