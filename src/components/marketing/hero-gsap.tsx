"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin();

export function HeroGsap() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Only animate if user has no reduced-motion preference
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // 1. Announcement banner fades in
        tl.from(".hero-banner", { y: -16, opacity: 0, duration: 0.6 });

        // 2. Eyebrow label
        tl.from(".hero-eyebrow", { y: 16, opacity: 0, duration: 0.5 }, "-=0.2");

        // 3. Headline — each line clips up from below
        tl.from(".hero-line", {
          y: 80,
          opacity: 0,
          duration: 0.75,
          stagger: 0.12,
          clipPath: "inset(0 0 100% 0)",
        }, "-=0.2");

        // 4. Highlighter swipe on secondary text
        //    Block sweeps in → text reveals dark-on-green → block sweeps out
        tl.to(".hero-highlight-block", {
          scaleX: 1,
          transformOrigin: "left center",
          duration: 0.45,
          ease: "power2.inOut",
        }, "-=0.1");
        tl.set(".hero-highlight-text", { color: "#0e100f" });
        tl.to(".hero-highlight-block", {
          scaleX: 0,
          transformOrigin: "right center",
          duration: 0.45,
          ease: "power2.inOut",
        });

        // 5. Body copy + buttons fade in
        tl.from(".hero-body", { y: 20, opacity: 0, duration: 0.5 }, "-=0.3");
        tl.from(".hero-cta", { y: 20, opacity: 0, duration: 0.5, stagger: 0.1 }, "-=0.3");
      });

      return () => mm.revert();
    },
    { scope: container }
  );

  return (
    // ⚠️ No opacity:0 on any element — GSAP uses .from() so content is
    // always visible if JS fails or is slow.
    <div
      ref={container}
      className="relative w-full min-h-screen flex flex-col justify-center bg-just-black font-mori overflow-hidden"
    >
      {/* ── CSS-only floating blobs (no JS loop, no layout impact) ── */}
      <div
        className="absolute top-[12%] left-[8%] w-[420px] h-[420px] rounded-full bg-pink/8 blur-[90px] pointer-events-none animate-blob"
        style={{ animationDuration: "9s" }}
      />
      <div
        className="absolute top-[45%] right-[10%] w-[340px] h-[340px] rounded-full bg-shockingly-green/8 blur-[80px] pointer-events-none animate-blob"
        style={{ animationDuration: "12s", animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-[15%] left-[35%] w-[260px] h-[260px] rounded-full bg-lilac/10 blur-[70px] pointer-events-none animate-blob"
        style={{ animationDuration: "15s", animationDelay: "4s" }}
      />
      {/* Abstract ring shape */}
      <div
        className="absolute top-[30%] right-[20%] w-40 h-40 rounded-full border-[6px] border-blue/15 pointer-events-none animate-spin-slow"
      />

      {/* ── Top announcement banner ── */}
      <div className="hero-banner absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-shockingly-green via-blue to-lilac" />
      <div className="absolute top-4 inset-x-0 flex justify-center pointer-events-none">
        <div className="hero-banner flex items-center gap-2 px-4 py-1.5 rounded-full border border-surface-25 bg-off-black/80 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-shockingly-green animate-pulse" />
          <span className="text-[13px] text-surface-cream font-medium">
            Now with OS-level screenshot protection
          </span>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 md:px-12 pt-24 pb-20">

        {/* Eyebrow */}
        <p className="hero-eyebrow text-[16px] md:text-[19px] text-surface-cream mb-8">
          {"{ Krypts DRM® }"}
        </p>

        {/* Display headline — each word is wrapped for clip reveal */}
        <h1 className="text-[80px] sm:text-[120px] md:text-[192px] lg:text-[224px] font-semibold leading-[0.85] tracking-[-0.02em] text-surface-cream">
          <div className="overflow-hidden pb-2">
            <span className="hero-line block">Protect</span>
          </div>
          <div className="overflow-hidden pb-2">
            <span className="hero-line block">Anything.</span>
          </div>
        </h1>

        {/* Body + highlighter */}
        <div className="hero-body mt-12 mb-14 max-w-2xl text-[19px] md:text-[22px] leading-[1.5] text-surface-cream space-y-3">
          <p>Military-grade encryption, real-time watermarking, and</p>
          {/* Highlighter line */}
          <p className="relative inline-flex items-center">
            <span className="hero-highlight-text relative z-10 font-semibold px-2 py-0.5 leading-snug">
              OS-level screenshot blocking
            </span>
            {/* The sliding green block behind the text */}
            <span
              className="hero-highlight-block absolute inset-0 bg-shockingly-green z-0 scale-x-0 rounded-sm"
              aria-hidden
            />
          </p>
          <p> — all through a single API and native desktop app.</p>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-5">
          <a
            href="https://github.com/Oxyrine/krypts-2.0/releases/download/v0.1.0/Krypts.DRM.Setup.0.1.0.exe"
            className="hero-cta relative inline-flex items-center justify-center px-7 py-4 text-[17px] font-semibold text-surface-cream rounded-[100px] border-[1.5px] border-transparent bg-just-black bg-clip-padding before:absolute before:inset-0 before:-m-[1.5px] before:rounded-[100px] before:bg-gradient-to-r before:from-shockingly-green before:to-light-green before:-z-10 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Get Krypts for Windows
          </a>
          <Link
            href="/dashboard"
            className="hero-cta inline-flex items-center justify-center px-7 py-4 text-[17px] font-semibold text-surface-cream rounded-[100px] border border-surface-cream/60 hover:border-surface-cream hover:opacity-90 transition-all"
          >
            View Dashboard
          </Link>
        </div>

        {/* Caption */}
        <p className="hero-cta mt-6 text-[13px] text-surface-50">
          Free · No credit card · Windows 10/11 x64
        </p>
      </div>
    </div>
  );
}
