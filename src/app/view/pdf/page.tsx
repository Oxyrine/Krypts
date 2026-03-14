"use client"

import { useEffect, useState } from "react"
import { Search, ZoomIn, ZoomOut, Download, Printer, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SecurePdfViewer() {
  const [pages, setPages] = useState<number>(3)
  
  useEffect(() => {
    // Basic anti-piracy measures
    const handleContextMenu = (e: MouseEvent) => e.preventDefault()
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.key === "p") || // Block Print
        (e.ctrlKey && e.key === "s") || // Block Save
        e.key === "PrintScreen"
      ) {
        e.preventDefault()
      }
    }

    // Override print dialog
    const beforePrint = () => {
      document.body.style.display = 'none'
    }
    const afterPrint = () => {
      document.body.style.display = 'block'
    }

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
  }, [])

  return (
    <div className="h-screen w-full flex flex-col bg-slate-200 dark:bg-slate-950 overflow-hidden selection:bg-transparent">
      
      {/* Top Toolbar */}
      <div className="h-14 bg-background border-b flex items-center justify-between px-4 shrink-0 shadow-sm z-20 relative">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-semibold mr-2 border border-primary/20">
            SECURE DOC
          </div>
          <span className="font-medium text-sm truncate max-w-[200px] md:max-w-md">Q4_Enterprise_Financial_Report.pdf</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8"><ZoomOut className="h-4 w-4" /></Button>
          <span className="text-xs font-mono w-12 text-center">100%</span>
          <Button variant="ghost" size="icon" className="h-8 w-8"><ZoomIn className="h-4 w-4" /></Button>
          
          <div className="h-6 w-px bg-border mx-2"></div>
          
          <Button variant="ghost" size="icon" className="h-8 w-8"><Search className="h-4 w-4" /></Button>
          <div className="flex items-center gap-1.5 ml-2 mr-4 bg-muted px-2 py-1 rounded text-xs font-mono text-muted-foreground border">
            <UserCircle className="h-3.5 w-3.5" /> user_7392
          </div>

          <Button variant="outline" size="icon" disabled className="h-8 w-8 opacity-50" title="Downloading Disabled">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" disabled className="h-8 w-8 opacity-50" title="Printing Disabled">
            <Printer className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Document Area */}
      <div className="flex-1 overflow-y-auto w-full flex flex-col items-center py-8 gap-8 relative">
        
        {/* Dynamic Watermark Overlay covering scrolling container */}
        <div className="fixed inset-0 pointer-events-none z-10 flex flex-wrap content-start overflow-hidden opacity-20 mix-blend-multiply dark:mix-blend-overlay">
          <style dangerouslySetInnerHTML={{__html: `
            .pdf-watermark-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              grid-template-rows: repeat(12, 1fr);
              width: 150%;
              height: 200%;
              transform: rotate(-30deg) translate(-10%, -20%);
            }
            .pdf-watermark-item {
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: sans-serif;
              font-weight: 800;
              color: #777;
              font-size: 24px;
              white-space: nowrap;
            }
          `}} />
          <div className="pdf-watermark-grid">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className="pdf-watermark-item">
                KRYPTS DRM USER_7392
              </div>
            ))}
          </div>
        </div>

        {/* Fake PDF Pages */}
        {Array.from({ length: pages }).map((_, i) => (
          <div 
            key={i} 
            className="w-full max-w-3xl aspect-[1/1.4] bg-white shadow-lg mx-auto relative select-none border border-slate-300 dark:border-none ring-1 ring-black/5"
          >
            {/* Page Content Placeholder */}
            <div className="p-12 h-full flex flex-col">
              <div className="flex justify-between items-center mb-12 border-b pb-4">
                <div className="text-xl font-serif font-bold text-slate-800">ACME Corp</div>
                <div className="text-sm text-slate-500 font-mono">Q4 2025 CONFIDENTIAL</div>
              </div>
              
              {i === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-800">
                  <h1 className="text-4xl font-bold mb-4 text-center">Annual Financial Summary</h1>
                  <p className="text-lg text-slate-500 mb-12">Prepared for Executive Board</p>
                  
                  <div className="w-full h-48 bg-slate-100 rounded border border-slate-200 flex items-end p-4 gap-4">
                    <div className="w-1/4 bg-blue-500 h-[40%] rounded-t"></div>
                    <div className="w-1/4 bg-blue-500 h-[60%] rounded-t"></div>
                    <div className="w-1/4 bg-blue-500 h-[75%] rounded-t"></div>
                    <div className="w-1/4 bg-blue-500 h-[100%] rounded-t"></div>
                  </div>
                </div>
              )}
              
              {i > 0 && (
                <div className="flex-1 space-y-6 text-slate-800">
                  <h2 className="text-2xl font-bold mb-4">Section {i + 1}: Revenue Analysis</h2>
                  <div className="h-4 bg-slate-100 rounded w-full"></div>
                  <div className="h-4 bg-slate-100 rounded w-full"></div>
                  <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                  <div className="h-4 bg-slate-100 rounded w-full mt-6"></div>
                  <div className="h-4 bg-slate-100 rounded w-4/5"></div>
                  
                  <div className="mt-12 border rounded-lg p-6 bg-slate-50">
                    <div className="grid grid-cols-3 gap-4 font-mono text-sm">
                      <div className="font-bold border-b pb-2">Metric</div>
                      <div className="font-bold border-b pb-2">Q3</div>
                      <div className="font-bold border-b pb-2">Q4</div>
                      
                      <div className="py-2">Gross Subscriptions</div>
                      <div className="py-2">$4.2M</div>
                      <div className="py-2">$5.1M</div>
                      
                      <div className="py-2">Churn Rate</div>
                      <div className="py-2">2.4%</div>
                      <div className="py-2 text-green-600">1.8%</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center text-xs text-slate-400 mt-auto pt-4 border-t">
                Page {i + 1}
              </div>
            </div>
            
            {/* Transparent invisible overlay to prevent dragging text in some browsers */}
            <div className="absolute inset-0 z-20 w-full h-full bg-transparent"></div>
          </div>
        ))}
      </div>
      
    </div>
  )
}
