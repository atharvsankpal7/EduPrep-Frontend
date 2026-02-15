"use client";

import { motion } from "framer-motion";
import {
  ClipboardList,
  BarChart2,
  Users,
  BookOpen,
  Brain,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";

const features = [
  {
    icon: BookOpen,
    title: "Structured Learning",
    description: "Topic-wise and level-based content with clear progression paths instead of random material.",
    href: "/programs", // Assuming generic link or specific if available
    gradient: "bg-gradient-blue",
    hoverEffect: "hover-glow-cool",
  },
  {
    icon: Brain,
    title: "Smart Practice",
    description: "Practice questions mapped to concepts with instant feedback and detailed solutions.",
    href: "/practice", // Placeholder link
    gradient: "bg-gradient-ginger",
    hoverEffect: "hover-glow-warm",
  },
  {
    icon: ClipboardList,
    title: "Mock Tests",
    description: "Full-length and sectional mock exams in an exam-like environment with auto-evaluation.",
    href: "/test",
    gradient: "bg-gradient-cool",
    hoverEffect: "hover-glow-cool",
  },
  {
    icon: BarChart2,
    title: "Performance Analytics",
    description: "Deep insights into strengths and weaknesses with personalized improvement suggestions.",
    href: "/analytics",
    gradient: "bg-gradient-warm",
    hoverEffect: "hover-glow-warm",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Features() {
  return (
    <section className="py-20 bg-muted/50 section-pattern">
      <div className="container px-4 mx-auto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={container}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature) => (
            <motion.div variants={item}>
              <Card className={`h-full transition-all duration-300 hover:scale-105 card-highlight glass-effect ${feature.hoverEffect}`}>
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.gradient} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="mb-2">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}