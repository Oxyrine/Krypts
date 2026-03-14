import { HeroSection } from "@/components/marketing/hero"
import { ProblemSection } from "@/components/marketing/problem"
import { SolutionSection } from "@/components/marketing/solution"
import { FeaturesSection } from "@/components/marketing/features"
import { UseCasesSection } from "@/components/marketing/use-cases"
import { IntegrationSection } from "@/components/marketing/integration"
import { PricingSection } from "@/components/marketing/pricing"

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <UseCasesSection />
      <IntegrationSection />
      <PricingSection />
    </div>
  )
}
