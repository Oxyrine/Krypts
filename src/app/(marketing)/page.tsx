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
          <div className="text-[16px] md:text-[19px] text-surface-cream mb-8">
            { '{ Krypts DRM® }' }
          </div>

          {/* Massive Display Headline */}
          <h1 className="text-[90px] sm:text-[140px] md:text-[224px] font-semibold leading-[0.9] tracking-[-0.02em] text-surface-cream max-w-full">
            Protect<br />Anything.
          </h1>

          <p className="text-[19px] md:text-[23px] leading-[1.38] text-surface-cream max-w-2xl mt-12 mb-16">
            Military-grade encryption, real-time watermarking, and OS-level screenshot blocking — all through a simple API and native desktop app.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-6">
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
          </div>
        </div>
      </section>

      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <UseCasesSection />
      <IntegrationSection />

      {/* Desktop App Download Banner */}
      <section className="py-20 bg-gradient-to-br from-indigo-950 via-zinc-900 to-zinc-950 border-y border-indigo-900/40">
        <div className="container mx-auto px-6 max-w-5xl flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">Desktop App</span>
            </div>
            <h2 className="text-3xl font-bold text-white">Maximum protection on Windows</h2>
            <p className="text-zinc-400 max-w-lg">
              The Krypts desktop app adds OS-level screenshot blocking — your content
              appears as a <strong className="text-white">solid black screen</strong> in Snipping Tool,
              OBS, Zoom, Discord screen shares, and more.
            </p>
            <ul className="flex flex-wrap gap-3 justify-center md:justify-start text-sm">
              {["Screenshot blocking", "Screen-record protection", "DevTools disabled", "No right-click", "Free download"].map(f => (
                <li key={f} className="flex items-center gap-1.5 text-zinc-300">
                  <svg className="h-4 w-4 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-center gap-3 shrink-0">
            <a
              href="https://github.com/Oxyrine/krypts-2.0/releases/download/v0.1.0/Krypts.DRM.Setup.0.1.0.exe"
              className="group flex items-center gap-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 transition-all duration-200 px-8 py-4 shadow-lg shadow-indigo-900/40"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg>
              <div className="text-left">
                <div className="text-xs text-indigo-200 font-medium">Free Download</div>
                <div className="text-base font-bold text-white">Krypts for Windows</div>
              </div>
            </a>
            <p className="text-xs text-zinc-500">v0.1.0 · Windows 10/11 x64 · 319 MB</p>
            <a
              href="https://github.com/Oxyrine/krypts-2.0/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
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
