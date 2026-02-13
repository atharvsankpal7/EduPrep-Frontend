'use client'

import { useRef, useEffect, useState } from 'react'

export default function Hero() {
  const [timer, setTimer] = useState({ hours: 1, minutes: 30, seconds: 0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => {
        let { hours, minutes, seconds } = prev
        seconds--
        if (seconds < 0) {
          seconds = 59
          minutes--
          if (minutes < 0) {
            minutes = 59
            hours--
            if (hours < 0) {
              clearInterval(interval)
              return prev
            }
          }
        }
        return { hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()

    const gridSize = 40
    let offset = 0

    function animate() {
      if (!ctx || !canvas) return

      ctx.fillStyle = '#FAFAF5'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.strokeStyle = 'rgba(41, 98, 255, 0.05)'
      ctx.lineWidth = 1

      // OPTIMIZATION: Batching draw calls reduces GPU overhead from ~1300/frame to 1/frame.
      ctx.beginPath()
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          const size = Math.sin((x + y + offset) * 0.02) * 4 + 8
          const r = Math.abs(size)
          // Move to the start point of the arc to prevent connecting line
          ctx.moveTo(x + r, y)
          ctx.arc(x, y, r, 0, Math.PI * 2)
        }
      }
      ctx.stroke()

      offset += 0.5
      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      resizeCanvas()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#FAFAF5] text-[#1A1A2E]">
      <canvas ref={canvasRef} className="absolute inset-0" />

      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <div className="animate-fade-in-up font-mono text-sm tracking-[0.2em] uppercase mb-6 text-[#2962FF]">
          Smart Testing Platform
        </div>

        <h1 className="animate-fade-in-up delay-100 font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6 text-[#1A1A2E]">
          Junior College & CET
        </h1>

        <p className="animate-fade-in-up delay-200 font-body text-xl md:text-2xl text-[#4A4A68] max-w-2xl mx-auto mb-8 leading-relaxed">
          Personalized. Secure. Exam-Ready.
        </p>

        <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <a href="#conversion" className="px-12 py-4 bg-[#2962FF] text-white font-body font-semibold text-lg rounded hover:bg-[#1E40AF] transition-all duration-300 transform hover:scale-105 shadow-lg">
            Start Practicing Now
          </a>
          <a href="#cet-mode" className="px-12 py-4 border-2 border-[#2962FF] text-[#1A1A2E] font-body font-semibold text-lg rounded hover:bg-[#2962FF] hover:text-white transition-all duration-300">
            Try a CET Mock Test
          </a>
        </div>

        <div className="animate-fade-in-up delay-400 bg-white/80 backdrop-blur-sm rounded-lg p-6 inline-flex items-center gap-8 border border-[#2962FF]/10 shadow-md">
          <div className="text-center">
            <div className="font-mono text-4xl font-bold text-[#2962FF]">
              {String(timer.hours).padStart(2, '0')}:{String(timer.minutes).padStart(2, '0')}:{String(timer.seconds).padStart(2, '0')}
            </div>
            <div className="font-mono text-xs uppercase tracking-wider text-[#4A4A68] mt-2">Sample Test Timer</div>
          </div>
          <div className="h-12 w-px bg-[#2962FF]/20"></div>
          <div className="text-left">
            <div className="font-body font-semibold text-[#1A1A2E]">18,000+</div>
            <div className="font-mono text-xs uppercase tracking-wider text-[#4A4A68]">Questions in Bank</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-[#2962FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
