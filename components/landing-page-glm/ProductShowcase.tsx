'use client'

import { useEffect, useRef, useState } from 'react'

export default function ProductShowcase() {
  const [activeTab, setActiveTab] = useState(0)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const elementsRef = useRef<(HTMLElement | null)[]>([])

  const tabs = [
    { title: 'Structured Learning', icon: '📚' },
    { title: 'Smart Practice', icon: '🎯' },
    { title: 'Mock Tests', icon: '📝' },
    { title: 'Analytics', icon: '📊' }
  ]

  const content = [
    {
      heading: 'Learn with Purpose',
      description: 'Topic-wise and level-based content with clear progression paths. Video lessons, notes, and explanations organized for systematic learning.',
      stats: [{ label: '5000+ Topics', value: '5K+' }, { label: 'Video Lessons', value: '200+' }]
    },
    {
      heading: 'Practice Smartly',
      description: 'Questions mapped to concepts with difficulty-balanced sets. Get instant feedback and detailed solutions after every attempt.',
      stats: [{ label: 'Practice Questions', value: '50K+' }, { label: 'Concepts Covered', value: '1000+' }]
    },
    {
      heading: 'Test Like Real',
      description: 'Full-length and sectional mock exams in an exam-like environment with timing. Auto-evaluation and detailed score breakdowns.',
      stats: [{ label: 'Mock Tests', value: '500+' }, { label: 'Exam Types', value: '25+' }]
    },
    {
      heading: 'Know Your Progress',
      description: 'Strengths and weaknesses analysis with topic-wise accuracy and speed tracking. Personalized improvement suggestions.',
      stats: [{ label: 'Analytics Metrics', value: '15+' }, { label: 'Improvement Rate', value: '35%' }]
    }
  ]

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
    <section id="showcase" className="py-24 px-4 md:px-8 bg-[#0D1B1C]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div
            ref={setRef(0)}
            className="scroll-reveal font-mono text-sm tracking-widest uppercase mb-4 text-[#C9A961]"
          >
            Product Tour
          </div>
          <h2
            ref={setRef(1)}
            className="scroll-reveal font-display text-4xl md:text-6xl font-bold mb-6"
          >
            How EduPrep Works
          </h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-3">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`w-full text-left p-6 rounded-sm transition-all duration-300 ${
                  activeTab === index
                    ? 'bg-[#D47E3E] text-[#0D1B1C] transform scale-105'
                    : 'bg-[#0A1415] text-[#F5F5DC] hover:bg-[#A8A890]/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{tab.icon}</span>
                  <span className="font-display text-xl font-semibold">{tab.title}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-3">
            <div
              ref={setRef(2)}
              className="scroll-reveal bg-gradient-to-br from-[#0A1415] to-[#0D1B1C] p-8 rounded-sm border border-[#A8A890]/20 h-full"
            >
              <div className="mb-8">
                <h3 className="font-display text-3xl font-bold mb-4 text-[#D47E3E]">
                  {content[activeTab].heading}
                </h3>
                <p className="font-body text-lg text-[#A8A890] leading-relaxed">
                  {content[activeTab].description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {content[activeTab].stats.map((stat, index) => (
                  <div
                    key={index}
                    className="p-6 bg-[#0D1B1C] rounded-sm border border-[#A8A890]/10"
                  >
                    <div className="font-display text-4xl font-bold text-[#C9A961] mb-2">
                      {stat.value}
                    </div>
                    <div className="font-mono text-xs uppercase tracking-wider text-[#A8A890]">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-[#A8A890]/20">
                <div className="font-mono text-xs text-[#A8A890] mb-4">Simple Workflow</div>
                <div className="flex items-center justify-between text-sm">
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-[#D47E3E] flex items-center justify-center text-[#0D1B1C] font-bold mb-2">1</div>
                    <div className="font-body">Choose Goal</div>
                  </div>
                  <div className="flex-1 h-px bg-[#A8A890]/30 mx-2"></div>
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-[#C9A961] flex items-center justify-center text-[#0D1B1C] font-bold mb-2">2</div>
                    <div className="font-body">Learn</div>
                  </div>
                  <div className="flex-1 h-px bg-[#A8A890]/30 mx-2"></div>
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-[#C9A961] flex items-center justify-center text-[#0D1B1C] font-bold mb-2">3</div>
                    <div className="font-body">Practice</div>
                  </div>
                  <div className="flex-1 h-px bg-[#A8A890]/30 mx-2"></div>
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-[#C9A961] flex items-center justify-center text-[#0D1B1C] font-bold mb-2">4</div>
                    <div className="font-body">Improve</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
