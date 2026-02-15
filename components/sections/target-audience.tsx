"use client";

import { motion } from "framer-motion";
import {
    GraduationCap,
    Users,
    Laptop,
    Building2
} from "lucide-react";

const audiences = [
    {
        icon: GraduationCap,
        title: "Students",
        description: "School & college students preparing for exams.",
        color: "text-blue-500",
    },
    {
        icon: Users,
        title: "Aspirants",
        description: "Competitive exam aspirants (entrance tests, govt exams).",
        color: "text-ginger-500",
    },
    {
        icon: Laptop,
        title: "Self-Learners",
        description: "Individuals seeking structured preparation.",
        color: "text-blue-500",
    },
    {
        icon: Building2,
        title: "Institutes",
        description: "Coaching centers & educators delivering digital content.",
        color: "text-ginger-500",
    },
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
};

export function TargetAudience() {
    return (
        <section className="py-20 bg-muted/30 section-pattern border-y border-border/50">
            <div className="container px-4 mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">
                        Who is <span className="text-gradient-blue">EduPrep</span> for?
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Tailored for every learner and educator.
                    </p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
                >
                    {audiences.map((audience, index) => (
                        <motion.div key={index} variants={item}>
                            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-background/50 backdrop-blur-xl shadow-md border border-border/50 hover:border-primary/20 transition-all hover:shadow-lg h-full">
                                <div className={`p-3 rounded-full bg-background shadow-sm mb-4 ${audience.color}`}>
                                    <audience.icon className="w-8 h-8" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">{audience.title}</h3>
                                <p className="text-sm text-muted-foreground">{audience.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
