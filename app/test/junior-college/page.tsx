"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { GraduationCap, Building2, Settings, ArrowRight } from "lucide-react";
import Link from "next/link";

const examTypes = [
  {
    id: "gate",
    title: "CET Exam",
    description: "Practice tests specifically designed for CET examination",
    icon: GraduationCap,
    href: "/test/junior-college/cet",
    color: "bg-blue-100 dark:bg-blue-900/50",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "custom",
    title: "Custom Practice",
    description: "Create your own test by selecting specific topics",
    icon: Settings,
    href: "/test/junior-college/custom",
    color: "bg-purple-100 dark:bg-purple-900/50",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const hoverEffect = {
  scale: 1.03,
  transition: { duration: 0.2, ease: "easeOut" },
};

export default function UndergraduatePage() {
  return (
    <div className="container py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Select Your Test Type
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the type of practice test that best fits your preparation
            needs
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-8 md:grid-cols-2 h-full"
        >
          {examTypes.map((type) => (
            <Link href={type.href} key={type.id} className="h-full group">
              <motion.div
                variants={item}
                className="h-full"
                whileHover={hoverEffect}
              >
                <Card className="h-full border border-gray-200 dark:border-gray-700 shadow-sm group-hover:shadow-md transition-all duration-300 overflow-hidden">
                  <CardContent className="p-0 h-full">
                    <div className={`${type.color} p-6 h-full flex flex-col`}>
                      <div className="flex items-start gap-5 mb-4">
                        <div className={`p-3 rounded-xl ${type.iconColor}`}>
                          <type.icon className="w-8 h-8" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-semibold mb-1">
                            {type.title}
                          </CardTitle>
                          <CardDescription className="text-base">
                            {type.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="mt-auto flex justify-end">
                        <div className="flex items-center text-sm font-medium text-primary">
                          Start practice
                          <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
