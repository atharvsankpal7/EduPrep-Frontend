'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FileText, ShieldAlert, Clock, BarChart3, Shuffle, Layout, UserCheck, Smartphone } from 'lucide-react';

const FeatureCard = ({ title, description, icon: Icon, delay, className }: any) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: delay }}
      className={`card-gloss rounded-3xl p-8 flex flex-col justify-between group overflow-hidden relative ${className}`}
    >
        <div className="absolute top-0 right-0 p-32 bg-sky-500/5 rounded-full blur-[80px] group-hover:bg-sky-500/10 transition-colors duration-500" />
      
        <div className="relative z-10 flex flex-col h-full">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-6 border border-slate-700/50 group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-6 h-6 text-sky-400" />
            </div>
            <div>
                <h3 className="text-2xl font-heading font-bold mb-3 text-white">{title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm md:text-base">{description}</p>
            </div>
        </div>
    </motion.div>
  );
};

export const Features = () => {
    return (
        <section id="features" className="py-24 px-6 relative">
             <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent opacity-50" />
            
            <div className="container mx-auto max-w-7xl">
                <div className="mb-20 text-center max-w-3xl mx-auto">
                    <h2 className="font-heading font-bold text-4xl md:text-5xl mb-6">
                        Practice Your Way.
                    </h2>
                    <p className="text-xl text-slate-400">
                        Create unique tests, experience real exam conditions, and get instant feedback. No two tests are ever the same.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
                    {/* Personalized Tests - Large */}
                    <FeatureCard 
                        title="Personalized Custom Tests" 
                        description="Don't just solve random questions. Customize your practice by choosing specific Subjects, Chapters, and Topics. Set the exact number of questions and duration to fit your study schedule. Every attempt generates a fresh paper."
                        icon={Layout}
                        delay={0.1}
                        className="md:col-span-2 bg-gradient-to-br from-slate-900/80 to-slate-900/30"
                    />

                    {/* Randomization */}
                    <FeatureCard 
                        title="Intelligent Randomization" 
                        description="Our algorithm pulls questions from a bank of ~18,000+ items. Random selection ensures fairness and prevents meaningless repetition."
                        icon={Shuffle}
                        delay={0.2}
                        className="md:col-span-1"
                    />

                    {/* Security */}
                     <FeatureCard 
                        title="Anti-Cheating Security" 
                        description="Strict proctoring with full-screen enforcement. Tab-switching is monitored—switched > 3 times? Auto-submit. Detailed activity logs for teachers."
                        icon={ShieldAlert}
                        delay={0.3}
                        className="md:col-span-1 border-red-500/20"
                    />

                    {/* Time Control */}
                    <FeatureCard 
                        title="Exam-Like Discipline" 
                        description="Live countdown timers and auto-submission when time is up. Simulates the pressure of the real exam hall."
                        icon={Clock}
                        delay={0.4}
                        className="md:col-span-1"
                    />

                     {/* Instant Results */}
                    <FeatureCard 
                        title="Instant Analytics" 
                        description="Get results immediately. See correct vs wrong answers, unattempted questions, and shareable performance reports instantly."
                        icon={BarChart3}
                        delay={0.5}
                        className="md:col-span-1"
                    />
                </div>
            </div>
        </section>
    );
};
