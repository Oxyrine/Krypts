import dynamic from "next/dynamic"
import { GlassEffect, GlassFilter } from "@/components/ui/liquid-glass"

const ShaderAnimation = dynamic(() => import("@/components/ui/shader-animation").then(m => ({ default: m.ShaderAnimation })), { loading: () => <div className="h-full w-full bg-zinc-950" /> })
import { ProblemSection } from "@/components/marketing/problem"
import { SolutionSection } from "@/components/marketing/solution"
import { FeaturesSection } from "@/components/marketing/features"
import { UseCasesSection } from "@/components/marketing/use-cases"
import { IntegrationSection } from "@/components/marketing/integration"
import PricingSection from "@/components/ui/pricing-section-4"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      <GlassFilter />

      {/* Hero with Shader Animation */}
      <section className="relative h-screen w-full">
        <ShaderAnimation />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-8 px-4 text-center">
          <GlassEffect className="rounded-full px-5 py-2">
            <span className="text-sm font-medium text-white">
              New: Universal API v2.0 Released
            </span>
          </GlassEffect>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white max-w-3xl">
            The Plug-and-Play <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">DRM Platform</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Protect your digital content with military-grade encryption, real-time watermarking, and granular access control — all through a simple API.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/signup">
              <GlassEffect className="rounded-2xl px-8 py-4 hover:px-9 hover:py-5 hover:rounded-3xl">
                <span className="text-base font-semibold text-white">Get Started Free</span>
              </GlassEffect>
            </Link>
            <Link href="/dashboard">
              <GlassEffect className="rounded-2xl px-8 py-4 hover:px-9 hover:py-5 hover:rounded-3xl" style={{ background: "rgba(255,255,255,0.05)" }}>
                <span className="text-base font-semibold text-white/90">View Dashboard</span>
              </GlassEffect>
            </Link>
            <a
              href="https://github.com/Oxyrine/krypts-2.0/releases/download/v0.1.0/Krypts.DRM.Setup.0.1.0.exe"
              download
            >
              <GlassEffect className="rounded-2xl px-8 py-4 hover:px-9 hover:py-5 hover:rounded-3xl flex items-center gap-2" style={{ background: "rgba(99,102,241,0.18)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg>
                <span className="text-base font-semibold text-indigo-200">Download for Windows</span>
              </GlassEffect>
            </a>
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
              download
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
