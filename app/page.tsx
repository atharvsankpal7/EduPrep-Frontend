import { HeroSection } from '@/components/sections/hero';
import { Features } from '@/components/sections/features';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <Features />
    </div>
  );
}