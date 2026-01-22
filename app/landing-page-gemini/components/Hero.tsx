'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowDown } from 'lucide-react';

export const Hero = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.9]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section ref={containerRef} className="relative h-screen flex flex-col justify-center items-center overflow-hidden">
      <motion.div 
        style={{ opacity, scale }}
        className="relative z-10 container mx-auto px-6 text-center"
      >
        <motion.div
           initial={{ opacity: 0, y: 50 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
            <h1 className="font-heading font-normal text-6xl md:text-8xl lg:text-9xl leading-[0.9] text-slate-100 mb-8 tracking-tighter">
              Confused?
              <span className="text-slate-700 mx-4 font-serif italic">to</span>
              Confident.
            </h1>
        </motion.div>

        <motion.div 
          style={{ y: yText }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="max-w-xl mx-auto"
        >
          <p className="text-xl md:text-2xl text-slate-400 font-light leading-relaxed font-body">
            Studying hard is not enough. You need the <span className="text-white">right plan</span> to score top marks.
          </p>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-slate-500 flex flex-col items-center gap-2"
      >
        <span className="text-xs uppercase tracking-[0.2em]">Begin the Journey</span>
        <ArrowDown className="w-4 h-4 animate-bounce" />
      </motion.div>
      
      {/* Subtle Background Grain */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
    </section>
  );
};
