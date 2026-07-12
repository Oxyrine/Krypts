"use client"

import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

export function UpdatesSection() {
  const updates = [
    {
      version: "v1.5",
      date: "July 2026",
      title: "Content Groups & Inbox",
      description: "Create user groups, send invites securely to their inbox, and share content in bulk to group members instantly.",
    },
    {
      version: "v1.4",
      date: "June 2026",
      title: "Secure Video Viewer",
      description: "Custom video player embedded directly in the platform to securely stream DRM-protected videos without external players.",
    },
    {
      version: "v1.3",
      date: "May 2026",
      title: "Dashboard Analytics",
      description: "Comprehensive analytics view for file access metrics, total tokens issued, and real-time security events.",
    },
    {
      version: "v1.2",
      date: "April 2026",
      title: "Advanced Admin Panel",
      description: "Dedicated interface for managing users, monitoring suspicious activities, resolving alerts, and enforcing suspensions.",
    },
    {
      version: "v1.1",
      date: "March 2026",
      title: "Desktop App Release",
      description: "Native Windows application with OS-level screenshot blocking, preventing screen recording via OBS and Snipping Tool.",
    },
  ]

  return (
    <section id="updates" className="py-24 bg-just-black border-t border-surface-25 font-mori">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="mb-16">
          <h2 className="text-[32px] md:text-[48px] font-semibold leading-[1.1] tracking-[-0.01em] text-surface-cream mb-4">
            Latest Platform Updates
          </h2>
          <p className="text-[19px] md:text-[23px] leading-[1.38] text-surface-50">
            We're constantly improving Krypts DRM. Here's what we've shipped recently to keep your content secure.
          </p>
        </div>

        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-surface-25 before:to-transparent">
          {updates.map((update, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-shockingly-green bg-just-black shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                <CheckCircle2 className="w-5 h-5 text-shockingly-green" />
              </div>
              
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-surface-25 bg-surface-10/30 backdrop-blur-sm transition-colors hover:bg-surface-10/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-shockingly-green bg-shockingly-green/10 px-3 py-1 rounded-full">
                    {update.version}
                  </span>
                  <time className="text-sm text-surface-50">{update.date}</time>
                </div>
                <h3 className="text-xl font-semibold text-surface-cream mb-2">{update.title}</h3>
                <p className="text-surface-50 leading-relaxed text-sm md:text-base">
                  {update.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
