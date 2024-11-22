"use client";

import { motion } from "framer-motion";
import { 
  ClipboardList, 
  BarChart2, 
  Users, 
  BookOpen,
  CheckCircle 
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const features = [
  {
    icon: ClipboardList,
    title: "Mock Tests",
    description: "Practice with our extensive collection of subject-specific mock tests"
  },
  {
    icon: BarChart2,
    title: "Analytics",
    description: "Track your progress with detailed performance analytics and insights"
  },
  {
    icon: Users,
    title: "Study Groups",
    description: "Join or create study groups to collaborate with fellow test-takers"
  },
  {
    icon: BookOpen,
    title: "Study Plans",
    description: "Get personalized study plans based on your performance"
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function Features() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container px-4 mx-auto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={container}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={item}>
              <Card className="h-full transition-colors hover:bg-muted/50">
                <CardHeader>
                  <feature.icon className="w-10 h-10 mb-4 text-primary" />
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