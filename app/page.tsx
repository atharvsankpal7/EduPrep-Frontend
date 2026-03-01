import { Metadata } from 'next';
import { NavBar } from '@/components/navbar';
import { HeroSection } from '@/components/sections/hero';
import { Features } from '@/components/sections/features';
import { TargetAudience } from '@/components/sections/target-audience';
import { HowItWorks } from '@/components/sections/how-it-works';

export const metadata: Metadata = {
  title: 'EduPrep | Top-Rated Mock Tests & Exam Preparation',
  description: 'Join top scorers. EduPrep offers real exam simulations, proctoring, and AI-driven analytics to maximize your competitive exam results.',
  alternates: {
    canonical: '/',
  }
};

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'EduPrep',
    url: 'https://www.eduprep.app',
    description: 'Advanced mock test platform for competitive exam preparation with proctoring and AI analytics.',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NavBar />
      <HeroSection />
      <Features />
      <TargetAudience />
      <HowItWorks />
    </div>
  );
}