'use client';
import { motion } from 'framer-motion';
import { CheckCircle2, Users, FileBarChart, Clock } from 'lucide-react';

const benefits = [
    {
        title: "No More Paperwork",
        desc: "Don't waste time printing or typing question papers. Share tests with one click.",
        icon: FileBarChart
    },
    {
        title: "Automatic Checking",
        desc: "The computer checks every answer instantly. You get all the scores without lifting a pen.",
        icon: CheckCircle2
    },
    {
        title: "Spot Cheating Easily",
        desc: "See if a student switched tabs or finished too fast. Know exactly how they took the test.",
        icon: Users
    },
    {
        title: "Save Your Time",
        desc: "We handle the exam creation and checking. You focus on teaching the students.",
        icon: Clock
    }

];

export const TeacherBenefits = () => {
  return (
    <section className="py-32 bg-slate-900/30 relative border-t border-slate-800">
      <div className="container mx-auto max-w-7xl px-6">
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20 text-center"
        >
            <span className="text-sky-400 font-mono text-sm tracking-widest uppercase mb-4 block">For Educators & Institutes</span>
            <h2 className="font-heading font-bold text-4xl md:text-5xl text-white mb-6">
                Save Time. Gain Insights.
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                EduPrep dramatically reduces administrative workload, allowing you to focus on what matters most: your students.
            </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {benefits.map((step, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="relative group p-6 rounded-2xl hover:bg-slate-800/40 transition-colors border border-transparent hover:border-slate-800"
                >
                    <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-6 text-sky-400 group-hover:scale-110 transition-transform">
                        <step.icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-sky-300 transition-colors">{step.title}</h3>
                    <p className="text-slate-400 leading-relaxed text-sm">{step.desc}</p>
                </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};
