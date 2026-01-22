'use client';
import { motion } from 'framer-motion';

export const SocialProof = () => {
    return (
        <section id="reviews" className="py-24 flex items-center justify-center relative">
             <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
            <div className="container mx-auto px-6 text-center">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <QuoteIcon className="w-10 h-10 text-sky-500 mx-auto mb-8 opacity-50" />
                    
                    <h3 className="font-heading font-medium text-3xl md:text-5xl leading-tight max-w-5xl mx-auto mb-12 text-slate-200">
                        "EduPrep helps me <span className="text-sky-400">understand the exam</span>. The strict timing forced me to improve my speed."
                    </h3>
                    
                    <div className="flex flex-col items-center justify-center gap-2">
                         <div className="w-16 h-1 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full mb-4" />
                        <div className="font-bold text-white text-lg tracking-wide">WHY IT WORKS</div>
                        <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm text-slate-400 font-mono">
                            <span className="px-3 py-1 bg-slate-900 rounded-full border border-slate-800">REAL EXAM PRACTICE</span>
                            <span className="px-3 py-1 bg-slate-900 rounded-full border border-slate-800">INSTANT INSIGHTS</span>
                            <span className="px-3 py-1 bg-slate-900 rounded-full border border-slate-800">SCALABLE FOR INSTITUTES</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

const QuoteIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
    </svg>
);
