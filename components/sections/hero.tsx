"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative py-20 overflow-hidden bg-background section-pattern">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-5xl mx-auto text-center"
        >
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 animate-float glass-effect">
              <span className="p-1.5 rounded-full bg-gradient-blue">
                <GraduationCap className="w-5 h-5 text-white" />
              </span>
              <span className="text-sm font-semibold text-muted-foreground">
                EduPrep <span className="mx-1">•</span> The Future of Exam Prep
              </span>
            </div>
          </div>

          <h1 className="mb-8 text-5xl font-bold tracking-tight md:text-7xl">
            Master Your Exams with
            <br className="hidden md:block" />
            <span className="text-gradient-blue"> Structured Learning</span>{" "}
            <span className="text-muted-foreground">&</span>{" "}
            <span className="text-gradient-ginger">Smart Practice</span>
          </h1>

          <p className="max-w-2xl mx-auto mb-10 text-xl text-muted-foreground leading-relaxed">
            EduPrep brings together structured content, smart practice tools, and performance insights in one place—making exam preparation focused, measurable, and less overwhelming.
          </p>

          <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-center">
            <Button
              size="lg"
              className="bg-gradient-blue hover-glow hover-glow-cool text-lg px-8 py-6 w-full sm:w-auto font-semibold"
              asChild
            >
              <Link href="/programs">
                Start Learning <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="hover-glow hover-glow-warm text-lg px-8 py-6 w-full sm:w-auto glass-effect border-secondary/20 font-medium"
              asChild
            >
              <Link href="/about">
                Explore Features <Sparkles className="w-4 h-4 ml-2 text-ginger-primary" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-primary/10 rounded-full blur-3xl -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-ginger-primary/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background opacity-80" />
      </div>
    </section>
  );
}