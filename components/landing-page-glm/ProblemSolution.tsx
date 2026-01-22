'use client'

import { useEffect, useRef } from 'react'

export default function ProblemSolution() {
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

  return (
    <section className="py-24 px-4 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <div
            ref={setRef(0)}
            className="scroll-reveal font-mono text-sm tracking-[0.2em] uppercase mb-4 text-[#2962FF]"
          >
            What is EduPrep?
          </div>
          <h2
            ref={setRef(1)}
            className="scroll-reveal font-display text-4xl md:text-6xl font-bold mb-6 text-[#1A1A2E]"
          >
            Modern Examination Platform
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div
            ref={setRef(2)}
            className="scroll-reveal"
          >
            <p className="font-body text-lg text-[#4A4A68] leading-relaxed mb-6">
              EduPrep is an online examination and assessment platform that modernizes how students practice and how teachers conduct tests.
            </p>
            <p className="font-body text-lg text-[#4A4A68] leading-relaxed mb-6">
              It automatically generates unique, randomized question papers, evaluates responses instantly, and provides actionable insights — eliminating manual paper creation and checking.
            </p>
            <div className="bg-[#F0F4FF] rounded-lg p-6 border-l-4 border-[#2962FF]">
              <p className="font-body font-semibold text-[#1A1A2E]">
                Built specifically for Junior College and CET preparation, EduPrep focuses on fairness, discipline, and exam-realism.
              </p>
            </div>
          </div>

          <div
            ref={setRef(3)}
            className="scroll-reveal grid grid-cols-2 gap-4"
          >
            <div className="bg-[#FAFAF5] rounded-lg p-6 border border-[#2962FF]/10">
              <div className="font-display text-3xl font-bold text-[#2962FF] mb-2">Auto</div>
              <div className="font-mono text-xs uppercase tracking-wider text-[#4A4A68]">Paper Generation</div>
            </div>
            <div className="bg-[#FAFAF5] rounded-lg p-6 border border-[#2962FF]/10">
              <div className="font-display text-3xl font-bold text-[#2962FF] mb-2">Instant</div>
              <div className="font-mono text-xs uppercase tracking-wider text-[#4A4A68]">Evaluation</div>
            </div>
            <div className="bg-[#FAFAF5] rounded-lg p-6 border border-[#2962FF]/10">
              <div className="font-display text-3xl font-bold text-[#2962FF] mb-2">Action</div>
              <div className="font-mono text-xs uppercase tracking-wider text-[#4A4A68]">Insights</div>
            </div>
            <div className="bg-[#FAFAF5] rounded-lg p-6 border border-[#2962FF]/10">
              <div className="font-display text-3xl font-bold text-[#2962FF] mb-2">Secure</div>
              <div className="font-mono text-xs uppercase tracking-wider text-[#4A4A68]">Environment</div>
            </div>
          </div>
        </div>

        <div className="text-center border-t border-[#2962FF]/10 pt-16">
          <div className="scroll-reveal inline-flex items-center gap-4 font-body text-xl text-[#4A4A68]">
            <span className="font-display font-bold text-[#1A1A2E]">No Manual Checking</span>
            <span className="text-[#2962FF]">·</span>
            <span className="font-display font-bold text-[#1A1A2E]">Instant Results</span>
            <span className="text-[#2962FF]">·</span>
            <span className="font-display font-bold text-[#1A1A2E]">Fair Testing</span>
          </div>
        </div>
      </div>
    </section>
  )
}
