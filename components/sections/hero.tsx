"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowRight } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative py-20 overflow-hidden bg-background section-pattern">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          <div className="flex items-center justify-center mb-8">
            <span className="p-3 rounded-full bg-gradient-blue animate-float glass-effect">
              <GraduationCap className="w-8 h-8 text-white" />
            </span>
          </div>
          <h1 className="mb-8 text-5xl font-bold tracking-tight md:text-6xl">
            Master Your Exams with
            <span className="text-gradient-blue"> Intelligent</span>{" "}
            <span className="text-gradient-ginger">Mock Tests</span>
          </h1>
          <p className="max-w-2xl mx-auto mb-10 text-xl text-muted-foreground">
            Enhance your test preparation with our advanced platform featuring
            real-time analytics, personalized recommendations, and collaborative
            study groups.
          </p>
          <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-blue hover-glow hover-glow-cool w-full sm:w-auto" 
              asChild
            >
              <Link href="/test">
                Start Practice Test <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="hover-glow hover-glow-warm w-full sm:w-auto glass-effect" 
              asChild
            >
              <Link href="/study-groups">Join Study Group</Link>
            </Button>
          </div>
        </motion.div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background opacity-80" />
    </section>
  );
}