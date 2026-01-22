'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const cetFeatures = [
    { label: 'Physics + Chemistry', value: '90 Mins' },
    { label: 'Mathematics', value: '90 Mins' },
    { label: 'Question Bank', value: '18,000+' },
    { label: 'Syllabus', value: '11th & 12th' },
];

export const CetSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section className="py-24 relative overflow-hidden bg-[#050a18]">
             {/* Abstract Circuitry Background */}
             <div className="absolute inset-0 opacity-10" 
                style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #38bdf8 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
             />

            <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-16">
                
                <div className="flex-1">
                    <motion.div
                        ref={ref}
                        initial={{ opacity: 0, x: -50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-block px-4 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 text-sm font-semibold tracking-wider mb-6">
                            SPECIALIZED MODE
                        </div>
                        <h2 className="font-heading text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
                            Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">CET Exam.</span>
                        </h2>
                        <p className="text-slate-400 text-lg leading-relaxed mb-8">
                            Practice with full-length CET papers. We use real exam patterns to create a unique test for you every time.
                        </p>

                        <ul className="space-y-4 mb-10">
                            {[
                                "Same pattern as real CET exam (PCM)",
                                "Strict timers for each section",
                                "Questions form 11th & 12th syllabus",
                                "Every student gets a different paper"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-slate-300">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <button className="px-8 py-4 rounded-full bg-white text-slate-900 font-bold hover:bg-sky-50 transition-colors">
                            Start CET Simulation
                        </button>
                    </motion.div>
                </div>

                {/* Right Side Stats / Visuals */}
                <div className="flex-1 w-full relative">
                    <div className="grid grid-cols-2 gap-4">
                        {cetFeatures.map((feat, i) => (
                             <motion.div 
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.5, delay: i * 0.1 + 0.3 }}
                                className="card-gloss p-6 rounded-2xl border border-slate-800 bg-slate-900/40 text-center"
                            >
                                <div className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">{feat.value}</div>
                                <div className="text-slate-400 text-sm tracking-widest uppercase font-mono">{feat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};
