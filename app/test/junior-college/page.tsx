"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { GraduationCap, Building2, Settings } from "lucide-react";
import Link from "next/link";

const examTypes = [
  {
    id: "gate",
    title: "CET Exam",
    description: "Practice tests specifically designed for CET examination",
    icon: GraduationCap,
    href: "/test/junior-college/cet",
  },
  {
    id: "custom",
    title: "Custom Practice",
    description: "Create your own test by selecting specific topics",
    icon: Settings,
    href: "/test/junior-college/custom",
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

export default function UndergraduatePage() {
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Select Test Type</h1>
          <p className="text-muted-foreground">
            Choose the type of test you want to take
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 md:grid-cols-3"
        >
          {examTypes.map((type) => (
            <Link href={type.href} key={type.id}>
              <motion.div variants={item}>
                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 card-highlight glass-effect">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-lg ${
                          type.id === "cet"
                            ? "bg-gradient-blue"
                            : type.id === "company"
                            ? "bg-gradient-ginger"
                            : "bg-gradient-cool"
                        }`}
                      >
                        <type.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle>{type.title}</CardTitle>
                        <CardDescription>{type.description}</CardDescription>
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
