import { HeroSection } from "@/components/home/hero-section";
import { HowItWorksSection } from "@/components/home/how-it-works";
import { MarketplacePreviewSection } from "@/components/home/marketplace-preview";
import { ShopsPreviewSection } from "@/components/home/shops-preview";
import { TrustSection } from "@/components/home/trust-section";
import { WhyRegisterSection } from "@/components/home/why-register";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <WhyRegisterSection />
      <TrustSection />
      <MarketplacePreviewSection />
      <ShopsPreviewSection />
    </>
  );
}
