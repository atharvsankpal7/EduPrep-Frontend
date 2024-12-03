"use client";

import { motion } from "framer-motion";
import {
  ClipboardList,
  BarChart2,
  Users,
  BookOpen,
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
    icon: ClipboardList,
    title: "Mock Tests",
    description:
      "Practice with our extensive collection of subject-specific mock tests",
    href: "/test",
    gradient: "bg-gradient-blue",
    hoverEffect: "hover-glow-cool",
  },
  {
    icon: BarChart2,
    title: "Analytics",
    description:
      "Track your progress with detailed performance analytics and insights",
    href: "/analytics",
    gradient: "bg-gradient-ginger",
    hoverEffect: "hover-glow-warm",
  },
  {
    icon: Users,
    title: "Study Groups",
    description:
      "Join or create study groups to collaborate with fellow test-takers",
    href: "/study-groups",
    gradient: "bg-gradient-cool",
    hoverEffect: "hover-glow-cool",
  },
  {
    icon: BookOpen,
    title: "Study Plans",
    description: "Get personalized study plans based on your performance",
    href: "/recommendations",
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
            <Link href={feature.href} key={feature.href}>
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
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}