'use client'

import { useEffect } from 'react'
import Hero from '@/components/landing-page-glm/Hero'
import ProblemSolution from '@/components/landing-page-glm/ProblemSolution'
import ProductShowcase from '@/components/landing-page-glm/ProductShowcase'
import SocialProof from '@/components/landing-page-glm/SocialProof'
import TechnicalDifferentiators from '@/components/landing-page-glm/TechnicalDifferentiators'
import Conversion from '@/components/landing-page-glm/Conversion'
import Footer from '@/components/landing-page-glm/Footer'

export default function LandingPage() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
  }, [])

  return (
    <main className="min-h-screen bg-[#0D1B1C] text-[#F5F5DC]">
      <Hero />
      <ProblemSolution />
      <ProductShowcase />
      <SocialProof />
      <TechnicalDifferentiators />
      <Conversion />
      <Footer />
    </main>
  )
}
