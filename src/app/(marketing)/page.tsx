"use client"

import { motion } from "framer-motion"
import { ProblemSection } from "@/components/marketing/problem"
import { SolutionSection } from "@/components/marketing/solution"
import { FeaturesSection } from "@/components/marketing/features"
import { UseCasesSection } from "@/components/marketing/use-cases"
import { IntegrationSection } from "@/components/marketing/integration"
import PricingSection from "@/components/ui/pricing-section-4"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full overflow-hidden bg-just-black font-mori">

      {/* GSAP-Style Hero */}
      <section className="relative min-h-[90vh] w-full flex flex-col items-start justify-center px-6 md:px-12 py-32 bg-just-black overflow-hidden">
        
        {/* Soft Decorative Blob */}
        <div className="absolute top-1/4 right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-shockingly-green to-blue opacity-30 blur-[100px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-[1280px] mx-auto">
          {/* Eyebrow */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[16px] md:text-[19px] text-surface-cream mb-8"
          >
            { '{ Krypts DRM® }' }
          </motion.div>

          {/* Massive Display Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[90px] sm:text-[140px] md:text-[224px] font-semibold leading-[0.9] tracking-[-0.02em] text-surface-cream max-w-full"
          >
            Protect<br />Anything.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[19px] md:text-[23px] leading-[1.38] text-surface-cream max-w-2xl mt-12 mb-16"
          >
            Military-grade encryption, real-time watermarking, and OS-level screenshot blocking — all through a simple API and native desktop app.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-6"
          >
            <a
              href="https://github.com/Oxyrine/krypts-2.0/releases/download/v0.1.0/Krypts.DRM.Setup.0.1.0.exe"
              className="relative inline-flex items-center justify-center px-[24px] py-[15px] text-[18px] font-semibold text-surface-cream rounded-[100px] border-[1.5px] border-transparent bg-just-black bg-clip-padding before:absolute before:inset-0 before:-m-[1.5px] before:rounded-[100px] before:bg-gradient-to-r before:from-shockingly-green before:to-light-green before:-z-10 transition-transform hover:scale-[1.02]"
            >
              Get Krypts for Windows
            </a>
            
            <Link 
              href="/dashboard"
              className="inline-flex items-center justify-center px-[24px] py-[15px] text-[18px] font-semibold text-surface-cream rounded-[100px] border border-surface-cream hover:opacity-80 transition-opacity"
            >
              View Dashboard
            </Link>
          </motion.div>
        </div>
      </section>

      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <UseCasesSection />
      <IntegrationSection />

      {/* Desktop App Download Banner - GSAP Style */}
      <section className="py-32 bg-just-black border-y border-surface-25 font-mori">
        <div className="container mx-auto px-6 max-w-[1280px] flex flex-col md:flex-row items-center justify-between gap-12">
          
          <div className="space-y-6 text-center md:text-left max-w-2xl">
            <div className="text-[16px] md:text-[19px] text-surface-cream">
              { '{ Maximum protection on Windows }' }
            </div>
            
            <h2 className="text-[44px] md:text-[66px] font-semibold leading-[1.1] tracking-[-0.01em] text-surface-cream">
              OS-Level Security
            </h2>
            
            <p className="text-[19px] md:text-[23px] leading-[1.38] text-surface-50">
              The Krypts desktop app adds OS-level screenshot blocking — your content
              appears as a solid black screen in Snipping Tool, OBS, Zoom, and Discord screen shares.
            </p>
            
            <ul className="flex flex-wrap gap-6 justify-center md:justify-start text-[16px] pt-4">
              {["Screenshot blocking", "Screen-record protection", "DevTools disabled", "No right-click"].map(f => (
                <li key={f} className="flex items-center gap-2 text-surface-cream">
                  <span className="text-shockingly-green">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center gap-4 shrink-0 mt-8 md:mt-0">
            <a
              href="https://github.com/Oxyrine/krypts-2.0/releases/download/v0.1.0/Krypts.DRM.Setup.0.1.0.exe"
              download
              className="relative inline-flex items-center justify-center px-[32px] py-[20px] text-[18px] font-semibold text-surface-cream rounded-[100px] border-[1.5px] border-transparent bg-just-black bg-clip-padding before:absolute before:inset-0 before:-m-[1.5px] before:rounded-[100px] before:bg-gradient-to-r before:from-shockingly-green before:to-light-green before:-z-10 transition-transform hover:scale-[1.02]"
            >
              Download for Windows
            </a>
            <p className="text-[14px] text-surface-50 mt-4">v0.1.0 · Windows 10/11 x64 · 319 MB</p>
            <a
              href="https://github.com/Oxyrine/krypts-2.0/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] text-surface-50 hover:text-surface-cream transition-colors mt-1"
            >
              View release notes on GitHub →
            </a>
          </div>
          
        </div>
      </section>

      <PricingSection />
    </div>
  )
}
