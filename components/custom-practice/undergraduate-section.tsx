"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Building2, Settings } from "lucide-react";
import { ExamCategories } from "./exam-categories";
import { CompanySpecific } from "./company-specific";
import { CustomizedTest } from "./customized-test";

const examTypes = [
  {
    id: "gate",
    title: "GATE Exam",
    description: "Practice tests specifically designed for GATE examination",
    icon: GraduationCap,
    component: ExamCategories,
  },
  {
    id: "company",
    title: "Company Specific",
    description: "Tests tailored to specific company recruitment patterns",
    icon: Building2,
    component: CompanySpecific,
  },
  {
    id: "custom",
    title: "Customized Test",
    description: "Create your own test by selecting specific topics",
    icon: Settings,
    component: CustomizedTest,
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

export function UndergraduateSection() {
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const selectedComponent = examTypes.find(exam => exam.id === selectedExam)?.component;

  if (selectedExam && selectedComponent) {
    const Component = selectedComponent;
    return <Component onBack={() => setSelectedExam(null)} />;
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-6 md:grid-cols-3"
    >
      {examTypes.map((exam) => (
        <motion.div key={exam.id} variants={item}>
          <Card 
            className="cursor-pointer hover:glass-effect transition-all duration-300 card-highlight "
            onClick={() => setSelectedExam(exam.id)}
          >
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${exam.id === 'gate' ? 'bg-gradient-blue' : exam.id === 'company' ? 'bg-gradient-ginger' : 'bg-gradient-cool'}`}>
                  <exam.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle>{exam.title}</CardTitle>
                  <CardDescription>{exam.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}