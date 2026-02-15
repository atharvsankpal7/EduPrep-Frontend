"use client";

import { motion } from "framer-motion";
import {
    Target,
    BookOpen,
    CheckCircle2,
    FileText,
    TrendingUp,
    ArrowRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
    {
        icon: Target,
        title: "1. Choose Goal",
        description: "Select your exam, subject, or skill target.",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    {
        icon: BookOpen,
        title: "2. Learn",
        description: "Master concepts with structured lessons.",
        color: "text-ginger-500",
        bg: "bg-ginger-500/10",
    },
    {
        icon: CheckCircle2,
        title: "3. Practice",
        description: "Solve targeted questions & quizzes.",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    {
        icon: FileText,
        title: "4. Test",
        description: "Attempt full-length mock exams.",
        color: "text-ginger-500",
        bg: "bg-ginger-500/10",
    },
    {
        icon: TrendingUp,
        title: "5. Improve",
        description: "Analyze performance & boost scores.",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-20 bg-background relative overflow-hidden">
            <div className="container px-4 mx-auto relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        How EduPrep Works
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        A simple, guided path to exam success.
                    </p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid gap-6 md:grid-cols-5 relative"
                >


                    {steps.map((step, index) => (
                        <motion.div key={index} variants={item} className="relative">
                            <Card className="h-full border-2 border-transparent hover:border-primary/10 transition-all duration-300 shadow-lg hover:shadow-xl bg-card/50 backdrop-blur-xl">
                                <CardContent className="p-6 flex flex-col items-center text-center pt-8">
                                    <div className={`mb-4 p-3 rounded-full ${step.bg} ${step.color} ring-4 ring-background`}>
                                        <step.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-semibold mb-2">{step.title}</h3>
                                    <p className="text-sm text-muted-foreground">{step.description}</p>
                                </CardContent>
                            </Card>

                            {/* Mobile Arrow */}
                            {index < steps.length - 1 && (
                                <div className="md:hidden flex justify-center py-4 text-muted-foreground/30">
                                    <ArrowRight className="w-6 h-6 rotate-90" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Background Decor */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />
        </section>
    );
}
