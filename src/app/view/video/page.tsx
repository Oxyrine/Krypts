"use client"

import { useEffect, useState, useRef } from "react"
import { Play, Pause, Volume2, Maximize, Settings, FastForward } from "lucide-react"

export default function SecureVideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Prevent right-click, dragging, and selected text
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault()
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent PrintScreen, F12, Ctrl+Shift+I, etc.
      if (
        e.key === "PrintScreen" || 
        e.key === "F12" || 
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault()
      }
    }

    document.addEventListener("contextmenu", handleContextMenu)
    document.addEventListener("keydown", handleKeyDown)

    // Simulate playback progress
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            setIsPlaying(false)
            return 100
          }
          return p + 0.1
        })
      }, 100)
    }

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("keydown", handleKeyDown)
      if (interval) clearInterval(interval)
    }
  }, [isPlaying])

  const togglePlay = () => setIsPlaying(!isPlaying)

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 selection:bg-transparent">
      
      <div 
        ref={containerRef}
        className="relative w-full max-w-5xl aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 group"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        
        {/* Anti-Recording Overlay / Dynamic Watermark */}
        <div className="absolute inset-0 pointer-events-none z-10 flex flex-wrap content-start overflow-hidden opacity-30 mix-blend-overlay">
          <style dangerouslySetInnerHTML={{__html: `
            .vid-watermark-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              grid-template-rows: repeat(8, 1fr);
              width: 150%;
              height: 150%;
              transform: rotate(-25deg) translate(-10%, -20%);
            }
            .vid-watermark-item {
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: monospace;
              color: white;
              font-size: 14px;
              white-space: nowrap;
              text-shadow: 1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000;
              animation: shift 60s linear infinite;
            }
            @keyframes shift {
              0% { transform: translate(0, 0); }
              100% { transform: translate(50px, 50px); }
            }
          `}} />
          <div className="vid-watermark-grid">
            {Array.from({ length: 32 }).map((_, i) => (
              <div key={i} className="vid-watermark-item">
                session_84fb9a • user_5521
              </div>
            ))}
          </div>
        </div>

        {/* Video Content Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-900 to-black select-none z-0">
          <div className="text-center opacity-40">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-500 mb-2">
              Encrypted Stream
            </h2>
            <p className="font-mono text-xs text-slate-500">Krypts AES-256 Memory Decode</p>
          </div>
        </div>

        {/* Big Center Play Button (when paused) */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <button 
              onClick={togglePlay}
              className="h-20 w-20 bg-primary/90 hover:bg-primary text-primary-foreground rounded-full flex items-center justify-center backdrop-blur shadow-xl transition-transform hover:scale-105"
            >
              <Play className="h-10 w-10 ml-2" />
            </button>
          </div>
        )}

        {/* Custom Controls */}
        <div 
          className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 z-30 transition-opacity duration-300 \${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-white/20 rounded-full mb-4 overflow-hidden relative cursor-pointer group/progress">
            <div className="absolute left-0 top-0 bottom-0 bg-white/40 w-full transform -translate-x-full transition-transform"></div>
            <div 
              className="absolute left-0 top-0 bottom-0 bg-primary transition-all duration-100 ease-linear"
              style={{ width: `\${progress}%` }}
            ></div>
            <div 
              className="absolute top-1/2 w-3 h-3 bg-white rounded-full -translate-y-1/2 opacity-0 group-hover/progress:opacity-100 shadow flex items-center justify-center"
              style={{ left: `calc(\${progress}% - 6px)` }}
            >
              <div className="w-1 h-1 bg-primary rounded-full"></div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <button onClick={togglePlay} className="hover:text-primary transition-colors">
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>
              <button className="hover:text-primary transition-colors">
                <FastForward className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2 group/vol">
                <button className="hover:text-primary transition-colors">
                  <Volume2 className="h-5 w-5" />
                </button>
                <div className="w-0 overflow-hidden group-hover/vol:w-20 transition-all duration-300">
                  <div className="w-16 h-1 bg-white/30 rounded-full mx-2 my-2 relative">
                    <div className="absolute left-0 top-0 bottom-0 w-3/4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
              <span className="text-xs font-mono opacity-80 pl-2 border-l border-white/20">
                {Math.floor(progress * 0.6)}:{(Math.floor((progress * 3.6) % 60)).toString().padStart(2, '0')} / 10:00
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button className="hover:text-primary transition-colors">
                <Settings className="h-5 w-5" />
              </button>
              <button className="hover:text-primary transition-colors">
                <Maximize className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
      </div>

      {/* Debug Info Overlay for Demo */}
      <div className="fixed top-4 left-4 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg p-3 text-xs font-mono text-green-400 pointer-events-none z-50">
        <div>[Krypts DRM Validated]</div>
        <div>Stream ID: strm_88fx3v</div>
        <div>Policy: Strict (No DL)</div>
        <div className="text-slate-400 mt-2 border-t border-white/10 pt-2">
          Anti-piracy modules active:<br/>
          ✓ Right-click disabled<br/>
          ✓ DOM Inspect blocked<br/>
          ✓ Memory extraction secured
        </div>
      </div>

    </div>
  )
}
