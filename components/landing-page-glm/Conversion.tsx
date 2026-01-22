'use client'

import { useEffect, useRef, useState } from 'react'

export default function Conversion() {
  const [formData, setFormData] = useState({ name: '', email: '', institution: '' })
  const [submitted, setSubmitted] = useState(false)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="conversion" className="py-24 px-4 md:px-8 bg-gradient-to-b from-[#0A1415] to-[#0D1B1C]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div
            ref={setRef(0)}
            className="scroll-reveal font-mono text-sm tracking-widest uppercase mb-4 text-[#C9A961]"
          >
            Get Started
          </div>
          <h2
            ref={setRef(1)}
            className="scroll-reveal font-display text-4xl md:text-6xl font-bold mb-6"
          >
            Begin Your Journey
          </h2>
          <p
            ref={setRef(2)}
            className="scroll-reveal font-body text-xl text-[#A8A890] leading-relaxed"
          >
            Join thousands of students and educators who transformed their preparation with EduPrep
          </p>
        </div>

        <div
          ref={setRef(3)}
          className="scroll-reveal bg-[#0D1B1C] p-8 md:p-12 rounded-sm border border-[#A8A890]/20"
        >
          {submitted ? (
            <div className="text-center py-12">
              <div className="font-display text-5xl font-bold text-[#C9A961] mb-4">
                ✓
              </div>
              <h3 className="font-display text-3xl font-bold mb-4 text-[#F5F5DC]">
                You're on the list!
              </h3>
              <p className="font-body text-[#A8A890]">
                We'll be in touch shortly with your personalized onboarding plan.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block font-mono text-xs uppercase tracking-wider text-[#A8A890] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0A1415] border border-[#A8A890]/30 rounded-sm text-[#F5F5DC] font-body focus:outline-none focus:border-[#D47E3E] transition-colors"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block font-mono text-xs uppercase tracking-wider text-[#A8A890] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0A1415] border border-[#A8A890]/30 rounded-sm text-[#F5F5DC] font-body focus:outline-none focus:border-[#D47E3E] transition-colors"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="institution" className="block font-mono text-xs uppercase tracking-wider text-[#A8A890] mb-2">
                  Institution (Optional)
                </label>
                <input
                  type="text"
                  id="institution"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0A1415] border border-[#A8A890]/30 rounded-sm text-[#F5F5DC] font-body focus:outline-none focus:border-[#D47E3E] transition-colors"
                  placeholder="Your school or coaching center"
                />
              </div>

              <button
                type="submit"
                className="w-full px-10 py-4 bg-[#D47E3E] text-[#0D1B1C] font-body font-semibold text-lg rounded-sm hover:bg-[#E09558] transition-all duration-300 transform hover:scale-[1.02]"
              >
                Start Free Trial
              </button>

              <div className="text-center font-mono text-xs text-[#A8A890]">
                No credit card required · Cancel anytime
              </div>
            </form>
          )}
        </div>

        <div className="mt-12 text-center">
          <a
            href="#showcase"
            ref={setRef(4)}
            className="scroll-reveal font-mono text-sm uppercase tracking-wider text-[#C9A961] hover:text-[#D47E3E] transition-colors inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            See How It Works
          </a>
        </div>
      </div>
    </section>
  )
}
