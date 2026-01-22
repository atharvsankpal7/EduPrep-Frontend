'use client'

import { useEffect, useRef } from 'react'

export default function SocialProof() {
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

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'JEE Aspirant',
      quote: 'The analytics showed me exactly where I was losing marks. My mock test scores improved by 40% in two months.',
      score: '+40%'
    },
    {
      name: 'Rahul Verma',
      role: 'NEET Student',
      quote: 'Structured learning saved me hours of confusion. I knew exactly what to study every day.',
      score: '5hrs/day'
    },
    {
      name: 'Dr. Ananya Gupta',
      role: 'Physics Teacher',
      quote: 'My students finally stopped asking "what should I study next?" The platform guides them perfectly.',
      score: '95% pass'
    }
  ]

  const metrics = [
    { label: 'Students', value: '50,000+' },
    { label: 'Questions Attempted', value: '2.5M+' },
    { label: 'Average Score Improvement', value: '35%' },
    { label: 'Institutions', value: '120+' }
  ]

  return (
    <section className="py-24 px-4 md:px-8 bg-[#0A1415]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div
            ref={setRef(0)}
            className="scroll-reveal font-mono text-sm tracking-widest uppercase mb-4 text-[#C9A961]"
          >
            Results Speak
          </div>
          <h2
            ref={setRef(1)}
            className="scroll-reveal font-display text-4xl md:text-6xl font-bold mb-6"
          >
            Trusted Results
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              ref={setRef(2 + index)}
              className="scroll-reveal group bg-[#0D1B1C] p-8 rounded-sm border border-[#A8A890]/20 hover:border-[#D47E3E] transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 font-display text-5xl font-bold text-[#D47E3E]/10 group-hover:text-[#D47E3E]/20 transition-all">
                {testimonial.score}
              </div>
              <p className="font-body text-[#A8A890] leading-relaxed mb-6 relative z-10">
                {testimonial.quote}
              </p>
              <div className="relative z-10">
                <div className="font-display text-xl font-semibold text-[#F5F5DC]">
                  {testimonial.name}
                </div>
                <div className="font-mono text-xs uppercase tracking-wider text-[#D47E3E]">
                  {testimonial.role}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          ref={setRef(5)}
          className="scroll-reveal bg-gradient-to-br from-[#0D1B1C] to-[#0A1415] p-12 rounded-sm border border-[#A8A890]/20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="font-display text-4xl md:text-5xl font-bold text-[#C9A961] mb-2">
                  {metric.value}
                </div>
                <div className="font-mono text-xs uppercase tracking-wider text-[#A8A890]">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
