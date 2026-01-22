'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export const Narrative = () => {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0.1, 0.3], [0.8, 1]);

    return (
        <section ref={sectionRef} className="min-h-screen flex items-center justify-center py-24 relative z-10">
            <motion.div
                style={{ opacity, scale }}
                className="max-w-4xl mx-auto px-6 text-center"
            >
                <h2 className="font-heading text-4xl md:text-6xl text-slate-300 leading-tight mb-12">
                    Most students practice <span className="text-red-400">the wrong way</span>.
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                    <div className="space-y-6">
                        <p className="text-xl md:text-2xl font-light text-slate-400 font-body">
                            They solve random questions. They guess answers. They make the same mistakes again and again.
                        </p>
                    </div>
                    <div className="space-y-6">
                        <p className="text-xl md:text-2xl font-light text-slate-400 font-body">
                            Without knowing your weak spots, studying is just luck. You don&apos;t need more hours. You need to know <span className="text-white border-b border-indigo-500 pb-1">where you are losing marks</span>.
                        </p>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};
