"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GraduationCap, Building2 } from "lucide-react";
import Link from "next/link";

const educationLevels = [
  {
    id: "undergraduate",
    title: "Undergraduate",
    description: "For engineering and degree students",
    icon: GraduationCap,
    href: "/test/undergraduate",
  },
  {
    id: "junior-college",
    title: "Junior College",
    description: "For 11th and 12th standard students",
    icon: Building2,
    href: "/test/junior-college",
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

export default function TestPage() {
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Select Your Education Level</h1>
          <p className="text-muted-foreground">
            Choose your education level to get started with relevant mock tests
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 md:grid-cols-2"
        >
          {educationLevels.map((level) => (
            <Link href={level.href} key={level.id}>
              <motion.div variants={item}>
                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 card-highlight glass-effect">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-gradient-blue">
                        <level.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle>{level.title}</CardTitle>
                        <CardDescription>{level.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}