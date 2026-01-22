'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { Layout, Shuffle, ShieldAlert, BarChart3, Clock } from 'lucide-react';

const steps = [
    {
        id: 'personalize',
        title: 'Create Your Own Test',
        desc: "Don't solve boring papers. Pick your chapters, number of questions, and difficulty. Make a test that fits your study plan perfectly.",
        icon: Layout,
        gradient: "from-blue-600 to-indigo-600",
        stat: "100% Your Way"
    },
    {
        id: 'randomize',
        title: 'New Questions Every Time',
        desc: "We have over 18,000 questions. Every time you start a test, you get a fresh set of questions. No copying, no memorizing answers.",
        icon: Shuffle,
        gradient: "from-purple-600 to-pink-600",
        stat: "18k+ Q-Bank"
    },
    {
        id: 'simulate',
        title: 'Feel The Exam Pressure',
        desc: "Strict timers. Full-screen mode. If you switch tabs, the test submits automatically. Practice like it's the real final exam.",
        icon: ShieldAlert,
        gradient: "from-red-600 to-orange-600",
        stat: "Strict Rules"
    },
    {
        id: 'analyze',
        title: 'Check Your Performance',
        desc: "Immediate results after you submit. See which topics are weak and how fast you solved each question. Fix your mistakes instantly.",
        icon: BarChart3,
        gradient: "from-emerald-600 to-teal-600",
        stat: "Instant Result"
    }
];

export const JourneyScroll = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    return (
        <section ref={containerRef} className="relative bg-slate-950">
            {steps.map((step, index) => {
                return (
                    <JourneyStep key={step.id} step={step} index={index} total={steps.length} />
                );
            })}
        </section>
    );
};

const JourneyStep = ({ step, index, total }: any) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Content reveals
    const opacity = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 1, 0]);
    const y = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [100, 0, -100]);
    const scale = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0.8, 1, 0.8]);

    return (
        <div ref={ref} className="min-h-screen flex items-center justify-center sticky top-0 bg-slate-950 border-t border-slate-900/50 overflow-hidden">
             
             {/* Background Gradient for Atmosphere */}
             <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${step.gradient} blur-[150px]`} />

             <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                
                {/* Text Content */}
                <motion.div style={{ opacity, y }} className="order-2 md:order-1">
                     <div className="flex items-center gap-4 mb-6">
                        <span className="font-mono text-xs md:text-sm text-slate-500 tracking-widest uppercase">
                            Step 0{index + 1}
                        </span>
                        <div className="h-px w-12 bg-slate-800" />
                     </div>
                     
                     <h3 className="font-heading text-5xl md:text-7xl text-slate-100 mb-8">
                        {step.title}
                     </h3>
                     <p className="text-xl md:text-2xl text-slate-400 font-light leading-relaxed font-body max-w-lg">
                        {step.desc}
                     </p>
                </motion.div>

                {/* Visual / Icon Abstract */}
                <motion.div 
                    style={{ scale, opacity }} 
                    className="order-1 md:order-2 flex justify-center items-center"
                >
                    <div className={`w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-gradient-to-tr ${step.gradient} opacity-20 blur-[80px] absolute`} />
                    <div className="relative z-10 w-full aspect-square max-w-md mx-auto border border-slate-800 bg-slate-900/40 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-12">
                         <step.icon strokeWidth={1} className="w-32 h-32 text-slate-200 mb-8 opacity-80" />
                         <div className="text-4xl md:text-6xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">
                            {step.stat}
                         </div>
                    </div>
                </motion.div>

             </div>
        </div>
    );
};
