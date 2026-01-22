'use client'

import { useEffect, useRef } from 'react'

export default function TechnicalDifferentiators() {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const elementsRef = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.2 }
    )

    elementsRef.current.forEach((el) => {
      if (el) observerRef.current?.observe(el)
    })

    return () => {
      observerRef.current?.disconnect()
    }
  }, [])

  const setRef = (index: number) => (el: HTMLElement | null) => {
    elementsRef.current[index] = el
  }

  const features = [
    {
      title: 'Guided Preparation',
      description: 'Not just content dumping. We provide clear progression paths and learning milestones.',
      highlight: true
    },
    {
      title: 'Data-Backed Insights',
      description: 'Replace guesswork with real performance analytics and personalized recommendations.',
      highlight: true
    },
    {
      title: 'Student-Centric Design',
      description: 'Built for clarity and simplicity. Focus on learning, not figuring out the platform.',
      highlight: false
    },
    {
      title: 'Institution Ready',
      description: 'Scalable for coaching institutes and educators to deliver content digitally.',
      highlight: false
    }
  ]

  const comparison = [
    { feature: 'Traditional', eduprep: 'EduPrep', label: 'Structure', traditional: 'Random material', eduprep_val: 'Guided paths' },
    { feature: 'Traditional', eduprep: 'EduPrep', label: 'Practice', traditional: 'Unfocused attempts', eduprep_val: 'Targeted questions' },
    { feature: 'Traditional', eduprep: 'EduPrep', label: 'Tracking', traditional: 'No visibility', eduprep_val: 'Detailed analytics' },
    { feature: 'Traditional', eduprep: 'EduPrep', label: 'Improvement', traditional: 'Trial and error', eduprep_val: 'Data-driven insights' }
  ]

  return (
    <section className="py-24 px-4 md:px-8 bg-[#0D1B1C]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div
            ref={setRef(0)}
            className="scroll-reveal font-mono text-sm tracking-widest uppercase mb-4 text-[#C9A961]"
          >
            What Makes Us Different
          </div>
          <h2
            ref={setRef(1)}
            className="scroll-reveal font-display text-4xl md:text-6xl font-bold mb-6"
          >
            The EduPrep Difference
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={setRef(2 + index)}
              className={`scroll-reveal p-8 rounded-sm border transition-all duration-300 ${
                feature.highlight
                  ? 'bg-gradient-to-br from-[#D47E3E]/10 to-transparent border-[#D47E3E]'
                  : 'bg-[#0A1415] border-[#A8A890]/20 hover:border-[#C9A961]'
              }`}
            >
              <h3 className="font-display text-2xl font-bold mb-4 text-[#F5F5DC]">
                {feature.title}
              </h3>
              <p className="font-body text-[#A8A890] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div
          ref={setRef(6)}
          className="scroll-reveal bg-[#0A1415] p-8 md:p-12 rounded-sm border border-[#A8A890]/20"
        >
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-8 text-center">
            Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr>
                  <th className="font-mono text-xs uppercase tracking-wider text-[#A8A890] text-left py-4 px-4">Aspect</th>
                  <th className="font-mono text-xs uppercase tracking-wider text-[#A8A890] text-left py-4 px-4">Traditional</th>
                  <th className="font-mono text-xs uppercase tracking-wider text-[#D47E3E] text-left py-4 px-4">EduPrep</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, index) => (
                  <tr key={index} className="border-t border-[#A8A890]/10">
                    <td className="font-body font-semibold py-4 px-4">{row.label}</td>
                    <td className="font-body text-[#A8A890] py-4 px-4">{row.traditional}</td>
                    <td className="font-body text-[#C9A961] py-4 px-4">{row.eduprep_val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
