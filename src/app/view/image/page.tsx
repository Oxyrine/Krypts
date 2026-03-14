"use client"

import { useEffect } from "react"
import { ShieldAlert } from "lucide-react"

export default function SecureImageViewer() {
  
  useEffect(() => {
    // Disable right click and dragging
    const preventAction = (e: Event) => e.preventDefault()
    
    document.addEventListener("contextmenu", preventAction)
    document.addEventListener("dragstart", preventAction)
    
    return () => {
      document.removeEventListener("contextmenu", preventAction)
      document.removeEventListener("dragstart", preventAction)
    }
  }, [])

  return (
    <div className="h-screen w-full bg-[#0a0a0a] flex flex-col items-center justify-center relative overflow-hidden select-none">
      
      <div className="absolute top-6 left-6 z-20 bg-black/60 backdrop-blur border border-white/10 px-4 py-2 rounded-full flex items-center gap-2 text-sm text-white font-medium">
        <ShieldAlert className="h-4 w-4 text-emerald-400" />
        Image Guard Active
      </div>

      {/* Main Image Container */}
      <div className="relative max-w-4xl max-h-[80vh] aspect-[4/3] w-full mx-8">
        
        {/* The actual image (simulated with CSS gradient for demo) */}
        <div 
          className="absolute inset-0 rounded border border-white/5 shadow-2xl z-0 overflow-hidden bg-gradient-to-tr from-purple-800 via-pink-700 to-orange-500"
          style={{ backgroundImage: "linear-gradient(45deg, #111 25%, transparent 25%, transparent 75%, #111 75%, #111), linear-gradient(45deg, #111 25%, transparent 25%, transparent 75%, #111 75%, #111)", backgroundSize: "20px 20px", backgroundPosition: "0 0, 10px 10px" }}
        >
          {/* Abstract Image Details */}
          <div className="w-full h-full flex flex-col items-center justify-center text-white/50 space-y-4 mix-blend-overlay">
            <div className="w-64 h-64 border-4 border-white/30 rounded-full flex items-center justify-center">
              <div className="w-32 h-32 bg-white/30 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>

        {/* Glassmorphism Watermark Overlay - directly over image */}
        <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center overflow-hidden mix-blend-overlay opacity-60">
          <div className="transform -rotate-45 text-white/90 font-black text-6xl tracking-widest leading-loose text-center">
            PROPRIETARY<br/>
            <span className="text-3xl font-mono opacity-80">user_session_9438</span><br/>
            DO NOT SHARE
          </div>
        </div>
      </div>

    </div>
  )
}
