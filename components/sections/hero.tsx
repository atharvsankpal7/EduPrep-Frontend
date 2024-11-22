"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowRight } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative py-20 overflow-hidden bg-background">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          <div className="flex items-center justify-center mb-8">
            <span className="p-2 rounded-full bg-primary/10">
              <GraduationCap className="w-8 h-8 text-primary" />
            </span>
          </div>
          <h1 className="mb-8 text-5xl font-bold tracking-tight md:text-6xl">
            Master Your Exams with
            <span className="text-primary"> Intelligent</span> Mock Tests
          </h1>
          <p className="max-w-2xl mx-auto mb-10 text-xl text-muted-foreground">
            Enhance your test preparation with our advanced platform featuring
            real-time analytics, personalized recommendations, and collaborative
            study groups.
          </p>
          <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/mock-test">
                Start Practice Test <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/study-groups">Join Study Group</Link>
            </Button>
          </div>
        </motion.div>
      </div>
      <div className="absolute inset-0 bg-grid-white/10 bg-grid-16 [mask-image:radial-gradient(white,transparent_85%)]" />
    </section>
  );
}