'use client';
import { motion } from 'framer-motion';

const steps = [
    { num: '01', title: 'Calibrate', desc: 'Select your exam and take a diagnostic test to establish your baseline.' },
    { num: '02', title: 'Learn', desc: 'Consume bite-sized, high-yield lessons tailored to your gaps.' },
    { num: '03', title: 'Simulate', desc: 'Take full-length mock exams in a realistic, timed environment.' },
    { num: '04', title: 'Evolve', desc: 'Review AI-generated insights and iterate on your strategy.' },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-32 bg-black/20">
      <div className="container mx-auto max-w-7xl px-6">
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24 flex flex-col md:flex-row justify-between items-end gap-10"
        >
            <h2 className="font-heading font-bold text-4xl md:text-6xl max-w-xl">
                The Science of Preparation.
            </h2>
            <p className="text-slate-400 max-w-sm text-lg">
                A systematic approach designed to maximize retention and minimize burnout.
            </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="relative group cursor-pointer"
                >
                    <div className="w-full h-[1px] bg-slate-800 mb-8 group-hover:bg-sky-500 transition-colors duration-500 origin-left" />
                    <span className="text-6xl font-heading font-black text-slate-800 absolute -top-4 right-4 transition-colors duration-500 group-hover:text-slate-700/50">
                        {step.num}
                    </span>
                    <h3 className="text-2xl font-bold mb-4 group-hover:text-sky-400 transition-colors">{step.title}</h3>
                    <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{step.desc}</p>
                </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};
