"use client"

import { useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Shield, AlertTriangle } from "lucide-react"
import { API_BASE } from "@/lib/api"

function VideoViewerInner() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || ""
  const fileId = searchParams.get("file_id") || ""

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault()
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === "s" || e.key === "u")) e.preventDefault()
    }
    document.addEventListener("contextmenu", handleContextMenu)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  if (!token || !fileId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-900">
        <div className="flex flex-col items-center gap-3 text-center p-8 text-white">
          <AlertTriangle className="h-10 w-10 text-destructive" />
          <h2 className="text-xl font-semibold">Access Denied</h2>
          <p className="text-zinc-400 text-sm">A valid content token and file ID are required.</p>
        </div>
      </div>
    )
  }

  const videoUrl = `${API_BASE}/stream/video/${fileId}?token=${token}`

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 select-none">
      <div className="sticky top-0 z-10 flex items-center gap-2 px-4 h-12 bg-zinc-900 border-b border-zinc-800 text-white">
        <Shield className="h-4 w-4 text-primary" />
        <span className="text-sm text-zinc-300">Protected by Krypts DRM • Streaming encrypted content</span>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          <video
            src={videoUrl}
            controls
            controlsList="nodownload nofullscreen noremoteplayback"
            disablePictureInPicture
            className="w-full rounded-xl shadow-2xl"
            onContextMenu={(e) => e.preventDefault()}
          >
            Your browser does not support secure video playback.
          </video>
          <p className="text-center text-xs text-zinc-500 mt-3">
            This content is watermarked and tracked. Unauthorized redistribution is prohibited.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SecureVideoViewer() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">Loading viewer...</div>}>
      <VideoViewerInner />
    </Suspense>
  )
}
