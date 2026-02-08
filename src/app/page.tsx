import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import SocialProof from "@/components/landing/SocialProof";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import SearchDemo from "@/components/landing/SearchDemo";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import CTAFooter from "@/components/landing/CTAFooter";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <Features />
        <HowItWorks />
        <SearchDemo />
        <Pricing />
        <FAQ />
        <CTAFooter />
      </main>
      <Footer />
    </>
  );
}
