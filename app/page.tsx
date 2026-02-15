import { NavBar } from '@/components/navbar';
import { HeroSection } from '@/components/sections/hero';
import { Features } from '@/components/sections/features';
import { TargetAudience } from '@/components/sections/target-audience';
import { HowItWorks } from '@/components/sections/how-it-works';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <HeroSection />
      <Features />
      <TargetAudience />
      <HowItWorks />
    </div>
  );
}